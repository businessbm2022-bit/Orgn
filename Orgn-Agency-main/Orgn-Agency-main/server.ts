import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  initAuthStore,
  isAuthInitialized,
  getOrCreateSetupToken,
  setupInitialAdmin,
  getAuthRecord,
  verifyPassword,
  updateAdminPassword,
  recordAdminLogin,
  createSession,
  validateSession,
  getSessionUsername,
  deleteSession,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "./server/auth";
import {
  initContentStore,
  getContentEnvelope,
  saveDraftContent,
  publishContent,
  getInquiries,
  addInquiry,
  updateInquiry,
  deleteInquiry,
  getMediaAssets,
  addMediaAsset,
  deleteMediaAsset,
  ContentEnvelope,
} from "./server/cmsStore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const isProduction = process.env.NODE_ENV === "production";

// Initialize persistent stores
initAuthStore();
initContentStore();

// Middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());

// Static uploads serving
const uploadsDir = path.resolve(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// ---------------------------------------------------------------------------
// REAL-TIME CONTENT SSE (SERVER-SENT EVENTS) SUBSCRIPTION POOL
// ---------------------------------------------------------------------------
const sseClients = new Set<Response>();

function broadcastContentUpdate(envelope: ContentEnvelope): void {
  const payload = JSON.stringify({
    type: "CONTENT_PUBLISHED",
    published: envelope.published,
    lastPublished: envelope.lastPublished,
    lastUpdated: envelope.lastUpdated,
  });

  for (const client of sseClients) {
    try {
      client.write(`event: content_update\ndata: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Client IP resolver helper
function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "127.0.0.1";
}

// Session extraction helper (Cookie or Bearer Token)
function getRequestSessionId(req: Request): string | undefined {
  if (req.cookies && req.cookies.orgn_admin_session) {
    return req.cookies.orgn_admin_session;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  return undefined;
}

// Authentication Guard Middleware for Protected Administrative APIs
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const sessionId = getRequestSessionId(req);
  if (!sessionId || !validateSession(sessionId)) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Valid administrator authentication required to perform this action.",
    });
  }
  next();
}

// ---------------------------------------------------------------------------
// 1. AUTHENTICATION & SECURITY ENDPOINTS (ZERO DEFAULT PASSWORDS)
// ---------------------------------------------------------------------------

// GET /api/auth/status — Checks whether the master admin exists
app.get("/api/auth/status", (req: Request, res: Response) => {
  const initialized = isAuthInitialized();
  const sessionId = getRequestSessionId(req);
  const authenticated = validateSession(sessionId);

  // In non-production development environments, provide a convenient setup token hint
  // so the site owner testing in AI Studio can complete first-time configuration smoothly
  const token = !initialized ? getOrCreateSetupToken() : null;

  return res.json({
    initialized,
    authenticated,
    setupTokenRequired: !initialized,
    devSetupHint: !isProduction && !initialized ? token : undefined,
    message: initialized
      ? "Administrator account is configured."
      : "First-time owner setup required. Use your Owner Setup Key to create your master administrator account.",
  });
});

// POST /api/auth/setup — Initial owner account setup
app.post("/api/auth/setup", (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const { allowed, waitSeconds } = checkRateLimit(clientIp);

  if (!allowed) {
    return res.status(429).json({
      error: "Too Many Requests",
      message: `Too many failed setup attempts. Please wait ${waitSeconds} seconds before trying again.`,
      waitSeconds,
    });
  }

  if (isAuthInitialized()) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Administrator account has already been initialized. Setup is permanently locked.",
    });
  }

  const { setupToken, username, password, confirmPassword } = req.body;

  if (!setupToken || !password) {
    recordFailedAttempt(clientIp);
    return res.status(400).json({
      error: "Bad Request",
      message: "Owner Setup Key and Password are required.",
    });
  }

  if (password !== confirmPassword) {
    recordFailedAttempt(clientIp);
    return res.status(400).json({
      error: "Bad Request",
      message: "Password and password confirmation do not match.",
    });
  }

  const result = setupInitialAdmin(setupToken, username || "admin", password);
  if (!result.success) {
    recordFailedAttempt(clientIp);
    return res.status(400).json({
      error: "Setup Failed",
      message: result.message,
    });
  }

  // Setup successful: clear rate limiting and immediately log in the administrator
  resetRateLimit(clientIp);
  const cleanUsername = (username || "admin").trim();
  const sessionId = createSession(cleanUsername);

  res.cookie("orgn_admin_session", sessionId, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  return res.status(201).json({
    success: true,
    token: sessionId,
    user: {
      username: cleanUsername,
      lastLoginAt: new Date().toISOString(),
    },
    message: "Administrator account initialized successfully.",
  });
});

// POST /api/auth/login — Secure rate-limited login
app.post("/api/auth/login", (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const { allowed, waitSeconds } = checkRateLimit(clientIp);

  if (!allowed) {
    return res.status(429).json({
      error: "Too Many Requests",
      message: `Too many failed login attempts. Please wait ${waitSeconds} seconds before trying again.`,
      waitSeconds,
    });
  }

  if (!isAuthInitialized()) {
    return res.status(400).json({
      error: "Setup Required",
      message: "Initial administrator setup has not been performed yet.",
      requiresSetup: true,
    });
  }

  const { password } = req.body;
  if (!password || typeof password !== "string") {
    recordFailedAttempt(clientIp);
    return res.status(400).json({
      error: "Bad Request",
      message: "Password is required.",
    });
  }

  const authRecord = getAuthRecord();
  if (!authRecord) {
    return res.status(500).json({ error: "Auth Store Error", message: "Failed to read credentials." });
  }

  const isValid = verifyPassword(password, authRecord.salt, authRecord.hash);

  if (!isValid) {
    const attempts = recordFailedAttempt(clientIp);
    const remaining = Math.max(0, 5 - attempts);
    return res.status(401).json({
      error: "Invalid Credentials",
      message:
        remaining > 0
          ? `Incorrect password. ${remaining} attempt(s) remaining before temporary lockout.`
          : "Too many failed attempts. Account temporarily locked for 15 minutes.",
      remainingAttempts: remaining,
    });
  }

  // Authentication succeeded!
  resetRateLimit(clientIp);
  recordAdminLogin();
  const sessionId = createSession(authRecord.adminUsername);

  // Set secure HttpOnly cookie
  res.cookie("orgn_admin_session", sessionId, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: "/",
  });

  return res.json({
    success: true,
    token: sessionId,
    user: {
      username: authRecord.adminUsername,
      lastLoginAt: authRecord.lastLoginAt,
    },
    message: "Authenticated successfully.",
  });
});

// POST /api/auth/logout
app.post("/api/auth/logout", (req: Request, res: Response) => {
  const sessionId = getRequestSessionId(req);
  if (sessionId) {
    deleteSession(sessionId);
  }
  res.clearCookie("orgn_admin_session", { path: "/" });
  return res.json({ success: true, message: "Logged out successfully." });
});

// GET /api/auth/session
app.get("/api/auth/session", (req: Request, res: Response) => {
  const sessionId = getRequestSessionId(req);
  const isValid = validateSession(sessionId);
  if (!isValid) {
    return res.json({ authenticated: false });
  }
  const authRecord = getAuthRecord();
  const sessionUsername = getSessionUsername(sessionId);
  return res.json({
    authenticated: true,
    user: {
      username: sessionUsername || authRecord?.adminUsername || "admin",
      lastLoginAt: authRecord?.lastLoginAt,
      createdAt: authRecord?.createdAt,
    },
  });
});

// POST /api/auth/change-password (Protected)
app.post("/api/auth/change-password", requireAdminAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Current password and new password are required.",
    });
  }

  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return res.status(400).json({
      error: "Invalid Password",
      message: "New password must be at least 8 characters long.",
    });
  }

  const authRecord = getAuthRecord();
  if (!authRecord) {
    return res.status(500).json({ error: "Auth Store Error", message: "Account record not found." });
  }

  const isValid = verifyPassword(currentPassword, authRecord.salt, authRecord.hash);
  if (!isValid) {
    return res.status(401).json({
      error: "Verification Failed",
      message: "Current password is incorrect.",
    });
  }

  updateAdminPassword(newPassword);
  return res.json({
    success: true,
    message: "Administrator password updated successfully.",
  });
});

// ---------------------------------------------------------------------------
// 2. CONTENT MANAGEMENT & REAL-TIME STREAMING ENDPOINTS
// ---------------------------------------------------------------------------

// GET /api/content/stream (Server-Sent Events for instant live updates across all clients)
app.get("/api/content/stream", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  // Send initial connected ping
  res.write(": connected\n\n");
  sseClients.add(res);

  // Heartbeat ping every 25 seconds
  const pingInterval = setInterval(() => {
    try {
      res.write(": ping\n\n");
    } catch {
      clearInterval(pingInterval);
      sseClients.delete(res);
    }
  }, 25000);

  req.on("close", () => {
    clearInterval(pingInterval);
    sseClients.delete(res);
  });
});

// GET /api/content (Public / Admin Dual-Mode)
app.get("/api/content", (req: Request, res: Response) => {
  const envelope = getContentEnvelope();
  const sessionId = getRequestSessionId(req);
  const isAdmin = validateSession(sessionId);

  if (isAdmin && req.query.mode === "draft") {
    return res.json({
      content: envelope.draft,
      published: envelope.published,
      lastUpdated: envelope.lastUpdated,
      lastPublished: envelope.lastPublished,
      isDraft: true,
    });
  }

  // Public visitor: ONLY gets published content
  return res.json({
    content: envelope.published,
    lastPublished: envelope.lastPublished,
    isDraft: false,
  });
});

// PUT /api/content/draft (Protected)
app.put("/api/content/draft", requireAdminAuth, (req: Request, res: Response) => {
  const { draft } = req.body;
  if (!draft) {
    return res.status(400).json({ error: "Draft content object required." });
  }
  const updated = saveDraftContent(draft);
  return res.json({
    success: true,
    envelope: updated,
    message: "Draft saved successfully.",
  });
});

// POST /api/content/publish (Protected) — Broadcasts live update instantly to all clients!
app.post("/api/content/publish", requireAdminAuth, (req: Request, res: Response) => {
  const { content } = req.body;
  const updated = publishContent(content);

  // Broadcast real-time update event to all connected public visitors & tabs
  broadcastContentUpdate(updated);

  return res.json({
    success: true,
    envelope: updated,
    message: "Website published successfully! Changes are now live.",
  });
});

// ---------------------------------------------------------------------------
// 3. CONTACT INQUIRIES ENDPOINTS
// ---------------------------------------------------------------------------

// POST /api/inquiries (Public Submission)
app.post("/api/inquiries", (req: Request, res: Response) => {
  const { fullName, companyName, email, phone, service, budget, details } = req.body;

  if (!fullName || !companyName || !email || !service || !details) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Please fill in all required fields (Name, Company, Email, Service, Details).",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Please provide a valid email address.",
    });
  }

  const record = addInquiry({
    fullName: String(fullName).trim(),
    companyName: String(companyName).trim(),
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : undefined,
    service: String(service).trim(),
    budget: budget ? String(budget).trim() : undefined,
    details: String(details).trim(),
  });

  return res.status(201).json({
    success: true,
    inquiryId: record.id,
    message: "Your inquiry has been received. Our team will contact you shortly.",
  });
});

// GET /api/inquiries (Protected)
app.get("/api/inquiries", requireAdminAuth, (req: Request, res: Response) => {
  let list = getInquiries();
  const { search, status } = req.query;

  if (typeof status === "string" && status !== "All") {
    list = list.filter((i) => i.status === status);
  }

  if (typeof search === "string" && search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      (i) =>
        i.fullName.toLowerCase().includes(q) ||
        i.companyName.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.details.toLowerCase().includes(q)
    );
  }

  return res.json({ inquiries: list, total: list.length });
});

// PATCH /api/inquiries/:id (Protected)
app.patch("/api/inquiries/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, internalNotes } = req.body;

  const updated = updateInquiry(id, { status, internalNotes });
  if (!updated) {
    return res.status(404).json({ error: "Inquiry not found." });
  }

  return res.json({ success: true, inquiry: updated });
});

// DELETE /api/inquiries/:id (Protected)
app.delete("/api/inquiries/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = deleteInquiry(id);
  if (!deleted) {
    return res.status(404).json({ error: "Inquiry not found." });
  }
  return res.json({ success: true, message: "Inquiry deleted." });
});

// ---------------------------------------------------------------------------
// 4. MEDIA MANAGEMENT ENDPOINTS
// ---------------------------------------------------------------------------

// GET /api/media (Protected)
app.get("/api/media", requireAdminAuth, (_req: Request, res: Response) => {
  const media = getMediaAssets();
  return res.json({ assets: media });
});

// POST /api/media/upload (Protected)
app.post("/api/media/upload", requireAdminAuth, (req: Request, res: Response) => {
  const { base64Data, filename, mimeType, width, height } = req.body;

  if (!base64Data || !filename) {
    return res.status(400).json({ error: "Base64 data and filename are required." });
  }

  try {
    const cleanBase64 = base64Data.replace(/^data:[a-zA-Z0-9_\-\.\/]+;base64,/, "");
    let buffer = Buffer.from(cleanBase64, "base64");

    // File size check: 15MB
    if (buffer.length > 15 * 1024 * 1024) {
      return res.status(400).json({ error: "File exceeds 15MB limit." });
    }

    const sanitizedName = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const uniqueName = `${Date.now()}_${sanitizedName}`;
    const targetPath = path.join(uploadsDir, uniqueName);

    // SVG sanitization
    const isSvg = mimeType === "image/svg+xml" || filename.toLowerCase().endsWith(".svg");
    if (isSvg) {
      let svgText = buffer.toString("utf-8");
      svgText = svgText
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
        .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, "");
      buffer = Buffer.from(svgText, "utf-8");
    }

    fs.writeFileSync(targetPath, buffer);

    const asset = addMediaAsset({
      name: sanitizedName,
      url: `/uploads/${uniqueName}`,
      fileSize: buffer.length,
      mimeType: mimeType || (isSvg ? "image/svg+xml" : "image/jpeg"),
      width: width ? Number(width) : undefined,
      height: height ? Number(height) : undefined,
    });

    return res.json({
      success: true,
      asset,
      message: "File uploaded successfully.",
    });
  } catch (err: any) {
    return res.status(500).json({
      error: "Upload Failed",
      message: err.message || "Failed to process image upload.",
    });
  }
});

// DELETE /api/media/:id (Protected)
app.delete("/api/media/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = deleteMediaAsset(id);
  if (!deleted) {
    return res.status(404).json({ error: "Media asset not found." });
  }
  return res.json({ success: true, message: "Media asset deleted." });
});

// ---------------------------------------------------------------------------
// 5. SERVER MOUNT & FRONTEND INTEGRATION
// ---------------------------------------------------------------------------

async function startServer() {
  if (!isProduction) {
    // Mount Vite Dev Server in middleware mode
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ORGN Agency Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
