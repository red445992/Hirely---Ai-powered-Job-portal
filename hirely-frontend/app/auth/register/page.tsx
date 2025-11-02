/**
 * Register Page Container Component
 *
 * Handles all business logic, state management, and form validation for registration.
 * Separates concerns by keeping UI in presentational component.
 * // This page automatically handles:
 * // - Form validation
 * // - API calls
 * // - State management
 * // - Error handling
 */

"use client";

import React from "react";
import RegisterForm from "./registerform";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Form data interface
 */
export interface RegisterFormData {
  fullName: string;
  username: string;
  email: string;
  role: "candidate" | "employer";
  password: string;
  confirmPassword: string;
  company?: string;
}

/**
 * Form validation errors interface
 */
export interface FormErrors {
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
  company?: string;
}

const RegisterPage = () => {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    username: "",
    email: "",
    role: "" as "candidate" | "employer",
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * Handles input changes for text fields
   */
  const handleInputChange =
    (field: keyof RegisterFormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  /**
   * Handles role selection change
   */
  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value as "candidate" | "employer",
    }));

    // Clear role error
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: undefined }));
    }

    console.log("Role:", value);
  };

  /**
   * Toggles password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  /**
   * Validates form data
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the errors in the form", {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Log all form data for debugging
      console.log("📝 Form Submission Data:", {
        ...formData,
        password: "[HIDDEN]",
        confirmPassword: "[HIDDEN]",
      });

      // Step 2: Prepare data for backend
      const backendData = {
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        role: formData.role,
        password: formData.password,
        confirmPassword: formData.confirmPassword, // ✅ Added this
        // ✅ Company is optional - don't send it if empty
        ...(formData.company && { company: formData.company }),
      };

      console.log("🚀 Data ready for backend:", {
        ...backendData,
        password: "[HIDDEN]",
        confirmPassword: "[HIDDEN]",
      });

      // Step 3: Make actual API call to backend
      const response = await registerUser(backendData);

      if (response.success) {
        toast.success(response.message, {
          style: { background: "linear-gradient(90deg, #22c55e, #16a34a)" },
        });

        // Reset form after successful submission
        setFormData({
          fullName: "",
          username: "",
          email: "",
          role: "" as "candidate" | "employer", // ✅ Fixed TypeScript issue
          password: "",
          confirmPassword: "",
          company: "" as string, // ✅ Added this
        });

        // Redirect to login page
        setTimeout(() => {
          router.push("/auth/login"); // Make sure this matches your frontend route
        }, 1500);
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("❌ Registration error:", error);

      // Better error message handling
      const errorMessage =
        error.message || "Registration failed. Please try again.";
      toast.error(errorMessage, {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Actual backend API call
   */
  const registerUser = async (
    userData: any
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log("📤 Sending to backend:", {
        username: userData.username,
        email: userData.email,
        user_type: userData.role,
        first_name: userData.fullName.split(" ")[0] || userData.fullName,
        last_name: userData.fullName.split(" ").slice(1).join(" ") || "",
        company: userData.company,
        password: "[HIDDEN]",
        confirm_password: "[HIDDEN]",
      });

      const response = await fetch("http://localhost:8000/accounts/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          confirm_password: userData.confirmPassword, // ✅ confirm_password not confirmPassword
          user_type: userData.role,
          first_name: userData.fullName.split(" ")[0] || userData.fullName, // ✅ Better fallback
          last_name: userData.fullName.split(" ").slice(1).join(" ") || "", // ✅ Handle single name
          company: userData.company || "", // ✅ Include company
        }),
      });

      const result = await response.json();

      console.log("📨 Backend response:", {
        status: response.status,
        success: result.success,
        message: result.message,
        errors: result.errors,
      });

      if (!response.ok) {
        // Handle Django validation errors
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(", ");
          throw new Error(
            errorMessages || `Registration failed: ${response.status}`
          );
        }
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error: any) {
      console.error("❌ API call failed:", error);
      throw error;
    }
  };

  /**
   * Reset the form to initial state
   */
  const resetForm = () => {
    setFormData({
      fullName: "",
      username: "",
      email: "",
      role: "" as "candidate" | "employer",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return (
    <RegisterForm
      // Form Data
      formData={formData}
      // UI State
      showPassword={showPassword}
      isSubmitting={isSubmitting}
      errors={errors}
      // Event Handlers
      onInputChange={handleInputChange}
      onRoleChange={handleRoleChange}
      onTogglePassword={togglePasswordVisibility}
      onSubmit={handleSubmit}
      onReset={resetForm}
    />
  );
};

export default RegisterPage;
