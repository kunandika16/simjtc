import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, FileText, Clock, CheckCircle, XCircle, Briefcase } from 'lucide-react'
import { ApplicationStatusBadge } from '@/components/employer/application-status-badge'

export default async function EmployerApplicationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get employer ID
  const { data: employer } = await supabase
    .from('employers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!employer) {
    redirect('/dashboard/employer')
  }

  // Get all applications for employer's jobs
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      job:jobs!inner(
        id,
        title,
        employer_id
      ),
      candidate:profiles!applications_user_id_fkey(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('job.employer_id', employer.id)
    .order('applied_at', { ascending: false })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Calculate stats
  const stats = {
    total: applications?.length || 0,
    submitted: applications?.filter((a) => a.status === 'submitted').length || 0,
    screening: applications?.filter((a) => a.status === 'screening').length || 0,
    interview: applications?.filter((a) => a.status === 'interview').length || 0,
    offer: applications?.filter((a) => a.status === 'offer').length || 0,
    hired: applications?.filter((a) => a.status === 'hired').length || 0,
    rejected: applications?.filter((a) => a.status === 'rejected').length || 0,
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Lamaran Masuk</h1>
        <p className="text-muted-foreground">Kelola semua lamaran dari kandidat</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Screening
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{stats.screening}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Interview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{stats.interview}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{stats.offer}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Hired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.hired}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {!applications || applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Belum ada lamaran</p>
              <p className="text-muted-foreground">Lamaran dari kandidat akan muncul di sini</p>
            </CardContent>
          </Card>
        ) : (
          applications.map((application: any) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {application.candidate?.avatar_url ? (
                          <img
                            src={application.candidate.avatar_url}
                            alt={application.candidate.full_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <Users className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {application.candidate?.full_name || 'Kandidat'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Melamar untuk: {application.job?.title}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ApplicationStatusBadge status={application.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <p>Tanggal Melamar: {formatDate(application.applied_at)}</p>
                    {application.rating && (
                      <p className="mt-1">
                        Rating: {'⭐'.repeat(application.rating)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/employer/jobs/${application.job?.id}/applications`}>
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
