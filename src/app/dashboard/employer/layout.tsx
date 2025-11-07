import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EmployerSidebar } from '@/components/employer/employer-sidebar'

export default async function EmployerLayout({
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

  if (!profile || profile.role !== 'employer') {
    redirect('/dashboard')
  }

  // Fetch employer data including company name and logo
  const { data: employer } = await supabase
    .from('employers')
    .select('company_name, logo_url')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <EmployerSidebar
        companyName={employer?.company_name || 'Perusahaan'}
        logoUrl={employer?.logo_url}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  )
}
