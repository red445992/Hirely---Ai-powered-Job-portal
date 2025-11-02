"use client";

import { useState, useEffect } from "react";
import JobsLayout from "./jobslayout";

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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Apply filters when criteria changes
  useEffect(() => {
    applyFilters();
  }, [jobs, selectedCategories, selectedLocations, searchQuery, searchLocation]);

  const fetchJobs = async () => {
    console.log("📡 Fetching jobs from API...");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/addjobs/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // Support multiple response shapes: array, { jobs: [] }, { data: [] }, and DRF paginated { results: [] }
      const fetchedCount =
        (Array.isArray(data) && data.length) ||
        (data?.results && Array.isArray(data.results) && data.results.length) ||
        (data?.jobs && Array.isArray(data.jobs) && data.jobs.length) ||
        (data?.data && Array.isArray(data.data) && data.data.length) ||
        0;

      console.log("✅ Jobs fetched:", fetchedCount);

      // Normalize response format into an array of jobs
      let jobsData: Job[] = [];
      if (Array.isArray(data)) {
        jobsData = data;
      } else if (data?.results && Array.isArray(data.results)) {
        jobsData = data.results;
      } else if (data?.jobs && Array.isArray(data.jobs)) {
        jobsData = data.jobs;
      } else if (data?.data && Array.isArray(data.data)) {
        jobsData = data.data;
      }

      setJobs(jobsData);
      setFilteredJobs(jobsData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch jobs";
      console.error("❌ Error:", errorMsg);
      setError(errorMsg);

      // Fallback to mock data
      const mockJobs = generateMockJobs();
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Search query filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (searchLocation.trim()) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((job) =>
        selectedCategories.includes(job.category)
      );
    }

    // Location checkbox filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((job) =>
        selectedLocations.includes(job.location)
      );
    }

    console.log(`🔍 Filtered: ${filtered.length} of ${jobs.length} jobs`);
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    setSearchLocation(location);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchLocation("");
    setSelectedCategories([]);
    setSelectedLocations([]);
    setCurrentPage(1);
  };

  const handleRetry = () => {
    fetchJobs();
  };

  // Calculate counts for filters
  const calculateCounts = () => {
    const categoryCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};

    jobs.forEach((job) => {
      categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
      locationCounts[job.location] = (locationCounts[job.location] || 0) + 1;
    });

    return { categoryCounts, locationCounts };
  };

  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const { categoryCounts, locationCounts } = calculateCounts();

  return (
    <JobsLayout
      jobs={jobs}
      filteredJobs={filteredJobs}
      currentJobs={currentJobs}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      searchLocation={searchLocation}
      selectedCategories={selectedCategories}
      selectedLocations={selectedLocations}
      currentPage={currentPage}
      totalPages={totalPages}
      indexOfFirstJob={indexOfFirstJob}
      indexOfLastJob={indexOfLastJob}
      categoryCounts={categoryCounts}
      locationCounts={locationCounts}
      onSearch={handleSearch}
      onCategoryChange={handleCategoryChange}
      onLocationChange={handleLocationChange}
      onPageChange={handlePageChange}
      onClearFilters={handleClearFilters}
      onRetry={handleRetry}
    />
    
  );
}

// Mock data generator
function generateMockJobs(): Job[] {
  return Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    title: ["Full Stack Developer", "Frontend Engineer", "Backend Developer", "UX Designer", "Product Manager"][i % 5],
    company: ["Tech Corp", "Startup XYZ", "Enterprise Inc", "Innovation Labs", "Digital Solutions"][i % 5],
    location: ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune"][i % 5],
    level: ["Senior Level", "Mid Level", "Junior Level", "Entry Level"][i % 4],
    description: "You will be responsible for development tasks. You will work closely with our team.",
    category: ["Programming", "Marketing", "Design", "Business", "Operations"][i % 5],
    salary: "$80,000 - $120,000",
    type: "Full-time",
    posted_date: new Date().toISOString().split("T")[0],
  }));
}