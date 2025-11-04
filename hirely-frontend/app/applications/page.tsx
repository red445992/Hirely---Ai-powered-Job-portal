"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchUserApplications, fetchApplicationStats } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

// Interface for application data matching backend structure
interface Application {
  id: number;
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
  };
  full_name: string;
  email: string;
  phone: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  applied_at: string;
  created_at: string;
  updated_at: string;
  viewed_by_employer: boolean;
}

interface ApplicationStats {
  total_applications: number;
  pending_applications: number;
  shortlisted_applications: number;
  accepted_applications: number;
  rejected_applications: number;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  shortlisted: "bg-blue-100 text-blue-800 border-blue-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  accepted: "bg-green-100 text-green-800 border-green-200"
};

const statusText = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  accepted: "Accepted"
};

export default function ApplicationsPage() {
  const router = useRouter();
  const { isAuthenticated, user, token, mounted } = useAuth();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mounted) return;
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // If authenticated, load data
    loadData();
  }, [isAuthenticated, router, mounted]);

  const loadData = async () => {
    if (!isAuthenticated || !token) {
      setError("Please login to view your applications");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch applications first, then stats (non-blocking)
      const applicationsData = await fetchUserApplications();
      setApplications(applicationsData || []);
      
      // Try to fetch stats, but don't fail if it errors
      try {
        const statsData = await fetchApplicationStats();
        setStats(statsData);
      } catch (statsError) {
        console.warn("Failed to fetch stats, using fallback:", statsError);
        // Use fallback stats based on applications data
        setStats(null);
      }
      
    } catch (err) {
      console.error("Error loading applications:", err);
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        router.push('/auth/login');
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = filter === "all" 
    ? applications 
    : applications.filter((app: Application) => app.status === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show loading during SSR and initial client render
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-blue-500 text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please login to view your job applications</p>
          <Link
            href="/auth/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Applications</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
            <p className="text-gray-600 mt-2">Track and manage your job applications</p>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link 
              href="/resumes"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Manage Resume
            </Link>
            
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">
              {stats?.total_applications ?? applications.length}
            </div>
            <div className="text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">
              {stats?.pending_applications ?? applications.filter((app: Application) => app.status === "pending").length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {stats?.shortlisted_applications ?? applications.filter((app: Application) => app.status === "shortlisted").length}
            </div>
            <div className="text-gray-600">Shortlisted</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {stats?.accepted_applications ?? applications.filter((app: Application) => app.status === "accepted").length}
            </div>
            <div className="text-gray-600">Accepted</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-red-600">
              {stats?.rejected_applications ?? applications.filter((app: Application) => app.status === "rejected").length}
            </div>
            <div className="text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full border ${
                filter === "all" 
                  ? "bg-blue-100 text-blue-800 border-blue-300" 
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-full border ${
                filter === "pending" 
                  ? "bg-yellow-100 text-yellow-800 border-yellow-300" 
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("accepted")}
              className={`px-4 py-2 rounded-full border ${
                filter === "accepted" 
                  ? "bg-green-100 text-green-800 border-green-300" 
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setFilter("shortlisted")}
              className={`px-4 py-2 rounded-full border ${
                filter === "shortlisted" 
                  ? "bg-blue-100 text-blue-800 border-blue-300" 
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              Shortlisted
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-full border ${
                filter === "rejected" 
                  ? "bg-red-100 text-red-800 border-red-300" 
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      {filter === "all" ? "No applications found" : `No ${filter} applications found`}
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application: Application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                            {/* Company logo placeholder */}
                            <span className="text-sm font-medium text-gray-600">
                              {application.job?.company?.charAt(0)?.toUpperCase() || 'C'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {application.job?.company || 'Unknown Company'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.job?.title || 'Unknown Position'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.job?.location || 'Unknown Location'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(application.applied_at)}</div>
                        {!application.viewed_by_employer && (
                          <div className="text-xs text-blue-600">● New</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusColors[application.status]}`}>
                          {statusText[application.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {application.job?.id ? (
                            <Link
                              href={`/jobs/${application.job.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Job
                            </Link>
                          ) : (
                            <span className="text-gray-400">No Job Link</span>
                          )}
                          <Link
                            href={`/applications/${application.id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {applications.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No applications yet</div>
            <div className="text-gray-400 mb-4">Start tracking your job applications</div>
            <Link
              href="/jobs"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}