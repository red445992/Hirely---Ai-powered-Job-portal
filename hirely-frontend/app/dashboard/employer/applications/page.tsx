"use client";

import { useState, useEffect } from "react";
import ApplicationsTable from "./application";
import { toast } from "sonner"; // Optional

interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  job_company: string;
  job_location: string;
  resume: string | null;
  resume_filename: string | null;
  expected_salary: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  applied_at: string;
  time_since_applied: string;
  viewed_by_employer: boolean;
}

export default function ViewApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch applications on mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");

      console.log("🔍 Debug Info:");
      console.log("Token exists:", !!token);
      console.log("Token preview:", token ? token.substring(0, 20) + "..." : "No token");
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

      if (!token) {
        setError("Please log in to view applications");
        toast.error("Please log in to view applications", {
          style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again");
          toast.error("Session expired. Please log in again", {
            style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
          });
          localStorage.removeItem("access_token");
          // Redirect to login
          window.location.href = "/auth/login";
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Applications data:", data); // Debug log
      
      // Handle both array and object responses
      const applicationsArray = Array.isArray(data) ? data : data.results || data.applications || [];
      
      // 🎯 DEMO: Add sample resume data for demonstration
      const demoResumes = [
        {
          url: "/api/demo-resume/1", // We'll create these endpoints or use data URLs
          filename: "Frontend_Developer_Resume.pdf"
        },
        {
          url: "/api/demo-resume/2",
          filename: "Full_Stack_Developer_Resume.pdf"
        },
        {
          url: "/api/demo-resume/3",
          filename: "Senior_Developer_Resume.pdf"
        },
        {
          url: "/api/demo-resume/4",
          filename: "Software_Engineer_Resume.pdf"
        },
        {
          url: "/api/demo-resume/5",
          filename: "React_Developer_Resume.pdf"
        },
        {
          url: "/api/demo-resume/6",
          filename: "Node_Developer_Resume.pdf"
        }
      ];

      // Add demo resume data to applications that don't have resumes
      const enhancedApplications = applicationsArray.map((app: Application, index: number) => {
        if (!app.resume && demoResumes[index % demoResumes.length]) {
          const demoResume = demoResumes[index % demoResumes.length];
          return {
            ...app,
            resume: demoResume.url,
            resume_filename: demoResume.filename
          };
        }
        return app;
      });

      console.log("Enhanced applications with demo resumes:", enhancedApplications);
      setApplications(enhancedApplications);
      
    } catch (error) {
      console.error("Error fetching applications:", error);
      const errorMessage = "Failed to load applications";
      setError(errorMessage);
      toast.error(errorMessage, {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("Please log in to perform this action", {
          style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "accepted"
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please log in again", {
            style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
          });
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "accepted" as const } : app
        )
      );

      toast.success("Application accepted", {
        style: { background: "linear-gradient(90deg, #22c55e, #16a34a)" },
      });
    } catch (error) {
      console.error("Error accepting application:", error);
      toast.error("Failed to accept application", {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("Please log in to perform this action", {
          style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "rejected"
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please log in again", {
            style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
          });
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "rejected" as const } : app
        )
      );

      toast.success("Application rejected", {
        style: { background: "linear-gradient(90deg, #22c55e, #16a34a)" },
      });
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application", {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    }
  };

  const handleDownloadResume = async (resumeUrl: string | null, fileName: string | null) => {
    try {
      // Check if resumeUrl is valid
      if (!resumeUrl || typeof resumeUrl !== 'string') {
        toast.error("Resume file not available for download", {
          style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
        return;
      }

      // Provide default filename if none provided
      const safeFileName = fileName || 'resume';

      // 🎯 DEMO: Handle demo resume URLs
      if (resumeUrl.startsWith('/api/demo-resume/')) {
        // Generate a demo PDF content
        const demoContent = `
RESUME - ${safeFileName.replace('.pdf', '').replace(/_/g, ' ')}
=======================================================

PERSONAL INFORMATION
Name: ${safeFileName.replace('_Resume.pdf', '').replace(/_/g, ' ')}
Email: ${safeFileName.toLowerCase().replace('_resume.pdf', '').replace(/_/g, '.')}@email.com
Phone: +1 (555) 123-4567
Location: San Francisco, CA

EXPERIENCE
========
Senior Software Developer | Tech Corp | 2020-Present
• Developed and maintained web applications using React, Node.js, and TypeScript
• Led a team of 5 developers in building scalable microservices
• Improved application performance by 40% through optimization

Software Developer | StartupXYZ | 2018-2020
• Built responsive web interfaces using modern JavaScript frameworks
• Collaborated with cross-functional teams to deliver projects on time
• Implemented automated testing strategies that reduced bugs by 30%

EDUCATION
=========
Bachelor of Science in Computer Science
University of California, Berkeley | 2014-2018

SKILLS
======
• Programming: JavaScript, TypeScript, Python, Java
• Frontend: React, Vue.js, Angular, HTML5, CSS3
• Backend: Node.js, Express, Django, Spring Boot
• Database: PostgreSQL, MongoDB, Redis
• Tools: Git, Docker, AWS, Kubernetes

This is a demo resume for testing purposes.
        `;

        // Create a blob with the demo content
        const blob = new Blob([demoContent], { type: 'text/plain' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = safeFileName.includes('.') ? safeFileName : `${safeFileName}.txt`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        
        toast.success(`Demo resume downloaded: ${safeFileName}`, {
          style: { background: "linear-gradient(90deg, #22c55e, #16a34a)" },
        });
        return;
      }

      const token = localStorage.getItem("access_token");
      
      // If the URL is relative, prepend the base API URL
      const fullUrl = resumeUrl.startsWith('http') 
        ? resumeUrl 
        : `${process.env.NEXT_PUBLIC_API_URL}${resumeUrl}`;

      if (token) {
        // Try authenticated download first (for protected files)
        const response = await fetch(fullUrl, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = safeFileName.includes('.') ? safeFileName : `${safeFileName}.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(downloadUrl);
          return;
        }
      }

      // Fallback: direct download if URL is public
      window.open(fullUrl, "_blank");

    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error("Failed to download resume", {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
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

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Error Loading Applications</h3>
          <p className="text-neutral-600 mb-4">{error}</p>
          <button
            onClick={fetchApplications}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">View Applications</h1>
            <p className="text-neutral-600 mt-1">
              Manage job applications from candidates ({applications.length} applications)
            </p>
          </div>
          <button
            onClick={fetchApplications}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
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