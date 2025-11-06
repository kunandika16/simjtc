import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function InstitutionDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'institution') {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Dashboard Institusi</h1>
      <p className="mt-4 text-muted-foreground">
        Selamat datang di dashboard lembaga pelatihan
      </p>
    </div>
  )
}
