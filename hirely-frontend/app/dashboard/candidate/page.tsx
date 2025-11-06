"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // shadcn/ui
import SensAIUserExample from "@/components/SensAIUserExample";
// If you don't have it yet: `npx shadcn@latest add button`

interface User {
  id: number;
  username: string;
  email: string;
  user_type: string;
  first_name: string;
  last_name: string;
}

const CandidatePage = () => {
  const router = useRouter();
  const { getCurrentUser, logout, isLoading, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    /**
     * Check authentication on component mount
     */
    const checkAuthentication = () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const userData = localStorage.getItem("user");

        if (!accessToken || !userData || !isAuthenticated) {
          console.log("❌ No authentication found, redirecting to login");
          setIsCheckingAuth(false); // avoid indefinite spinner if navigation stalls
          router.replace("/auth/login");
          return;
        }

        const currentUser = getCurrentUser();
        setUser(currentUser);
        setIsCheckingAuth(false);

        console.log("✅ User authenticated:", currentUser);
      } catch (error) {
        console.error("❌ Authentication check failed:", error);
        setIsCheckingAuth(false);
        router.replace("/auth/login");
      }
    };

    checkAuthentication();
  }, [router, getCurrentUser, isAuthenticated]); // keep deps accurate

  const getFullName = () => {
    if (!user) return "";
    const full = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
    return full || user.username;
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Hirely</h1>
              <span className="ml-4 text-lg text-gray-600">Candidate Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{getFullName()}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.user_type}</p>
                </div>
              )}
              <Button
                variant="destructive"
                onClick={async () => {
                  await logout();
                }}
                disabled={isLoading}
                className="font-medium"
                aria-busy={isLoading}
              >
                {isLoading ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome to your Candidate Dashboard, {user?.first_name || "Candidate"}! 🎉
              </h2>
              <p className="mt-2 text-gray-600">
                This is your personalized space to find jobs, track applications, and manage your career.
              </p>

              <div className="mt-6">
                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  Start Job Hunting 🚀
                </Button>
              </div>
            </div>
          </div>

          {/* SensAI User Test Component */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SensAI Integration Test</h3>
            <SensAIUserExample />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidatePage;
``