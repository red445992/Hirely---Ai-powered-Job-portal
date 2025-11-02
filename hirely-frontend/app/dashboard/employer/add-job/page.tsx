"use client";

import { useState, useEffect } from "react";
import AddJobs from "./addjobs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface JobFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  level: string;
  salary: string; // This will be for salary_display
  salary_amount?: string; // Optional numeric salary
  company: string;
  job_type: string;
  is_remote: boolean;
  responsibilities: string;
  requirements: string;
  skills: string;
}

export default function AddJobPage() {
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    category: "",
    location: "",
    level: "",
    salary: "", // For display like "CTC 500+"
    salary_amount: "", // For numeric value
    company: "",
    job_type: "full_time",
    is_remote: false,
    responsibilities: "",
    requirements: "",
    skills: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token, refreshAccess } = useAuth();

  // Debug: Check what's in auth
  useEffect(() => {
    console.log("Current user:", user);
    console.log("Current token:", token);
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced client-side validation
    const requiredFields = [
      'title', 'description', 'category', 'location', 
      'level', 'job_type', 'company'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof JobFormData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`, {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
      return;
    }

    // Check if user is employer
    if (user?.user_type !== "employer") {
      toast.error("Only employers can create jobs", {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting job:", formData);

      // Prepare data for backend
      const submitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        level: formData.level,
        salary: formData.salary_amount ? parseFloat(formData.salary_amount) : null,
        salary_display: formData.salary,
        company: formData.company,
        job_type: formData.job_type,
        is_remote: formData.is_remote,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
        skills: formData.skills,
      };

      console.log("Submitting data:", submitData);

      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      ).replace(/[\/;\s]+$/g, "");
      
      // Updated URL to match backend
      const url = `${apiBase}/jobs/`; // Changed from '/jobs/addjobs/'

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(submitData),
      });

      console.log("Response status:", response.status);

      // Handle token expiration
      if (response.status === 401) {
        const errorData = await response.json();
        console.error("Auth error details:", errorData);
        if (errorData.code === 'token_not_valid') {
          const newToken = await refreshAccess?.();
          if (newToken) {
            // Retry request with new token
            const retryResp = await fetch(url, {
              method: 'POST',
              headers: { ...headers, Authorization: `Bearer ${newToken}` },
              body: JSON.stringify(submitData),
            });

            if (!retryResp.ok) {
              const retryErr = await retryResp.json().catch(() => ({}));
              console.error('Retry API Error:', retryErr);
              toast.error(`Failed to create job: ${retryErr.detail || retryErr.message || 'Unknown error'}`, {
                style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
              });
              return;
            }

            const data = await retryResp.json();
            toast.success('Job posted successfully!', { 
              style: { background: 'linear-gradient(90deg, #22c55e, #16a34a)' } 
            });
            console.log('Job posted successfully (after refresh):', data);
            resetForm();
            return;
          }
        }

        toast.error("Authentication failed. Please login again.", {
          style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
        return;
      }

      if (response.status === 403) {
        toast.error("Only employers can create jobs", {
          style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        
        // Handle field validation errors
        if (errorData.detail) {
          toast.error(`Failed to create job: ${errorData.detail}`, {
            style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
          });
        } else if (typeof errorData === 'object') {
          // Handle field-level errors
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
            .join('; ');
          toast.error(`Validation errors: ${fieldErrors}`, {
            style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
          });
        } else {
          toast.error("Failed to create job. Please check all fields.", {
            style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
          });
        }
        return;
      }

      const data = await response.json();
      toast.success("Job posted successfully!", {
        style: { background: "linear-gradient(90deg, #22c55e, #16a34a)" },
      });
      console.log("Job posted successfully:", data);

      resetForm();
    } catch (error) {
      console.error("Network error posting job:", error);
      toast.error(
        "Network error. Please check your connection and try again.",
        {
          style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      level: "",
      salary: "",
      salary_amount: "",
      company: "",
      job_type: "full_time",
      is_remote: false,
      responsibilities: "",
      requirements: "",
      skills: "",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-3xl mx-auto">
        <AddJobs
          formData={formData}
          isSubmitting={isSubmitting}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}