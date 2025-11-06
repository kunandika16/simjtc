import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CandidateSidebar } from '@/components/candidate/candidate-sidebar'

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <CandidateSidebar userName={profile.full_name || 'Kandidat'} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  )
}
