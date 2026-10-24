import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Centralized persistent data directory
const DATA_DIR = path.resolve(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const AUTH_FILE = path.join(DATA_DIR, "orgn_auth.json");
const SETUP_SECRET_FILE = path.join(DATA_DIR, "orgn_setup_token.secret");

// ---------------------------------------------------------------------------
// PASSWORD HASHING (Salted Scrypt - Cryptographically Secure)
// ---------------------------------------------------------------------------
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    salt,
    hash: derivedKey.toString("hex"),
  };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(derivedKey.toString("hex"), "hex");
    const hashBuffer = Buffer.from(hash, "hex");
    if (keyBuffer.length !== hashBuffer.length) return false;
    return crypto.timingSafeEqual(keyBuffer, hashBuffer);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// OWNER SETUP TOKEN MANAGEMENT (Zero Default Passwords)
// ---------------------------------------------------------------------------
export interface AuthRecord {
  adminUsername: string;
  salt: string;
  hash: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

let activeSetupToken: string | null = null;

/**
 * Returns true if the administrator account has already been initialized.
 * NEVER creates a default admin account.
 */
export function isAuthInitialized(): boolean {
  if (!fs.existsSync(AUTH_FILE)) {
    return false;
  }
  try {
    const raw = fs.readFileSync(AUTH_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Boolean(data && data.adminUsername && data.salt && data.hash);
  } catch {
    return false;
  }
}

/**
 * Retrieves or generates the secure owner setup token used for first-time admin setup.
 * Does NOT generate a default password.
 */
export function getOrCreateSetupToken(): string | null {
  if (isAuthInitialized()) {
    // Setup already finished; tokens are permanently invalidated.
    activeSetupToken = null;
    return null;
  }

  // 1. Check environment variable override
  if (process.env.ADMIN_SETUP_TOKEN && process.env.ADMIN_SETUP_TOKEN.trim()) {
    activeSetupToken = process.env.ADMIN_SETUP_TOKEN.trim();
    return activeSetupToken;
  }
  if (process.env.ORGN_SETUP_SECRET && process.env.ORGN_SETUP_SECRET.trim()) {
    activeSetupToken = process.env.ORGN_SETUP_SECRET.trim();
    return activeSetupToken;
  }

  // 2. Check persistent setup token file
  if (fs.existsSync(SETUP_SECRET_FILE)) {
    try {
      const stored = fs.readFileSync(SETUP_SECRET_FILE, "utf-8").trim();
      if (stored) {
        activeSetupToken = stored;
        return activeSetupToken;
      }
    } catch {
      // Ignore read error, regenerate below
    }
  }

  // 3. Generate high-entropy one-time setup token
  const generated = `ORGN-SETUP-${crypto.randomBytes(12).toString("hex").toUpperCase()}`;
  try {
    fs.writeFileSync(SETUP_SECRET_FILE, generated, { encoding: "utf-8", mode: 0o600 });
  } catch (err) {
    console.error("Failed to persist setup token file:", err);
  }

  activeSetupToken = generated;
  return activeSetupToken;
}

/**
 * Initializes the auth store.
 * Strictly verifies whether an admin exists without seeding any default credentials.
 */
export function initAuthStore(): void {
  if (!isAuthInitialized()) {
    const token = getOrCreateSetupToken();
    console.log("-----------------------------------------------------------------");
    console.log("🔒 [ORGN CMS SECURITY] Initial Administrator Account Required");
    console.log(`🔑 OWNER SETUP KEY: ${token}`);
    console.log("👉 Open /admin to configure the master administrator account.");
    console.log("-----------------------------------------------------------------");
  } else {
    // If initialized, remove any leftover setup token file for security
    if (fs.existsSync(SETUP_SECRET_FILE)) {
      try {
        fs.unlinkSync(SETUP_SECRET_FILE);
      } catch {
        // Ignored
      }
    }
  }
}

export function getAuthRecord(): AuthRecord | null {
  if (!isAuthInitialized()) {
    return null;
  }
  const raw = fs.readFileSync(AUTH_FILE, "utf-8");
  return JSON.parse(raw);
}

/**
 * First-time setup: validates the owner token, verifies password strength,
 * hashes credentials, stores them, and invalidates setup.
 */
export function setupInitialAdmin(
  setupToken: string,
  username: string,
  password: string
): { success: boolean; message?: string } {
  if (isAuthInitialized()) {
    return { success: false, message: "Administrator account is already initialized. Setup is closed." };
  }

  const expectedToken = getOrCreateSetupToken();
  if (!expectedToken || !setupToken) {
    return { success: false, message: "Invalid or missing Owner Setup Key." };
  }

  // Timing safe token comparison
  const inputBuf = Buffer.from(setupToken.trim());
  const expectedBuf = Buffer.from(expectedToken.trim());
  if (inputBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(inputBuf, expectedBuf)) {
    return { success: false, message: "Incorrect Owner Setup Key. Unauthorized setup attempt." };
  }

  // Username validation
  const cleanUsername = username.trim();
  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, message: "Administrator username must be at least 3 characters long." };
  }

