import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getJobById } from '@/actions/job.actions'
import { getJobApplications } from '@/actions/candidate.actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ApplicationStatusBadge } from '@/components/employer/application-status-badge'
import { ApplicationActions } from '@/components/employer/application-actions'
import { ArrowLeft, User } from 'lucide-react'

interface JobApplicationsPageProps {
  params: Promise<{ id: string }>
}

export default async function JobApplicationsPage({
  params,
}: JobApplicationsPageProps) {
  const { id } = await params
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

  if (!profile || profile.role !== 'employer') {
    redirect('/dashboard')
  }

  // Get job details
  const jobResult = await getJobById(id)

  if (!jobResult.success || !jobResult.data) {
    redirect('/dashboard/employer')
  }

  const job = jobResult.data.job

  // Get applications
  const applicationsResult = await getJobApplications(id)
  const applications =
    applicationsResult.success && applicationsResult.data
      ? applicationsResult.data.applications
      : []

  // Group applications by status
  const groupedApplications = {
    submitted: applications.filter((app: any) => app.status === 'submitted'),
    screening: applications.filter((app: any) => app.status === 'screening'),
    interview: applications.filter((app: any) => app.status === 'interview'),
    offer: applications.filter((app: any) => app.status === 'offer'),
    hired: applications.filter((app: any) => app.status === 'hired'),
    rejected: applications.filter((app: any) => app.status === 'rejected'),
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/dashboard/employer/jobs/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Aplikasi Kandidat</h1>
          <p className="text-muted-foreground mt-1">{job.title}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groupedApplications.submitted.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Screening</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groupedApplications.screening.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Interview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groupedApplications.interview.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groupedApplications.offer.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groupedApplications.hired.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groupedApplications.rejected.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pelamar ({applications.length})</CardTitle>
          <CardDescription>
            Kelola aplikasi kandidat untuk lowongan ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Belum ada pelamar</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Lowongan ini belum mendapat aplikasi dari kandidat
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application: any) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">
                        {application.profiles?.full_name || 'Kandidat'}
                      </h3>
                      <ApplicationStatusBadge status={application.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {application.profiles?.city && (
                        <span>{application.profiles.city}</span>
                      )}
                      {application.profiles?.phone && (
                        <span>{application.profiles.phone}</span>
                      )}
                      <span>
                        Melamar{' '}
                        {new Date(application.applied_at).toLocaleDateString(
                          'id-ID',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                    {application.interview_at && (
                      <div className="text-sm text-primary">
                        Interview:{' '}
                        {new Date(application.interview_at).toLocaleDateString(
                          'id-ID',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                        {application.interview_location &&
                          ` - ${application.interview_location}`}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/dashboard/employer/candidates/${application.user_id}`}
                      >
                        Lihat Profil
                      </Link>
                    </Button>
                    <ApplicationActions
                      applicationId={application.id}
                      currentStatus={application.status}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
