import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth.actions";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { profile } = user;

  if (!profile) {
    redirect("/join");
  }

  // Redirect to onboarding if not completed
  if (!profile.onboarding_completed) {
    redirect(`/onboarding/${profile.role}`);
  }

  // Redirect to role-specific dashboard
  switch (profile.role) {
    case "candidate":
      redirect("/dashboard/candidate");
    case "employer":
      redirect("/dashboard/employer");
    case "institution":
      redirect("/dashboard/institution");
    case "admin":
      redirect("/dashboard/admin");
    default:
      redirect("/");
  }
}
