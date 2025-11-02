// ========================================
// FILE 1: app/dashboard/employer/manage-jobs/managejobs.tsx
// UI Component (Client Side)
// ========================================

"use client";

import Link from "next/link";
import { Plus, Eye, EyeOff, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Job } from "@/lib/types";

interface ManageJobsProps {
  jobs: Job[];
  loading: boolean;
  activeMenu: number | null;
  onToggleVisibility: (id: number) => void;
  onDeleteJob: (id: number) => void;
  onToggleMenu: (id: number) => void;
  openEditDialog: (job: Job) => void;
  
}

export default function ManageJobs({
  jobs,
  loading,
  activeMenu,
  onToggleVisibility,
  onDeleteJob,
  onToggleMenu,
  openEditDialog,
}: ManageJobsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Manage Jobs</h1>
            <p className="text-neutral-600 mt-1">Loading jobs...</p>
          </div>
          <Link
            href="/dashboard/employer/add-job"
            className="flex items-center gap-2 bg-gradient-to-b from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add new job
          </Link>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
          <div className="animate-pulse">Loading your job postings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Manage Jobs</h1>
          <p className="text-neutral-600 mt-1">
            View and manage all your job postings
          </p>
        </div>

        <Link
          href="/dashboard/employer/add-job"
          className="flex items-center gap-2 bg-gradient-to-b from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add new job
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-visible">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-neutral-50 border-b border-neutral-200 text-sm font-semibold text-neutral-700">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Job Title</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-2">Applicants</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-neutral-100">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors"
            >
              {/* Number */}
              <div className="col-span-1 text-sm text-neutral-600">
                {index + 1}
              </div>

              {/* Job Title */}
              <div className="col-span-4">
                <h3 className="font-medium text-neutral-800">{job.title}</h3>
                <p className="text-sm text-neutral-500">{job.company}</p>
                <div className="flex gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {job.category}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    {job.level}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-2 text-sm text-neutral-600">
                {job.date}
              </div>

              {/* Location */}
              <div className="col-span-2 text-sm text-neutral-600">
                {job.location}
              </div>

              {/* Applicants */}
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    (job.applicants_count ?? 0) > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {job.applicants_count ?? 0} applicant
                  {(job.applicants_count ?? 0) !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center gap-2">
                <button
                  onClick={() => onToggleVisibility(job.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    job.is_active
                      ? "text-green-600 hover:bg-green-50"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                  title={job.is_active ? "Hide job" : "Show job"}
                >
                  {job.is_active ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>

                {/* More Actions Menu */}
                <div className="space-y-6">
                  {/* Header and Table remain the same */}

                  {/* Update the More Actions Menu */}
                  <div className="relative">
                    <button
                          onClick={() => onToggleMenu(job.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {activeMenu === job.id && (
                      <>
                        {/* Backdrop to close menu */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => onToggleMenu(job.id)}
                        />

                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
                          <button
                            onClick={() => openEditDialog(job)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Job
                          </button>
                          <button
                            onClick={() => onDeleteJob(job.id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Job
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                 
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-neutral-400 mb-2">No jobs posted yet</div>
            <Link
              href="/dashboard/employer/add-job"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first job posting
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
