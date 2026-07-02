"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import { getAccessToken, setAccessToken, setRefreshToken, clearTokens } from "@/lib/auth";

interface User {
  id: string;
  full_name: string;
  email: string;
  preferred_source_language?: string;
  preferred_target_language?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest("/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // If /auth/me fails, clear tokens as session is invalid
        clearTokens();
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();

    const handleLogoutEvent = () => {
      setUser(null);
    };

    window.addEventListener("auth-logout", handleLogoutEvent);
    return () => {
      window.removeEventListener("auth-logout", handleLogoutEvent);
    };
  }, []);

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(userData);
  };

  const logout = async () => {
    const token = getAccessToken();
    if (token) {
      try {
        await apiRequest("/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Error logging out from backend:", err);
      }
    }
    clearTokens();
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
