import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface AdminUser {
  username: string;
  lastLoginAt?: string;
  createdAt?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: AdminUser | null;
  devSetupHint?: string;
  login: (password: string) => Promise<{ success: boolean; message?: string; waitSeconds?: number }>;
  setupInitialAdmin: (
    setupToken: string,
    username: string,
    password: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; message?: string; waitSeconds?: number }>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  refreshAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(true);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [devSetupHint, setDevSetupHint] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check auth initialization status & session
  const refreshAuthStatus = useCallback(async () => {
    try {
      const statusRes = await fetch("/api/auth/status");
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setIsInitialized(Boolean(statusData.initialized));
        if (statusData.devSetupHint) {
          setDevSetupHint(statusData.devSetupHint);
        }
      }

      const sessionRes = await fetch("/api/auth/session");
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        if (sessionData.authenticated && sessionData.user) {
          setIsAuthenticated(true);
          setUser(sessionData.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch {
      // Default fail-safe
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuthStatus();
  }, [refreshAuthStatus]);

  const setupInitialAdmin = async (
    setupToken: string,
    username: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setupToken, username, password, confirmPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsInitialized(true);
        setIsAuthenticated(true);
        setUser(data.user);
        setDevSetupHint(undefined);
        return { success: true };
      }

      return {
        success: false,
        message: data.message || "Setup failed. Check Owner Setup Key and password requirements.",
        waitSeconds: data.waitSeconds,
      };
    } catch {
      return {
        success: false,
        message: "Network error while performing first-time administrator setup.",
      };
    }
  };

  const login = async (password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true };
      }

      if (data.requiresSetup) {
        setIsInitialized(false);
      }

      return {
        success: false,
        message: data.message || "Authentication failed.",
        waitSeconds: data.waitSeconds,
      };
    } catch {
      return {
        success: false,
        message: "Network error. Unable to reach server.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      return {
        success: res.ok && data.success,
        message: data.message || "Failed to update password.",
      };
    } catch {
      return {
        success: false,
        message: "Network error while changing password.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        isLoading,
        user,
        devSetupHint,
        login,
        setupInitialAdmin,
        logout,
        changePassword,
        refreshAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
