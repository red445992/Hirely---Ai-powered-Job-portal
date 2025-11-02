"use client";

import { useState, useEffect } from "react";
import ApplicationsTable from "./application";
import { toast } from "sonner"; // Optional

interface Application {
  id: number;
  user_name: string;
  user_avatar?: string;
  job_title: string;
  location: string;
  resume_url: string;
  status?: string;
}

export default function ViewApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch applications on mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error("Failed to load applications",{
            style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
      }

      const data = await response.json();
      setApplications(data.applications || data); // Adjust based on your API response
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications",{
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error("Failed to accept application",{
            style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "accepted" } : app
        )
      );

      toast.success("Application accepted",{
        style: { background: "linear-gradient(90deg, #22c55e, #16a34a)" },
      });
    //   alert("Application accepted!");
    } catch (error) {
      console.error("Error accepting application:", error);
      toast.error("Failed to accept application",{
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // throw new Error("Failed to reject application");
        toast.error("Failed to reject application",{
            style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "rejected" } : app
        )
      );

      toast.success("Application rejected",{
        style: { background: "linear-gradient(90deg, #22c55e, #16a34a)" },
      });
    //   alert("Application rejected!");
      
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application",{
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    //   alert("Failed to reject application");
    }
  };

  const handleDownloadResume = async (url: string, userName: string) => {
    try {
      // Option 1: Direct download if URL is public
      window.open(url, "_blank");

      // Option 2: Download through your API (if resume is protected)
      // const token = localStorage.getItem("access_token");
      // const response = await fetch(url, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // const blob = await response.blob();
      // const downloadUrl = window.URL.createObjectURL(blob);
      // const link = document.createElement("a");
      // link.href = downloadUrl;
      // link.download = `${userName}_resume.pdf`;
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error("Failed to download resume",{
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    //   alert("Failed to download resume");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">View Applications</h1>
          <p className="text-neutral-600 mt-1">
            Manage job applications from candidates
          </p>
        </div>

        <ApplicationsTable
          applications={applications}
          onAccept={handleAccept}
          onReject={handleReject}
          onDownloadResume={handleDownloadResume}
        />
      </div>
    </div>
  );
}