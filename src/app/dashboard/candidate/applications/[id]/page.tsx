import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Detail Lamaran #{id}</h1>
      <p className="mt-4 text-muted-foreground">
        Fitur application detail sedang dalam development...
      </p>
    </div>
  )
}
