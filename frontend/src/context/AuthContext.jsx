import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("csz-token") || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("csz-user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ open: false, mode: "login" });

  // Verify and refresh current user profile on initial load
  const loadUser = useCallback(async () => {
    const currentToken = localStorage.getItem("csz-token");
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem("csz-user", JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn("Session check failed or expired:", err.message);
      // Clean up invalid session
      localStorage.removeItem("csz-token");
      localStorage.removeItem("csz-user");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      const res = await api.auth.login({ email, password });
      if (res && res.token && res.user) {
        localStorage.setItem("csz-token", res.token);
        localStorage.setItem("csz-user", JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        setAuthModal({ open: false, mode: "login" });
        return { success: true, user: res.user };
      }
      throw new Error(res.message || "Login failed");
    } catch (err) {
      return { success: false, message: err.message || "Invalid email or password" };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.auth.register(userData);
      if (res && res.token && res.user) {
        localStorage.setItem("csz-token", res.token);
        localStorage.setItem("csz-user", JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        setAuthModal({ open: false, mode: "login" });
        return { success: true, user: res.user };
      }
      throw new Error(res.message || "Registration failed");
    } catch (err) {
      return { success: false, message: err.message || "Registration failed" };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("csz-token");
      localStorage.removeItem("csz-user");
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.auth.updateProfile(profileData);
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem("csz-user", JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      throw new Error(res.message || "Profile update failed");
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const openAuthModal = (mode = "login") => setAuthModal({ open: true, mode });
  const closeAuthModal = () => setAuthModal({ open: false, mode: "login" });

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "admin",
    isModerator: user?.role === "moderator",
    isStaff: user?.role === "admin" || user?.role === "moderator",
    login,
    register,
    logout,
    updateProfile,
    authModal,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
