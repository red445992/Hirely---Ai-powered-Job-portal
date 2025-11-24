"use client";

import SearchJobs from "@/components/jobs/searchbar";
import TrustedBy from "@/components/jobs/trustedby";
import FilterSidebar from "@/components/jobs/filtersidebar";
import JobCard from "@/components/jobs/jobscard";
import Pagination from "@/components/jobs/pagination";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  level: string;
  description: string;
  category: string;
  salary?: string;
  type?: string;
  posted_date?: string;
}

interface JobsLayoutProps {
  // Data
  jobs: Job[];
  filteredJobs: Job[];
  currentJobs: Job[];
  
  // States
  loading: boolean;
  error: string | null;
  
  // Search & Filter states
  searchQuery: string;
  searchLocation: string;
  selectedCategories: string[];
  selectedLocations: string[];
  
  // Pagination
  currentPage: number;
  totalPages: number;
  indexOfFirstJob: number;
  indexOfLastJob: number;
  
  // Counts
  categoryCounts: Record<string, number>;
  locationCounts: Record<string, number>;
  
  // Handlers
  onSearch: (query: string, location: string) => void;
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  onRetry: () => void;
}

export default function JobsLayout({
  jobs,
  filteredJobs,
  currentJobs,
  loading,
  error,
  searchQuery,
  searchLocation,
  selectedCategories,
  selectedLocations,
  currentPage,
  totalPages,
  indexOfFirstJob,
  indexOfLastJob,
  categoryCounts,
  locationCounts,
  onSearch,
  onCategoryChange,
  onLocationChange,
  onPageChange,
  onClearFilters,
  onRetry,
}: JobsLayoutProps) {
  
  // Loading State
  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            Failed to load jobs
          </h3>
          <p className="text-neutral-600 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasActiveFilters = searchQuery || searchLocation || 
    selectedCategories.length > 0 || selectedLocations.length > 0;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Search Bar Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <SearchJobs 
            onSearch={onSearch}
            initialQuery={searchQuery}
            initialLocation={searchLocation}
          />
        </div>
      </div>

      {/* Trusted By Section */}
      <TrustedBy />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <FilterSidebar
                selectedCategories={selectedCategories}
                selectedLocations={selectedLocations}
                onCategoryChange={onCategoryChange}
                onLocationChange={onLocationChange}
                categoryCounts={categoryCounts}
                locationCounts={locationCounts}
                searchQuery={searchQuery}
                searchLocation={searchLocation}
                onClearSearch={onClearFilters}
              />
            </div>
          </div>

          {/* Main Content - Jobs Grid */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Latest jobs
              </h2>
              <p className="text-neutral-600">
                Get your desired job from top companies
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-neutral-500">
                  Showing {filteredJobs.length > 0 ? indexOfFirstJob + 1 : 0}-
                  {Math.min(indexOfLastJob, filteredJobs.length)} of{" "}
                  {filteredJobs.length} jobs
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={onClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
              {error && jobs.length > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Using cached data: {error}
                  </p>
                </div>
              )}
            </div>

            {/* Jobs Grid */}
            {currentJobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentJobs.map((job) => (
                    <JobCard key={job.id} {...job} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                  />
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
                <div className="text-6xl mb-4">😔</div>
                <p className="text-neutral-500 text-lg mb-2">
                  No jobs found matching your filters
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={onClearFilters}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

