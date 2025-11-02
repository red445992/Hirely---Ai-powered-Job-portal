"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect candidates to jobs page instead of dashboard
      if (user.user_type === "candidate") {
        router.replace("/jobs");
      } else if (user.user_type === "employer") {
        router.replace("/dashboard/employer");
      }
    }
  }, [isAuthenticated, user, router]);

  // Show a simple landing page for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-6 p-8">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.svg"
              alt="Hirely Logo"
              width={200}
              height={60}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Hirely
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Your AI-powered job application platform with intelligent resume matching
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/auth/login")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/auth/register")}
              className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while redirecting authenticated users
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
