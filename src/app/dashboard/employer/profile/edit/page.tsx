import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EmployerProfileEditForm } from '@/components/employer/employer-profile-edit-form'

export default async function EmployerProfileEditPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: employer } = await supabase
    .from('employers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!employer) {
    redirect('/dashboard/employer')
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Profil Perusahaan</h1>
        <p className="text-muted-foreground">Perbarui informasi perusahaan Anda</p>
      </div>

      <EmployerProfileEditForm employer={employer} />
    </div>
  )
}
