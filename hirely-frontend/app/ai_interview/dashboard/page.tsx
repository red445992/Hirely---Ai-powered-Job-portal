import ProgressDashboard from "@/components/ai_interview/ProgressDashboard";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/ai_interview"
          className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all shadow-md border border-gray-200 flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to AI Interview</span>
        </Link>
      </div>
      <ProgressDashboard />
    </div>
  );
}
