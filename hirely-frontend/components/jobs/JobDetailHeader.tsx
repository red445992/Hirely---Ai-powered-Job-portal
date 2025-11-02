import React from 'react';
import { MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';

interface JobDetailHeaderProps {
  title: string;
  company: string;
  location: string;
  level: string;
  salary?: string;
  postedDate?: string;
  onApply: () => void;
}

export default function JobDetailHeader({
  title,
  company,
  location,
  level,
  salary,
  postedDate,
  onApply,
}: JobDetailHeaderProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex items-start justify-between gap-6">
        {/* Left side - Job info */}
        <div className="flex gap-4 flex-1">
          {/* Company Logo */}
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <div className="w-12 h-12 bg-white rounded grid grid-cols-2 gap-0.5 p-1">
              <div className="bg-red-500 rounded-sm"></div>
              <div className="bg-blue-500 rounded-sm"></div>
              <div className="bg-green-500 rounded-sm"></div>
              <div className="bg-yellow-500 rounded-sm"></div>
            </div>
          </div>

          {/* Job Title and Meta */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              {title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-3">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>{company}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
              {salary && (
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>{salary}</span>
                </div>
              )}
              {postedDate && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Posted {postedDate}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                {company}
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                {level}
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Apply button */}
        <button
          onClick={onApply}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          Apply now
        </button>
      </div>
    </div>
  );
}