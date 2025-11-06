/**
 * Login Page Container Component
 *
 * Handles all business logic for user authentication and role-based routing.
 * Separates concerns by keeping UI in presentational component.
 *
 * @component
 * @container
 */

"use client";
import LoginForm from "./loginForm";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Login form data interface
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    username: string;
    email: string;
    user_type: string;
    first_name: string;
    last_name: string;
  };
  tokens?: {
    refresh: string;
    access: string;
  };
  errors?: Record<string, string[]>;
}

export default function LoginPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles input changes
   */
  const handleInputChange = (field: keyof LoginFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  /**
   * Toggles password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  /**
   * Validates form data
   */
  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Step 1: Log login attempt for debugging
      console.log("📝 Login attempt:", {
        email: formData.email,
        password: "[HIDDEN]",
      });

      // Step 2: Make API call to backend
      const response = await loginUser(formData);

      if (response.success && response.user && response.tokens) {
        toast.success("Login successful! 🎉", {
          style: { background: "linear-gradient(90deg, #22c55e, #16a34a)" },
        });

        // Store tokens in localStorage (in production, use httpOnly cookies)
        localStorage.setItem("access_token", response.tokens.access);
        localStorage.setItem("refresh_token", response.tokens.refresh);
        localStorage.setItem("user", JSON.stringify(response.user));

        // Also set server-side cookies for server actions
        try {
          await fetch("/api/auth/set-cookies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: response.tokens.access,
              user: response.user,
            }),
          });
        } catch (cookieError) {
          console.warn("⚠️ Failed to set server cookies:", cookieError);
          // Don't block login if cookie setting fails
        }

        console.log("✅ Login successful, user role:", response.user.user_type);

        // Step 3: Role-based routing
        redirectBasedOnRole(response.user.user_type);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      const errorMessage =
        error.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      
      toast.error(errorMessage, {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  /**
   * Redirects user based on their role
   */
  const redirectBasedOnRole = (userType: string) => {
    switch (userType) {
      case "candidate":
        router.push("/jobs");
        break;
      case "employer":
        router.push("/dashboard/employer");
        break;
      default:
        router.push("/dashboard");
        break;
    }
  };

  /**
   * Actual backend API call for login
   */
  const loginUser = async (loginData: LoginFormData): Promise<LoginResponse> => {
  try {
    console.log("📤 Sending login request to backend:", {
      email: loginData.email,
      password: "[HIDDEN]",
    });

    const response = await fetch("http://localhost:8000/accounts/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
    });

    // Try to safely parse response
    let result: any;
    try {
      result = await response.json();
    } catch (parseError) {
      const text = await response.text();
      console.error("⚠️ Could not parse JSON. Raw response text:", text);
      throw new Error(`Invalid JSON response from backend: ${text}`);
    }

    // Log detailed info
    console.log("📨 Full backend response:", {
      status: response.status,
      ok: response.ok,
      result,
    });

    // Handle response errors in detail
    if (!response.ok) {
      console.group("❌ Login API Error Details");
      console.error("HTTP Status:", response.status);
      console.error("Response Body:", result);

      if (result.errors) {
        console.error("Field Errors:", result.errors);
        const errorMessages = Object.values(result.errors).flat().join(", ");
        console.groupEnd();
        throw new Error(errorMessages);
      }

      // Handle Django-style error messages
      const message =
        result.message ||
        result.detail ||
        `Unknown error (HTTP ${response.status})`;

      // Specific hints for common HTTP codes
      if (response.status === 400)
        console.warn("🔍 Hint: Possibly invalid credentials or bad request data");
      else if (response.status === 500)
        console.warn("💥 Hint: Server error — check Django logs");

      console.groupEnd();
      throw new Error(message);
    }

    return result;
  } catch (error: any) {
    console.error("🚨 Uncaught Login Error:", error);
    throw error;
  }
};


  /**
   * Reset the form
   */
  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
    });
    setError(null);
  };

  return (
    <LoginForm
      // Form Data
      formData={formData}
      // UI State
      showPassword={showPassword}
      isSubmitting={isSubmitting}
      error={error}
      // Event Handlers
      onInputChange={handleInputChange}
      onTogglePassword={togglePasswordVisibility}
      onSubmit={handleSubmit}
      onReset={resetForm}
    />
  );
}
