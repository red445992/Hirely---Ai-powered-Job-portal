"use client";

import { useState, useEffect } from "react";
import ManageJobs from "./managejobs";
import EditJobDialog from "./EditJobDialog";
import { Job } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const { user, token } = useAuth();
   const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  console.log("🔵 ManageJobsPage Component Rendered");
  console.log("👤 Current User:", user);

  // Fetch jobs from backend
  useEffect(() => {
    console.log("🔄 useEffect triggered - fetching jobs");
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    console.log("🚀 ========== FETCHING JOBS ==========");
    setLoading(true);
    
    try {
      const token = localStorage.getItem("access_token");
      console.log("🔑 Auth Token:", token ? `${token.substring(0, 20)}...` : "No token found");

      const apiUrl = "http://localhost:8000/jobs/addjobs/";
      console.log("🌐 API Endpoint:", apiUrl);

      console.log("⏳ Sending GET request...");
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("📡 Response Status:", response.status);
      console.log("📡 Response Status Text:", response.statusText);

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        console.log("❌ Error Response:", text);
        throw new Error(`Failed to fetch jobs: ${response.status} ${text}`);
      }

      const jobsData = await response.json();
      console.log("📦 Raw Response Data:", jobsData);

      // Normalize response shapes
      let jobsArray = [] as any[];
      if (Array.isArray(jobsData)) {
        console.log("✅ Response is an array");
        jobsArray = jobsData;
      } else if (jobsData && Array.isArray(jobsData.results)) {
        console.log("✅ Response has 'results' array");
        jobsArray = jobsData.results;
      } else if (jobsData && Array.isArray(jobsData.jobs)) {
        console.log("✅ Response has 'jobs' array");
        jobsArray = jobsData.jobs;
      } else if (jobsData && Array.isArray(jobsData.data)) {
        console.log("✅ Response has 'data' array");
        jobsArray = jobsData.data;
      } else {
        console.warn("⚠️ Unexpected jobs response shape:", jobsData);
        jobsArray = [];
      }

      console.log(`✅ Parsed ${jobsArray.length} jobs:`, jobsArray);
      setJobs(jobsArray as Job[]);
      console.log("✅ Jobs state updated");

    } catch (error) {
      console.log("❌ ========== ERROR FETCHING JOBS ==========");
      console.error("❌ Error:", error);
      toast.error("Failed to load jobs", {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    } finally {
      setLoading(false);
      console.log("🏁 ========== FETCH JOBS ENDED ==========\n\n");
    }
  };
  const openEditDialog = (job: Job) => {
    setEditingJob(job);
    setIsEditDialogOpen(true);
    setActiveMenu(null); // Close the menu
  };

  const closeEditDialog = () => {
    setEditingJob(null);
    setIsEditDialogOpen(false);
  };

  const handleJobUpdated = (updatedJob: Job) => {
    setJobs(jobs.map(job => 
      job.id === updatedJob.id ? updatedJob : job
    ));
  };

  const handleToggleVisibility = async (id: number) => {
    console.log("🚀 ========== TOGGLING JOB VISIBILITY ==========");
    console.log("🆔 Job ID:", id);

    try {
      const token = localStorage.getItem("access_token");
      const apiUrl = `http://localhost:8000/jobs/${id}/toggle-status/`;
      console.log("🌐 API Endpoint:", apiUrl);

      console.log("⏳ Sending PATCH request...");
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("📡 Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to toggle job status: ${response.status}`);
      }

      const updatedJob = await response.json();
      console.log("✅ Updated Job:", updatedJob);
      
      // Update local state
      setJobs(jobs.map(job => 
        job.id === id ? updatedJob : job
      ));
      console.log("✅ Local state updated");

      toast.success(`Job ${updatedJob.is_active ? 'activated' : 'deactivated'}`, {
        style: { background: "linear-gradient(90deg, #22c55e, #16a34a)" },
      });

    } catch (error) {
      console.log("❌ ========== ERROR TOGGLING VISIBILITY ==========");
      console.error("❌ Error:", error);
      toast.error("Failed to update job status", {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    } finally {
      console.log("🏁 ========== TOGGLE VISIBILITY ENDED ==========\n\n");
    }
  };

  const handleDeleteJob = async (id: number) => {
    console.log("🚀 ========== DELETING JOB ==========");
    console.log("🆔 Job ID:", id);

    if (!confirm("Are you sure you want to delete this job?")) {
      console.log("❌ User cancelled deletion");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const apiUrl = `http://localhost:8000/jobs/${id}/`;
      console.log("🌐 API Endpoint:", apiUrl);

      console.log("⏳ Sending DELETE request...");
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("📡 Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to delete job: ${response.status}`);
      }

      console.log("✅ Job deleted successfully");

      // Remove from local state
      setJobs(jobs.filter(job => job.id !== id));
      setActiveMenu(null);
      console.log("✅ Local state updated");

      toast.success("Job deleted successfully", {
        style: { background: "linear-gradient(90deg, #22c55e, #16a34a)" },
      });

    } catch (error) {
      console.log("❌ ========== ERROR DELETING JOB ==========");
      console.error("❌ Error:", error);
      toast.error("Failed to delete job", {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    } finally {
      console.log("🏁 ========== DELETE JOB ENDED ==========\n\n");
    }
  };

  const handleToggleMenu = (id: number) => {
    console.log("🔄 Toggling menu for job ID:", id);
    console.log("Previous activeMenu:", activeMenu);
    const newActiveMenu = activeMenu === id ? null : id;
    setActiveMenu(newActiveMenu);
    console.log("New activeMenu:", newActiveMenu);
  };

  console.log("📊 Current State:", {
    jobsCount: jobs.length,
    loading,
    activeMenu,
  });

  return (
    <>
      <ManageJobs
        jobs={jobs}
        loading={loading}
        activeMenu={activeMenu}
        onToggleVisibility={handleToggleVisibility}
        onDeleteJob={handleDeleteJob}
        onToggleMenu={handleToggleMenu}
        openEditDialog={openEditDialog}
      />

      <EditJobDialog
        job={editingJob}
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        onJobUpdated={handleJobUpdated}
        token={token || ''}
      />
    </>
  );
}