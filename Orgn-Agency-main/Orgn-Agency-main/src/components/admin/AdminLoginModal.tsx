import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  Loader2,
  X,
  ShieldCheck,
  KeyRound,
  ShieldAlert,
  User,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { isInitialized, login, setupInitialAdmin, devSetupHint } = useAuth();

  // Mode: if not initialized, default to "setup"; otherwise "login"
  const isSetupMode = !isInitialized;

  // Login state
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Setup state
  const [setupToken, setSetupToken] = useState("");
  const [setupUsername, setSetupUsername] = useState("admin");
  const [setupPassword, setSetupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSetupPassword, setShowSetupPassword] = useState(false);

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Auto-fill dev token if available for seamless local testing
  useEffect(() => {
    if (isSetupMode && devSetupHint && !setupToken) {
      setSetupToken(devSetupHint);
    }
  }, [isSetupMode, devSetupHint, setupToken]);

  // Rate limit countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "Empty", color: "bg-white/10" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: "Weak (Requires min 8 chars, mixed case & numbers)", color: "bg-red-500" };
    if (score <= 4) return { score: 2, label: "Good Strength", color: "bg-amber-400" };
    return { score: 3, label: "Strong & Secure", color: "bg-emerald-400" };
  };

  const strength = getPasswordStrength(setupPassword);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPassword.trim()) {
      setErrorMessage("Please enter the administrator password.");
      return;
    }

    if (lockoutSeconds > 0) {
      setErrorMessage(`Access temporarily locked. Please wait ${lockoutSeconds}s.`);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await login(loginPassword);
    setIsLoading(false);

    if (result.success) {
      setLoginPassword("");
      onSuccess();
    } else {
      setErrorMessage(result.message || "Invalid credentials.");
      if (result.waitSeconds) {
        setLockoutSeconds(result.waitSeconds);
      }
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupToken.trim()) {
      setErrorMessage("Please enter the Owner Setup Key configured on the server.");
      return;
    }

    if (!setupPassword) {
      setErrorMessage("Please choose a secure administrator password.");
      return;
    }

    if (setupPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (setupPassword !== confirmPassword) {
      setErrorMessage("Password confirmation does not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await setupInitialAdmin(
      setupToken.trim(),
      setupUsername.trim() || "admin",
      setupPassword,
      confirmPassword
    );
    setIsLoading(false);

    if (result.success) {
      setSetupPassword("");
      setConfirmPassword("");
      setSetupToken("");
      onSuccess();
    } else {
      setErrorMessage(result.message || "First-time setup failed. Check Owner Setup Key.");
      if (result.waitSeconds) {
        setLockoutSeconds(result.waitSeconds);
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#10141D] border border-white/15 rounded-2xl shadow-2xl p-7 sm:p-10 overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle electric blue accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#247BFF] to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#A7B0C0] hover:text-white bg-white/[0.03] hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#247BFF]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Lockup */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center text-3xl font-bold font-display tracking-tight text-white mb-2">
            <span>orgn</span>
            <span className="text-[#247BFF]">.</span>
          </div>

          <h2
            id="admin-dialog-title"
            className="text-2xl font-bold font-display text-white tracking-tight"
          >
            {isSetupMode ? "Owner Account Setup" : "Welcome Back."}
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1.5 max-w-sm mx-auto">
            {isSetupMode
              ? "Establish your master administrator credentials. Default passwords have been completely purged for security."
              : "Sign in with your master credentials to manage content in real time."}
          </p>
        </div>

        {/* MODE A: FIRST-TIME OWNER SETUP */}
        {isSetupMode ? (
          <form onSubmit={handleSetupSubmit} noValidate className="space-y-4">
            {/* Setup Info Callout */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#247BFF]/10 to-transparent border border-[#247BFF]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#247BFF]">
                <KeyRound className="w-4 h-4 shrink-0" />
                <span>Zero Default Password Architecture</span>
              </div>
              <p className="text-[11px] text-[#A7B0C0] leading-relaxed">
                To prevent unauthorized takeovers, ORGN never boots with a default password. Enter your one-time server secret token to initialize administrator rights.
              </p>

              {devSetupHint && (
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-[#3D8BFF] truncate">
                    Server Key: <span className="text-white">{devSetupHint}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSetupToken(devSetupHint)}
                    className="shrink-0 px-2.5 py-1 rounded bg-[#247BFF]/20 hover:bg-[#247BFF]/30 text-[#247BFF] text-[10px] font-mono uppercase tracking-wider font-semibold transition-colors"
                  >
                    Use Key
                  </button>
                </div>
              )}
            </div>

            {/* Owner Setup Key */}
            <div>
              <label
                htmlFor="setup-token"
                className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-1.5 flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#247BFF]" />
                <span>Owner Setup Key</span>
                <span className="text-[#247BFF]">*</span>
              </label>
              <input
                id="setup-token"
                type="text"
                required
                autoFocus
                placeholder="e.g. ORGN-SETUP-..."
                value={setupToken}
                onChange={(e) => {
                  setSetupToken(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full px-4 py-2.5 rounded-lg bg-[#080A0F] border border-white/15 text-xs text-white font-mono placeholder-white/20 focus:outline-none focus:border-[#247BFF] transition-colors"
              />
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="setup-username"
                className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-1.5 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#247BFF]" />
                <span>Administrator Username</span>
              </label>
              <input
                id="setup-username"
                type="text"
                required
                value={setupUsername}
                onChange={(e) => setSetupUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#080A0F] border border-white/15 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#247BFF] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="setup-password"
                className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-1.5 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#247BFF]" />
                  <span>Choose Master Password</span>
                  <span className="text-[#247BFF]">*</span>
                </span>
                <span className="text-[10px] text-[#A7B0C0] normal-case">Min 8 characters</span>
              </label>
              <div className="relative">
                <input
                  id="setup-password"
                  type={showSetupPassword ? "text" : "password"}
                  required
                  placeholder="Create your custom password..."
                  value={setupPassword}
                  onChange={(e) => {
                    setSetupPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-4 pr-11 py-2.5 rounded-lg bg-[#080A0F] border border-white/15 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#247BFF] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowSetupPassword(!showSetupPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A7B0C0] hover:text-white p-1 focus:outline-none"
                  aria-label={showSetupPassword ? "Hide password" : "Show password"}
                >
                  {showSetupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {setupPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color} ${
                        strength.score === 1 ? "w-1/3" : strength.score === 2 ? "w-2/3" : "w-full"
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#A7B0C0]">
                    <span>Strength: {strength.label}</span>
                    {strength.score >= 2 && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-1.5 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-[#247BFF]" />
                <span>Confirm Master Password</span>
                <span className="text-[#247BFF]">*</span>
              </label>
              <input
                id="confirm-password"
                type={showSetupPassword ? "text" : "password"}
                required
                placeholder="Re-type your password..."
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className={`w-full px-4 py-2.5 rounded-lg bg-[#080A0F] border text-xs text-white placeholder-white/20 focus:outline-none transition-colors ${
                  confirmPassword && confirmPassword !== setupPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/15 focus:border-[#247BFF]"
                }`}
              />
              {confirmPassword && confirmPassword !== setupPassword && (
                <p className="mt-1 text-[11px] text-red-400">Passwords do not match.</p>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || lockoutSeconds > 0}
              className="w-full py-3.5 px-6 rounded bg-[#247BFF] hover:bg-[#3D8BFF] active:scale-[0.99] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-xl shadow-[#247BFF]/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>INITIALIZING ACCOUNT...</span>
                </>
              ) : lockoutSeconds > 0 ? (
                <span>LOCKED FOR {lockoutSeconds}s</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ESTABLISH MASTER ADMINISTRATOR</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* MODE B: STANDARD ADMINISTRATOR LOGIN (NO DEFAULT PASSWORDS) */
          <form onSubmit={handleLoginSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2 flex items-center justify-between"
              >
                <span>Master Password</span>
              </label>

              <div className="relative">
                <input
                  id="admin-password"
                  type={showLoginPassword ? "text" : "password"}
                  autoFocus
                  disabled={isLoading || lockoutSeconds > 0}
                  required
                  placeholder="Enter administrator password..."
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className={`w-full pl-4 pr-11 py-3.5 rounded-lg bg-[#080A0F] border text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${
                    errorMessage
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/15 focus:border-[#247BFF]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A7B0C0] hover:text-white p-1 focus:outline-none"
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errorMessage && (
                <div className="mt-2 text-xs text-red-400 flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || lockoutSeconds > 0}
              className="w-full py-3.5 px-6 rounded bg-[#247BFF] hover:bg-[#3D8BFF] active:scale-[0.99] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-xl shadow-[#247BFF]/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>VERIFYING CREDENTIALS...</span>
                </>
              ) : lockoutSeconds > 0 ? (
                <span>LOCKED FOR {lockoutSeconds}s</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>SIGN IN TO CMS</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-[#A7B0C0]/70">
          <ShieldCheck className="w-3.5 h-3.5 text-[#247BFF]" />
          <span>Server-Side Salted Scrypt Authentication & Real-Time Sync</span>
        </div>
      </div>
    </div>
  );
};
