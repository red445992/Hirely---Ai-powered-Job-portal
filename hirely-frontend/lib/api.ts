// lib/api.ts
import { toast } from "sonner";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper function to get authentication token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem('token') || localStorage.getItem('access_token');
}

export async function fetchJob(jobId: string) {
  try {
    const response = await fetch(`${API_BASE}/jobs/${jobId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        toast.error("Job not found", {
          style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
        throw new Error("Job not found");
      }
      toast.error(`Failed to fetch job: ${response.status}`, {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
      throw new Error(`Failed to fetch job: ${response.status}`);
    }

    const job = await response.json();
    return job;
  } catch (error) {
    console.error("Error fetching job:", error);

    toast.error(
      `Failed to fetch job: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      }
    );
    throw error;
  }
}

export async function submitApplication(jobId: number, formData: any) {
  try {
    console.log("🚀 Starting application submission...");
    console.log("📋 Job ID:", jobId);
    console.log("📝 Form data:", formData);

    // Create FormData for file upload
    const form = new FormData();

    // Add all form fields
    form.append("job", jobId.toString());
    form.append("full_name", formData.fullName || "");
    form.append("email", formData.email || "");
    form.append("phone", formData.phone || "");
    form.append("cover_letter", formData.coverLetter || "");
    form.append("portfolio_url", formData.portfolioUrl || "");
    form.append("linkedin_url", formData.linkedinUrl || "");
    form.append("expected_salary", formData.expectedSalary || "");
    form.append("availability", formData.availability || "immediately");
    form.append("additional_info", formData.additionalInfo || "");

    // Add resume file if present
    if (formData.resume) {
      console.log(
        "📎 Adding resume file:",
        formData.resume.name,
        "Size:",
        formData.resume.size,
        "bytes"
      );
      form.append("resume", formData.resume);
    } else {
      console.log("⚠️ No resume file provided");
    }

    // Debug: Log all FormData entries
    console.log("🔍 FormData entries:");
    for (let [key, value] of form.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    const url = `${API_BASE}/applications/apply/`;
    console.log("🌐 Submitting to:", url);

    const response = await fetch(url, {
      method: "POST",
      body: form,
      // Don't set Content-Type header - let browser set it with boundary for multipart
    });

    console.log("📨 Response status:", response.status);
    console.log(
      "📨 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Error response body:", errorData);

      try {
        const errorJson = JSON.parse(errorData);
        console.error("❌ Parsed error JSON:", errorJson);
        // throw new Error(`Application submission failed: ${JSON.stringify(errorJson)}`);
        toast.error(
          `Application submission failed: ${
            errorJson.detail || "Unknown error"
          }`,
          {
            style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
          }
        );
      } catch (parseError) {
        // throw new Error(`Application submission failed (${response.status}): ${errorData}`);
        toast.error(`Application submission failed: ${errorData}`, {
          style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
      }
    }

    const result = await response.json();
    console.log("✅ Application submitted successfully:", result);
    toast.success(`Application submitted successfully! ID: ${result.id}`, {
      style: { background: "linear-gradient(90deg, #4caf50, #388e3c)" },
    });
    return result;
  } catch (error) {
    console.error("❌ Error submitting application:", error);

    // Enhanced error logging
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error(
        "🌐 Network error - check if backend is running on:",
        API_BASE
      );
    }

    // throw error;
    toast.error(
      `Application submission failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      }
    );
  }
}

// Fetch user's applications
export async function fetchUserApplications() {
  try {
    console.log("🔍 Fetching user applications...");
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${API_BASE}/applications/my-applications/`;
    console.log("🌐 Fetching from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("📨 Response status:", response.status);

    if (!response.ok) {
      if (response.status === 401) {
        toast.error("Please login to view your applications", {
          style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
        throw new Error('Unauthorized - please login');
      }
      throw new Error(`Failed to fetch applications: ${response.status}`);
    }

    const applications = await response.json();
    console.log("✅ Applications response received:", applications);
    console.log("✅ Response type:", typeof applications);
    console.log("✅ Is array:", Array.isArray(applications));
    
    // Ensure we return an array
    if (Array.isArray(applications)) {
      console.log("📊 Application count:", applications.length);
      return applications;
    } else if (applications && applications.results && Array.isArray(applications.results)) {
      // Handle paginated response (DRF style)
      console.log("📊 Paginated application count:", applications.results.length);
      return applications.results;
    } else if (applications && applications.data && Array.isArray(applications.data)) {
      // Handle wrapped response
      console.log("📊 Wrapped application count:", applications.data.length);
      return applications.data;
    } else {
      console.log("📊 Unexpected response format, returning empty array");
      console.log("📊 Response keys:", Object.keys(applications || {}));
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    toast.error(
      `Failed to fetch applications: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      }
    );
    throw error;
  }
}

// Fetch application statistics
export async function fetchApplicationStats() {
  try {
    console.log("📊 Fetching application statistics...");
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${API_BASE}/applications/stats/`;
    console.log("🌐 Fetching from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("📨 Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.status}`);
    }

    const stats = await response.json();
    console.log("✅ Stats fetched:", stats);
    return stats;
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    toast.error(
      `Failed to fetch statistics: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      }
    );
    throw error;
  }
}
