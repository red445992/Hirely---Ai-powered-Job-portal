
import { redirect } from "next/dist/client/components/navigation";
import OnboardingForm from "../onboarding/components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";
import { industries } from "@/data/industries";

export default async function DashboardPage() {

      // Check if user is already onboarded
      const { isOnboarded } = await getUserOnboardingStatus();
    
      if (!isOnboarded) {
        redirect("/sensai/onboarding");
      }
       return (
    <main>
        <OnboardingForm industries={industries} />
    </main>
  );
    
}