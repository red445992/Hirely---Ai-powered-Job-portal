/**
 * Register Form Presentational Component
 * 
 * Pure UI component that receives all data and callbacks as props.
 * No business logic - only renders UI and delegates actions to parent.
 * 
 * @component
 * @presentational
 * 
 * @param formData - Current form values
 * @param showPassword - Whether password is visible
 * @param isSubmitting - Loading state for form submission
 * @param errors - Validation errors object
 * @param onInputChange - Handler for text input changes
 * @param onRoleChange - Handler for role selection
 * @param onTogglePassword - Handler for password visibility toggle
 * @param onSubmit - Handler for form submission
 * @param onReset - Handler for form reset
 * @param compact - Optional compact styling
 * 
 * @example
 * <RegisterForm
 *   formData={formData}
 *   showPassword={showPassword}
 *   isSubmitting={isSubmitting}
 *   errors={errors}
 *   onInputChange={handleInputChange}
 *   onRoleChange={handleRoleChange}
 *   onTogglePassword={togglePasswordVisibility}
 *   onSubmit={handleSubmit}
 *   onReset={resetForm}
 * />
 */




"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";


// UI Components
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


// Importing Toaster for notifications
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, User, UserCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import error from "next/error";
import { success } from "zod/v4/mini";


// Types
import { RegisterFormData, FormErrors } from "./page";


interface RegisterFormProps {
  formData: RegisterFormData;
  showPassword: boolean;
  isSubmitting: boolean;
  errors: FormErrors;
  onInputChange: (field: keyof RegisterFormData) => (value: string) => void;
  onRoleChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  compact?: boolean;
}



const RegisterForm =({
  formData,
  showPassword,
  isSubmitting,
  errors,
  onInputChange,
  onRoleChange,
  onTogglePassword,
  onSubmit,
  onReset,
  compact = false
}: RegisterFormProps) => {
  return (

     <div className={`${compact ? "p-2" : "min-h-screen flex items-center justify-center p-4"}`}>
      <Card className={`${compact ? "shadow-none border-none" : "w-full max-w-md"}`}>
        <CardHeader className="text-center">
          {/* Animated Logo */}
          <div className="mx-auto relative mb-6">
            <div className="w-24 h-24 bg-blue-500/10 rounded-full absolute -inset-2 animate-ping"></div>
            <div className="w-20 h-20 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-blue-500/30">
              <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <CardTitle className="text-2xl">Join Our Job Portal</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => onInputChange('fullName')(e.target.value)}
                  className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => onInputChange('username')(e.target.value)}
                  className={`pl-10 ${errors.username ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => onInputChange('email')(e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">I am a *</Label>
              <Select
                value={formData.role}
                onValueChange={onRoleChange}
                disabled={isSubmitting}
              >
                <SelectTrigger className={`w-full ${errors.role ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => onInputChange('password')(e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={onTogglePassword}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => onInputChange('confirmPassword')(e.target.value)}
                  className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={onTogglePassword}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button 
                type="button"
                variant="outline"
                onClick={onReset}
                disabled={isSubmitting}
                className="flex-1"
              >
                Reset
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border-0 focus:ring-4 focus:ring-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterForm