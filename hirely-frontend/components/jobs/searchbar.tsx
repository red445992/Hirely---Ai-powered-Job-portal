// components/jobs/searchbar.tsx
"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';

interface SearchJobsProps {
  onSearch: (query: string, location: string) => void;
  initialQuery?: string;
  initialLocation?: string;
}

const SearchJobs: React.FC<SearchJobsProps> = ({ 
  onSearch, 
  initialQuery = '', 
  initialLocation = '' 
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  // Update local state if props change
  useEffect(() => {
    setQuery(initialQuery);
    setLocation(initialLocation);
  }, [initialQuery, initialLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔍 [SEARCH_JOBS] Form submitted:", { query, location });
    onSearch(query.trim(), location.trim());
  };

  const handleClearQuery = () => {
    setQuery('');
    onSearch('', location.trim());
  };

  const handleClearLocation = () => {
    setLocation('');
    onSearch(query.trim(), '');
  };

  const handleClearAll = () => {
    setQuery('');
    setLocation('');
    onSearch('', '');
  };

  const hasFilters = query.trim() || location.trim();

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Over 10,000+ jobs to apply
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your Next Big Career Starts Here - Explore The Best Job Opportunities
          And Take The First Step With Your Dream Job
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-4 md:p-6 mb-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Job Search Input */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, keywords, or company"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClearQuery}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear job search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Location Input */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, state, or remote"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {location && (
                <button
                  type="button"
                  onClick={handleClearLocation}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear location"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Button */}
            <button 
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </form>

        {/* Clear All Button */}
        {hasFilters && (
          <button
            onClick={handleClearAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1 mx-auto"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchJobs;