"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface User {
  id: number;
  username: string;
  email: string;
  user_type: "candidate" | "employer";
  first_name: string;
  last_name: string;
  firstName?: string;
  lastName?: string;
  company?: string; // Added company field for employers
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Initialize state to prevent hydration mismatches
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  // Initialize from localStorage after component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = safeParse<User>(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("token") || localStorage.getItem("access_token");
        
        setUser(storedUser);
        setToken(storedToken);
        setIsAuthenticated(Boolean(storedToken && storedUser));
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
    }
    setMounted(true);
  }, []);

  const inFlight = useRef(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem("token") || localStorage.getItem("access_token");
      const userData = safeParse<User>(localStorage.getItem("user"));

      setUser(userData);
      setIsAuthenticated(Boolean(storedToken && userData));
      setToken(storedToken);
    };

    initAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "access_token" || e.key === "user") {
        initAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const getCurrentUser = useCallback((): User | null => {
    return user;
  }, [user]);

  const refreshUser = useCallback(() => {
    const userData = safeParse<User>(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token") || localStorage.getItem("access_token");

    setUser(userData);
    setIsAuthenticated(Boolean(storedToken && userData));
    setToken(storedToken);
  }, []);

  /**
   * Exchange refresh token for a new access token using backend SimpleJWT endpoint.
   * Returns the new access token string on success, or null on failure.
   */
  const refreshAccess = useCallback(async (): Promise<string | null> => {
    const refreshToken =
      localStorage.getItem("refresh_token") || localStorage.getItem("refresh") || null;

    if (!refreshToken) return null;

    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/[\/;\s]+$/g, "");
      const res = await fetch(`${apiBase}/accounts/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!res.ok) {
        console.error("Failed to refresh token", await res.text());
        return null;
      }

      const data = await res.json();
      const newAccess = data.access;
      if (newAccess) {
        // update both keys used across the app
        localStorage.setItem("access_token", newAccess);
        localStorage.setItem("token", newAccess);
        setToken(newAccess);
        setIsAuthenticated(Boolean(newAccess && user));
        return newAccess;
      }

      return null;
    } catch (err) {
      console.error("refreshAccess error:", err);
      return null;
    }
  }, [user]);

  /**
   * Login: Store user data and token
   * Now handles both Token and JWT authentication
   */
  const login = useCallback((userData: User, authToken: string, refreshToken?: string) => {
    // Store token as "token" for Django Token auth compatibility
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    setUser(userData);
    setIsAuthenticated(true);
    setToken(authToken);
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setIsLoading(true);

    try {
      // Clear all auth-related items
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      setUser(null);
      setIsAuthenticated(false);
      setToken(null);

      toast.success("Logout successful! 🎉", {
        style: { background: "linear-gradient(90deg, #22c55e, #16a34a)" },
      });

      router.replace("/auth/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.", {
        style: { background: "linear-gradient(90deg, #dc2626, #b91c1c)" },
      });
    } finally {
      setIsLoading(false);
      inFlight.current = false;
    }
  }, [router]);

  const isAuthenticatedFn = useCallback(() => {
    return Boolean(token && user);
  }, [token, user]);

  return {
    user,
    isAuthenticated,
    isAuthenticatedFn,
    token,
    refreshAccess,
    getCurrentUser,
    refreshUser,
    login,
    logout,
    isLoading,
    mounted,
  };
}