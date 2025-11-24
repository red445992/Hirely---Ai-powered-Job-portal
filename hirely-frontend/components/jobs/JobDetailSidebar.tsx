import React from 'react';
import Link from 'next/link';

interface RelatedJob {
  id: number;
  title: string;
  company: string;
  level: string;
  location: string;
  description: string;
  category?: string;
  salary?: string;
}

interface JobDetailSidebarProps {
  relatedJobs: RelatedJob[];
  currentJobId: number;
}

export default function JobDetailSidebar({ relatedJobs, currentJobId }: JobDetailSidebarProps) {
  // Filter out current job (just in case)
  const filteredJobs = relatedJobs.filter(job => job.id !== currentJobId);
  
  console.log("🔍 Sidebar Debug:", {
    relatedJobs: relatedJobs.length,
    currentJobId,
    filteredJobs: filteredJobs.length,
    categories: filteredJobs.map(j => j.category)
  });

  // Get the primary category if all jobs are from same category
  const primaryCategory = filteredJobs.length > 0 && 
    filteredJobs.every(j => j.category === filteredJobs[0].category)
    ? filteredJobs[0].category
    : null;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-neutral-900">
          {primaryCategory ? `Similar ${primaryCategory} Jobs` : 'Related Jobs'}
        </h3>
        {filteredJobs.length > 0 && (
          <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
            {filteredJobs.length}
          </span>
        )}
      </div>
      
      {filteredJobs.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-neutral-400 mb-2">📋</div>
          <p className="text-sm text-neutral-500">
            No related jobs available at the moment
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Logo */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shrink-0">
                  <div className="w-7 h-7 bg-white rounded grid grid-cols-2 gap-0.5 p-0.5">
                    <div className="bg-red-500 rounded-sm"></div>
                    <div className="bg-blue-500 rounded-sm"></div>
                    <div className="bg-green-500 rounded-sm"></div>
                    <div className="bg-yellow-500 rounded-sm"></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-neutral-900 mb-1 truncate">
                    {job.title}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-200">
                      {job.company}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 rounded border border-purple-200">
                      {job.level}
                    </span>
                    {job.category && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded border border-green-200">
                        {job.category}
                      </span>
                    )}
                  </div>
                  {job.salary && (
                    <p className="text-xs text-neutral-600 mb-1">
                      💰 {job.salary}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                {job.description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/jobs/${job.id}`}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                >
                  Apply now
                </Link>
                <Link
                  href={`/jobs/${job.id}`}
                  className="px-3 py-2 text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
                >
                  Learn more
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
