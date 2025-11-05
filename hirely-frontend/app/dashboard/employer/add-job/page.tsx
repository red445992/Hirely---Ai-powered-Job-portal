"use client";

import { useState, useEffect } from "react";
import AddJobs from "./addjobs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, ArrowRight, Users, Briefcase, TrendingUp } from "lucide-react";

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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [createdJob, setCreatedJob] = useState<any>(null);
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
      
      // Fixed URL to match backend endpoint
      const url = `${apiBase}/jobs/addjobs/`;

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
        let errorMessage = `Failed to create job (${response.status})`;
        
        try {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          
          // Handle field validation errors
          if (errorData.detail) {
            errorMessage = `Failed to create job: ${errorData.detail}`;
          } else if (typeof errorData === 'object') {
            // Handle field-level errors
            const fieldErrors = Object.entries(errorData)
              .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
              .join('; ');
            errorMessage = `Validation errors: ${fieldErrors}`;
          }
        } catch (parseError) {
          // Response is not JSON (probably HTML error page)
          const errorText = await response.text();
          console.error("Non-JSON error response:", errorText);
          
          if (response.status === 404) {
            errorMessage = "Job creation endpoint not found. Please check the backend URL configuration.";
          } else {
            errorMessage = `Server error (${response.status}). Please try again.`;
          }
        }
        
        toast.error(errorMessage, {
          style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
        });
        return;
      }

      const data = await response.json();
      
      // Store created job data and show success message
      setCreatedJob(data);
      setShowSuccessMessage(true);
      
      toast.success("Job posted successfully!", {
        style: { background: "linear-gradient(90deg, #22c55e, #16a34a)" },
      });
      console.log("Job posted successfully:", data);

      // Reset form after a delay to show success message
      setTimeout(() => {
        resetForm();
      }, 100);
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
        {/* Success Message */}
        {showSuccessMessage && createdJob && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900">
                  Job Posted Successfully! 🎉
                </h3>
                <p className="text-green-700 mt-1">
                  Your job posting for <strong>{createdJob.title}</strong> at <strong>{createdJob.company}</strong> has been published successfully and is now live for candidates to apply.
                </p>
              </div>
            </div>
            
            <div className="bg-white border border-green-200 rounded-md p-4 space-y-2">
              <h4 className="font-medium text-green-900">What happens next?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Your job is now visible to qualified candidates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>You'll receive email notifications when candidates apply</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Track applications and candidates in your employer dashboard</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.location.href = '/dashboard/employer/applications'}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>View Applications</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/dashboard/employer'}
                className="inline-flex items-center gap-2 px-4 py-2 border border-green-300 text-green-700 hover:bg-green-50 font-medium rounded-md transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setShowSuccessMessage(false);
                  setCreatedJob(null);
                }}
                className="px-4 py-2 border border-green-300 text-green-700 hover:bg-green-50 font-medium rounded-md transition-colors"
              >
                Post Another Job
              </button>
            </div>
          </div>
        )}

        {/* Hide form when success message is shown */}
        {!showSuccessMessage && (
          <AddJobs
            formData={formData}
            isSubmitting={isSubmitting}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}