  // Password strength validation
  if (!password || password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters long." };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigitOrSpecial = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (!hasLower || !hasUpper || !hasDigitOrSpecial) {
    return {
      success: false,
      message: "Password must include lowercase letters, uppercase letters, and at least one number or symbol.",
    };
  }

  // Hash password using salted scrypt
  const { salt, hash } = hashPassword(password);
  const newRecord: AuthRecord = {
    adminUsername: cleanUsername,
    salt,
    hash,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  fs.writeFileSync(AUTH_FILE, JSON.stringify(newRecord, null, 2), "utf-8");

  // Invalidate setup token permanently
  activeSetupToken = null;
  if (fs.existsSync(SETUP_SECRET_FILE)) {
    try {
      fs.unlinkSync(SETUP_SECRET_FILE);
    } catch {
      // Ignored
    }
  }

  console.log(`✅ [ORGN CMS SECURITY] Administrator account "${cleanUsername}" created successfully.`);
  return { success: true };
}

export function updateAdminPassword(newPassword: string): boolean {
  const current = getAuthRecord();
  if (!current) return false;

  const { salt, hash } = hashPassword(newPassword);
  current.salt = salt;
  current.hash = hash;
  current.updatedAt = new Date().toISOString();
  fs.writeFileSync(AUTH_FILE, JSON.stringify(current, null, 2), "utf-8");
  return true;
}

export function recordAdminLogin(): void {
  const current = getAuthRecord();
  if (!current) return;
  current.lastLoginAt = new Date().toISOString();
  fs.writeFileSync(AUTH_FILE, JSON.stringify(current, null, 2), "utf-8");
}

// ---------------------------------------------------------------------------
// IN-MEMORY ACTIVE SESSIONS & BRUTE-FORCE RATE LIMITING
// ---------------------------------------------------------------------------
interface SessionData {
  sessionId: string;
  username: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, SessionData>();
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function createSession(username: string): string {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  activeSessions.set(sessionId, {
    sessionId,
    username,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });
  return sessionId;
}

export function validateSession(sessionId?: string): boolean {
  if (!sessionId) return false;
  const session = activeSessions.get(sessionId);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(sessionId);
    return false;
  }
  return true;
}

export function getSessionUsername(sessionId?: string): string | null {
  if (!sessionId) return null;
  const session = activeSessions.get(sessionId);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(sessionId);
    return null;
  }
  return session.username;
}

export function deleteSession(sessionId: string): void {
  activeSessions.delete(sessionId);
}

// Rate Limiting tracker
interface AttemptTracker {
  attempts: number;
  lockUntil: number;
}
const ipAttempts = new Map<string, AttemptTracker>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; waitSeconds: number } {
  const record = ipAttempts.get(ip);
  if (!record) return { allowed: true, waitSeconds: 0 };
  const now = Date.now();
  if (record.lockUntil > now) {
    const waitSeconds = Math.ceil((record.lockUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = now + LOCKOUT_MS;
    const waitSeconds = Math.ceil(LOCKOUT_MS / 1000);
    return { allowed: false, waitSeconds };
  }
  return { allowed: true, waitSeconds: 0 };
}

export function recordFailedAttempt(ip: string): number {
  const record = ipAttempts.get(ip) || { attempts: 0, lockUntil: 0 };
  record.attempts += 1;
  const now = Date.now();
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = now + LOCKOUT_MS;
  }
  ipAttempts.set(ip, record);
  return record.attempts;
}

export function resetRateLimit(ip: string): void {
  ipAttempts.delete(ip);
}
