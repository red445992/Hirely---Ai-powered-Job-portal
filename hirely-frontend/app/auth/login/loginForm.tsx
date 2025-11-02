/**
 * Login Form Presentational Component
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
 * @param error - Validation error message
 * @param onInputChange - Handler for input changes
 * @param onTogglePassword - Handler for password visibility toggle
 * @param onSubmit - Handler for form submission
 * @param onReset - Handler for form reset
 * @param compact - Optional compact styling
 */


import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, UserCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Types
import { LoginFormData } from "./page";


interface LoginFormProps {
  formData: LoginFormData;
  showPassword: boolean;
  isSubmitting: boolean;
  error: string | null;
  onInputChange: (field: keyof LoginFormData) => (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  compact?: boolean;
}

const LoginForm  =({
  formData,
  showPassword,
  isSubmitting,
  error,
  onInputChange,
  onTogglePassword,
  onSubmit,
  onReset,
  compact = false
}: LoginFormProps) => {
  
  return (
    <div className={`${compact ? "p-10" : "min-h-screen flex items-center justify-center p-4"}`}>
      <Card className={`${compact ? "shadow-none border-none" : "w-full max-w-md"}`}>
        <CardHeader className="text-center">
          <div className="mx-auto relative mb-6">
            <div className="w-24 h-24 bg-blue-500/10 rounded-full absolute -inset-2 animate-ping"></div>
            <div className="w-20 h-20 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-blue-500/30">
              <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl">
            Welcome to Hirely!
          </CardTitle>
          <CardDescription>
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => onInputChange('email')(e.target.value)}
                  required
                  className="pl-10"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => onInputChange('password')(e.target.value)}
                  required
                  className="pl-10 pr-10"
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
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
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
                Clear
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border-0 focus:ring-4 focus:ring-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account?
                <Link
                  href="/auth/register"
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline ml-1"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
