import { getIndustryInsights, getDashboardStats, getRecentActivities } from "@/actions/dashboard";
import DashboardView from "./_components/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  // If not onboarded, redirect to onboarding page
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  // Fetch all dashboard data
  const [insights, dashboardStats, recentActivities] = await Promise.all([
    getIndustryInsights(),
    getDashboardStats(),
    getRecentActivities(),
  ]);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your career journey.
        </p>
      </div>
      
      <DashboardView 
        insights={insights} 
        stats={dashboardStats.stats}
        recentActivities={recentActivities}
      />
    </div>
  );
}