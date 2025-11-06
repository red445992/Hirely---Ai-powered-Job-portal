import { redirect } from "next/navigation";
import { industries } from "@/data/industries";
import OnboardingForm from "./components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";

// Make this page dynamic since it uses cookies for authentication
export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  // Check if user is already onboarded
  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    redirect("/sensai/dashboard");
  }

  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
}