import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CandidateOnboardingWizard } from '@/components/onboarding/candidate-onboarding-wizard'

export const metadata: Metadata = {
  title: 'Onboarding - Candidate',
  description: 'Lengkapi profil Anda sebagai kandidat',
}

export default async function CandidateOnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user has candidate role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'candidate') {
    redirect('/dashboard')
  }

  // If onboarding already completed, redirect to dashboard
  if (profile.onboarding_completed) {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Lengkapi Profil Anda</h1>
        <p className="mt-2 text-muted-foreground">
          Isi data diri Anda untuk mulai melamar pekerjaan dan mengikuti pelatihan
        </p>
      </div>

      <CandidateOnboardingWizard />
    </div>
  )
}
