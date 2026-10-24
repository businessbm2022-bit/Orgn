import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  LogOut,
  Clock,
  UserCheck,
} from "lucide-react";

export const SecurityModule: React.FC = () => {
  const { user, changePassword, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const getStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "Empty", color: "bg-white/10" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: "Weak (Requires min 8 chars)", color: "bg-red-500" };
    if (score <= 4) return { score: 2, label: "Good Strength", color: "bg-amber-400" };
    return { score: 3, label: "Strong & Secure", color: "bg-emerald-400" };
  };

  const strength = getStrength(newPassword);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFeedback({ type: "error", text: "Please fill in all password fields." });
      return;
    }

    if (newPassword.length < 8) {
      setFeedback({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    setIsSubmitting(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsSubmitting(false);

    if (result.success) {
      setFeedback({
        type: "success",
        text: "Administrator password updated successfully! Your active session is secure.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setFeedback({
        type: "error",
        text: result.message || "Failed to update password. Please check your current password.",
      });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">
          Admin Account & Security Settings
        </h2>
        <p className="text-xs text-[#A7B0C0] mt-1">
          Manage your master administrative credentials, review session security, and update access passwords.
        </p>
      </div>

      {/* Security Architecture Advisory Callout */}
      <div className="p-6 rounded-xl bg-[#247BFF]/10 border border-[#247BFF]/30 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-[#247BFF] shrink-0 mt-0.5" />
        <div className="text-xs text-[#A7B0C0] space-y-1">
          <p className="text-white font-semibold">Salted Scrypt Cryptographic Security Active</p>
          <p>
            Your administrator account credentials are protected using salted scrypt cryptographic hashing. Passwords are never stored in plaintext, environment variables, or browser memory.
          </p>
        </div>
      </div>

      {/* Admin Session Profile */}
      <div className="p-6 rounded-xl bg-[#141923] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#247BFF]" />
            <span className="text-sm font-bold text-white">
              Administrator Profile ({user?.username || "admin"})
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#A7B0C0]">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Last authenticated: {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Active Session"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors border border-white/10 self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of CMS</span>
        </button>
      </div>

      {/* Change Password Form */}
      <div className="p-8 rounded-xl bg-[#141923] border border-white/10 space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#247BFF] font-semibold">
          <KeyRound className="w-4 h-4" />
          <span>CHANGE ADMINISTRATOR PASSWORD</span>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-lg border text-xs flex items-center gap-2 ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs text-[#A7B0C0] mb-1.5">
              Current Password <span className="text-[#247BFF]">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Enter current password..."
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#A7B0C0] mb-1.5 flex items-center justify-between">
              <span>New Password <span className="text-[#247BFF]">*</span></span>
              <span className="text-[10px]">Min 8 characters</span>
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 8 characters..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
            />

            {newPassword && (
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
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-[#A7B0C0] mb-1.5">
              Confirm New Password <span className="text-[#247BFF]">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Re-enter new password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? "Updating..." : "Update Password"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
