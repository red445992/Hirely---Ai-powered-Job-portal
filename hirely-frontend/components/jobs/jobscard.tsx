import React from 'react';
import Link from 'next/link';

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  level: string;
  description: string;
  logo?: string;
}

export default function JobCard({ id, title, company, location, level, description }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
      {/* Logo and Title */}
      <div className="flex items-start gap-4 mb-4">
        {/* Company Logo */}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
          <div className="w-8 h-8 bg-white rounded grid grid-cols-2 gap-0.5 p-1">
            <div className="bg-red-500 rounded-sm"></div>
            <div className="bg-blue-500 rounded-sm"></div>
            <div className="bg-green-500 rounded-sm"></div>
            <div className="bg-yellow-500 rounded-sm"></div>
          </div>
        </div>

        {/* Job Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">
            {title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {company}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
              {level}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
        {description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          href={`/apply/${id}/`}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Apply now
        </Link>
        <Link
          href={`/jobs/${id}`}
          className="px-4 py-2 text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}
