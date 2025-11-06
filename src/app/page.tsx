import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth.actions'

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getCurrentUser()

  // If not authenticated, redirect to login
  if (!user) {
    redirect('/auth/login')
  }

  const { profile } = user

  // If no profile, redirect to role selection
  if (!profile) {
    redirect('/join')
  }

  // If onboarding not completed, redirect to onboarding
  if (!profile.onboarding_completed) {
    redirect(`/onboarding/${profile.role}`)
  }

  // If everything is complete, redirect to dashboard
  redirect('/dashboard')
}
