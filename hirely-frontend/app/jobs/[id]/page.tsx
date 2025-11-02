
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import JobDetailHeader from '@/components/jobs/JobDetailHeader';
import JobDetailContent from '@/components/jobs/JobDetailBody';
import JobDetailSidebar from '@/components/jobs/JobDetailSidebar';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  level: string;
  description: string;
  category: string;
  salary?: string;
  posted_date?: string;
  responsibilities?: string[];
  requirements?: string[];
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const jobId = parseInt(idParam || "", 10);

  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If jobId is not a valid number (e.g., during first render), skip fetching
    if (Number.isNaN(jobId)) return;

    fetchJobDetails();
    fetchRelatedJobs();
  }, [jobId]);

  useEffect(() => {
    console.log("🔍 Related jobs updated:", relatedJobs.length, "jobs for jobId:", jobId);
  }, [relatedJobs, jobId]);

  const fetchJobDetails = async () => {
    console.log("📡 Fetching job details for ID:", jobId);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/`
      );

      if (!response.ok) {
        throw new Error(`Job not found (${response.status})`);
      }

      const data = await response.json();
      console.log("✅ Job details fetched:", data);
      setJob(data);
    } catch (err) {
      console.error("❌ Error fetching job:", err);
      setError(err instanceof Error ? err.message : "Failed to load job");
      
      // Fallback to mock data
      setJob(getMockJob(jobId));
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedJobs = async () => {
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

      if (response.ok) {
        const data = await response.json();
        const jobs = Array.isArray(data) ? data : data.jobs || [];
        console.log("📋 Related jobs fetched:", jobs.length, "jobs");
        setRelatedJobs(jobs.slice(0, 3)); // Take first 3
      } else {
        console.log("📋 API failed, using mock related jobs");
        setRelatedJobs(getMockRelatedJobs());
      }
    } catch (err) {
      console.log("📋 Error fetching, using mock related jobs");
      setRelatedJobs(getMockRelatedJobs());
    }
  };

  const handleApply = () => {
    console.log("🎯 Apply clicked for job:", jobId);
    // Navigate to the application form
    router.push(`/apply/${jobId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !job) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            Job Not Found
          </h3>
          <p className="text-neutral-600 mb-4">{error}</p>
          <button
            onClick={() => {
              console.log("🔄 Navigating to jobs page");
              window.location.href = '/jobs';
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => {
            console.log("🔄 Navigating back to jobs page");
            window.location.href = '/jobs';
          }}
          className="mb-6 text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-2"
        >
          ← Back to jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <JobDetailHeader
              title={job.title}
              company={job.company}
              location={job.location}
              level={job.level}
              salary={job.salary}
              postedDate={job.posted_date}
              onApply={handleApply}
            />

            <JobDetailContent
              description={job.description}
              responsibilities={job.responsibilities}
              requirements={job.requirements}
            />
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <JobDetailSidebar
              relatedJobs={relatedJobs}
              currentJobId={jobId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data functions
function getMockJob(id: number): Job {
  return {
    id,
    title: 'Full Stack Developer',
    company: 'Slack',
    location: 'California',
    level: 'Senior level',
    salary: 'CTC: $25k',
    posted_date: '2d ago',
    category: 'Programming',
    description: `We are seeking a Highly skilled Full-Stack Developer to join our dynamic and innovative team. The ideal candidate will have a passion for developing scalable, web-based solutions that meet the entire technology stack, from front-end design to back-end architecture.

You will collaborate with cross-functional teams to design, develop, and implement new features, ensuring high performance, responsiveness, and security of the application. If you thrive in fast-paced environments, are detail-oriented, and love to solve complex technical challenges, this is the perfect opportunity for you!`,
    responsibilities: [
      'Build, test, and deploy highly responsive web applications using modern front-end and back-end technologies.',
      'Write clean and modular front-end code using HTML, CSS, JavaScript (React, Angular, or Vue.js).',
      'Develop and maintain server-side logic, APIs, and databases using languages such as Node.js, Ruby, or Java.',
      'Design and maintain databases (SQL, NoSQL) for efficiency and reliability.',
      'Verify connected tools to ensure the quality of the application, integration, and end-to-end testing.',
      'Work closely with designers, product managers and engineers to understand requirements and implement features.',
    ],
    requirements: [
      'Knowledge of HTML, CSS, and JavaScript, plus experience with frameworks like React, Angular, or Vue.js.',
      'Experience working with server-side languages like Node.js, Python, Ruby, or Java.',
      'Proficiency in relational databases (MySQL, PostgreSQL) and non-relational databases (e.g., MongoDB).',
      'Experience using Git for tracking changes and collaborating on code.',
      'Good communication and collaboration skills, able to work effectively with others.',
    ],
  };
}

function getMockRelatedJobs(): Job[] {
  return [
    {
      id: 2,
      title: 'Frontend developer',
      company: 'California',
      level: 'Senior level',
      location: 'Remote',
      description: 'You will be responsible for frontend development tasks. You will work closely with our...',
      category: 'Programming',
    },
    {
      id: 3,
      title: 'Backend developer',
      company: 'California',
      level: 'Senior level',
      location: 'California',
      description: 'You will be responsible for backend development tasks. You will work closely with our...',
      category: 'Programming',
    },
    {
      id: 4,
      title: 'Website developer',
      company: 'California',
      level: 'Senior level',
      location: 'Remote',
      description: 'You will be responsible for website development tasks. You will work closely with our...',
      category: 'Design',
    },
  ];
}