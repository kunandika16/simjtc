import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Bell } from 'lucide-react'

export default async function EmployerNotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Notifikasi</h1>
        <p className="text-muted-foreground">Lihat semua notifikasi terbaru</p>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="py-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Fitur Notifikasi Segera Hadir</p>
          <p className="text-muted-foreground">
            Anda akan menerima notifikasi untuk lamaran baru, update kandidat, dan aktivitas penting lainnya.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
