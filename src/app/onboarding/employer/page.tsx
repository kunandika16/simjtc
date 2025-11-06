import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EmployerOnboardingWizard } from '@/components/onboarding/employer-onboarding-wizard'

export default async function EmployerOnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is employer
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'employer') {
    redirect('/dashboard')
  }

  if (profile.onboarding_completed) {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Onboarding Perusahaan</h1>
        <p className="text-muted-foreground">
          Lengkapi data perusahaan Anda untuk mulai merekrut kandidat
        </p>
      </div>

      <EmployerOnboardingWizard />
    </div>
  )
}
