// app/apply/[jobId]/page.tsx
import { toast } from 'sonner';
import ApplyJobs from './applyjobs';
import { fetchJob } from '@/lib/api';

// Define the params type properly
interface PageProps {
  params: Promise<{ jobId: string }>;
}

export default async function ApplyPage({ params }: PageProps) {
  // Await the params since Next.js 14+ uses async params
  const { jobId } = await params;
  
  console.log("🎯 Apply page loaded with jobId:", jobId);

  if (!jobId || isNaN(Number(jobId))) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Invalid Job ID</h3>
          <p className="text-neutral-600 mb-4">The job ID in the URL is invalid.</p>
          <a
            href="/jobs"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Back to Jobs
          </a>
        </div>
      </div>
    );
  }

  try {
    const job = await fetchJob(jobId);
    
    // Validate that we got proper job data
    if (!job || !job.id || !job.title) {
      // throw new Error('Invalid job data received');
      toast.error('Invalid job data received', {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    }

    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <ApplyJobs jobData={job} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ Error in apply page:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'The job you\'re trying to apply for doesn\'t exist or has been removed.';

    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Job Not Found</h3>
          <p className="text-neutral-600 mb-4">{errorMessage}</p>
          <a
            href="/jobs"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Back to Jobs
          </a>
        </div>
      </div>
    );
  }
}

// Optional: Generate metadata for the page
export async function generateMetadata({ params }: PageProps) {
  const { jobId } = await params;
  
  try {
    const job = await fetchJob(jobId);
    return {
      title: `Apply for ${job.title} at ${job.company} | Hirely`,
      description: `Apply for the ${job.title} position at ${job.company} in ${job.location}. ${job.description?.substring(0, 160)}...`,
    };
  } catch {
    return {
      title: 'Job Not Found | Hirely',
      description: 'The job you are looking for does not exist.',
    };
  }
}