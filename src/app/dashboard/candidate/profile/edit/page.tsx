import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ProfileEditForm } from '@/components/candidate/profile-edit-form'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function EditProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'candidate') {
    redirect('/dashboard')
  }

  // Get candidate profile
  const { data: candidateProfile } = await supabase
    .from('candidate_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get candidate experiences
  const { data: experiences } = await supabase
    .from('candidate_experiences')
    .select('*')
    .eq('candidate_id', user.id)
    .order('start_date', { ascending: false })

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/candidate/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Profil</h1>
          <p className="mt-2 text-muted-foreground">
            Update informasi profil Anda
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <ProfileEditForm
        candidateProfile={candidateProfile}
        experiences={experiences || []}
      />
    </div>
  )
}
