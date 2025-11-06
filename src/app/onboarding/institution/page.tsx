import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InstitutionOnboardingWizard } from '@/components/onboarding/institution-onboarding-wizard'

export default async function InstitutionOnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is institution
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'institution') {
    redirect('/dashboard')
  }

  if (profile.onboarding_completed) {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Onboarding Lembaga Pelatihan</h1>
        <p className="text-muted-foreground">
          Lengkapi data lembaga pelatihan Anda untuk mulai menawarkan program
          pelatihan
        </p>
      </div>

      <InstitutionOnboardingWizard />
    </div>
  )
}
