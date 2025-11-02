// components/jobs/searchbar.tsx
"use client";

import { useState } from 'react';

interface SearchJobsProps {
  onSearch: (query: string, location: string) => void;
}

const SearchJobs: React.FC<SearchJobsProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔍 [SEARCH_JOBS] Form submitted:", { query, location });
    onSearch(query, location);
  };

  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Over 10,000+ jobs to apply
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your Next Big Career Leave Startup Best Ideas - Explore The Best Job Opportunities<br />
          And Take The First Jobs Shared Your Partner
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for jobs"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchJobs;