// lib/resume-api.ts
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper function to get authentication token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem('token') || localStorage.getItem('access_token');
}

// ============================================================================
// RESUME MANAGEMENT API FUNCTIONS
// ============================================================================

// Fetch all user resumes
export async function fetchUserResumes() {
  try {
    console.log("📄 Fetching user resumes...");
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${API_BASE}/resumes/`;
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
      throw new Error(`Failed to fetch resumes: ${response.status}`);
    }

    const resumes = await response.json();
    
    // Handle different API response structures
    const resumeArray = Array.isArray(resumes) ? resumes : 
                       (resumes?.results || resumes?.data || []);
    
    console.log("✅ Resumes fetched:", resumeArray.length, "resumes");
    return resumeArray;

  } catch (error) {
    console.error("❌ Error fetching resumes:", error);
    toast.error("Failed to load resumes", {
      style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
    });
    throw error;
  }
}

// Fetch resume statistics
export async function fetchResumeStats() {
  try {
    console.log("📊 Fetching resume statistics...");
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${API_BASE}/resumes/stats/`;
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
      throw new Error(`Failed to fetch resume stats: ${response.status}`);
    }

    const stats = await response.json();
    console.log("✅ Resume stats fetched:", stats);
    return stats;

  } catch (error) {
    console.error("❌ Error fetching resume stats:", error);
    return null; // Return null for graceful fallback
  }
}

// Upload a new resume
export async function uploadResume(formData: FormData) {
  try {
    console.log("📤 Uploading resume...");
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${API_BASE}/resumes/`;
    console.log("🌐 Uploading to:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("📨 Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to upload resume: ${response.status}`);
    }

    const resume = await response.json();
    console.log("✅ Resume uploaded:", resume);
    
    toast.success("Resume uploaded successfully!", {
      style: { background: "linear-gradient(90deg, #10b981, #059669)" },
    });
    
    return resume;

  } catch (error) {
    console.error("❌ Error uploading resume:", error);
    toast.error("Failed to upload resume", {
      style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
    });
    throw error;
  }
}

// Update an existing resume
export async function updateResume(resumeId: number, data: any) {
  try {
    console.log("📝 Updating resume:", resumeId);
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${API_BASE}/resumes/${resumeId}/`;
    console.log("🌐 Updating at:", url);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log("📨 Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update resume: ${response.status}`);
    }

    const resume = await response.json();
    console.log("✅ Resume updated:", resume);
    
    toast.success("Resume updated successfully!", {
      style: { background: "linear-gradient(90deg, #10b981, #059669)" },
    });
    
    return resume;

  } catch (error) {
    console.error("❌ Error updating resume:", error);
    toast.error("Failed to update resume", {
      style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
    });
    throw error;
  }
}

// Delete a resume
export async function deleteResume(resumeId: number) {
  try {
    console.log("🗑️ Deleting resume:", resumeId);
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${API_BASE}/resumes/${resumeId}/`;
    console.log("🌐 Deleting from:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("📨 Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to delete resume: ${response.status}`);
    }

    console.log("✅ Resume deleted successfully");
    
    toast.success("Resume deleted successfully!", {
      style: { background: "linear-gradient(90deg, #10b981, #059669)" },
    });

  } catch (error) {
    console.error("❌ Error deleting resume:", error);
    toast.error("Failed to delete resume", {
      style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
    });
    throw error;
  }
}

// Set resume as default
export async function setDefaultResume(resumeId: number) {
  try {
    console.log("⭐ Setting default resume:", resumeId);
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${API_BASE}/resumes/${resumeId}/set-default/`;
    console.log("🌐 Setting default at:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("📨 Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to set default resume: ${response.status}`);
    }

    console.log("✅ Default resume set successfully");
    
    toast.success("Default resume updated!", {
      style: { background: "linear-gradient(90deg, #10b981, #059669)" },
    });

  } catch (error) {
    console.error("❌ Error setting default resume:", error);
    toast.error("Failed to set default resume", {
      style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
    });
    throw error;
  }
}

// Download resume
export async function downloadResume(resumeId: number, filename: string) {
  try {
    console.log("⬇️ Downloading resume:", resumeId);
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${API_BASE}/resumes/${resumeId}/download/`;
    console.log("🌐 Downloading from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("📨 Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to download resume: ${response.status}`);
    }

    // Create download link
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    console.log("✅ Resume downloaded successfully");
    
    toast.success("Resume downloaded!", {
      style: { background: "linear-gradient(90deg, #10b981, #059669)" },
    });

  } catch (error) {
    console.error("❌ Error downloading resume:", error);
    toast.error("Failed to download resume", {
      style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
    });
    throw error;
  }
}