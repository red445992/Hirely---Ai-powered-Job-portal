"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TestResetPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/reset-onboarding", {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage("✅ Onboarding reset successfully! Redirecting to onboarding...");
        setTimeout(() => {
          router.push("/sensai/onboarding");
        }, 1500);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🧪 Reset Onboarding (Dev Tool)</CardTitle>
          <CardDescription>
            This will clear your industry selection so you can test onboarding again.
            <br />
            <strong>Note:</strong> This keeps your other profile data intact.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleReset} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? "Resetting..." : "Reset Onboarding"}
          </Button>
          
          {message && (
            <div className={`p-4 rounded-lg text-sm ${
              message.includes("✅") 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              <strong>How to use:</strong>
            </p>
            <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-1 mt-2">
              <li>Click "Reset Onboarding"</li>
              <li>You'll be redirected to the onboarding page</li>
              <li>Select a different industry</li>
              <li>Go to dashboard - insights will generate automatically!</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
