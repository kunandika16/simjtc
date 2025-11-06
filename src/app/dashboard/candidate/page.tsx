import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCandidateApplications } from '@/actions/candidate.actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  Search,
  User,
} from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function CandidateDashboardPage() {
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

  // Get candidate profile separately
  const { data: candidateProfile } = await supabase
    .from('candidate_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get candidate's applications
  const result = await getCandidateApplications()
  const applications = result.success && result.data ? result.data.applications : []

  // Calculate stats
  const stats = {
    total: applications.length,
    active: applications.filter(
      (app: any) =>
        ['submitted', 'screening', 'interview'].includes(app.status)
    ).length,
    interviews: applications.filter((app: any) => app.status === 'interview')
      .length,
    offers: applications.filter((app: any) => app.status === 'offer').length,
  }

  // Get recent applications (last 5)
  const recentApplications = applications.slice(0, 5)

  // Get upcoming interviews
  const upcomingInterviews = applications
    .filter((app: any) => app.interview_at && new Date(app.interview_at) > new Date())
    .sort(
      (a: any, b: any) =>
        new Date(a.interview_at).getTime() - new Date(b.interview_at).getTime()
    )
    .slice(0, 3)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Selamat datang kembali, {profile.full_name || 'Kandidat'}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Lamaran
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Semua aplikasi Anda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lamaran Aktif
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Sedang diproses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviews}</div>
            <p className="text-xs text-muted-foreground">
              Dijadwalkan interview
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penawaran</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.offers}</div>
            <p className="text-xs text-muted-foreground">
              Tawaran pekerjaan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lamaran Terbaru</CardTitle>
                  <CardDescription>
                    Status lamaran pekerjaan Anda
                  </CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/candidate/applications">
                    Lihat Semua
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentApplications.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    Belum ada lamaran
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Mulai cari dan lamar pekerjaan yang sesuai dengan Anda
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard/candidate/jobs">
                      <Search className="mr-2 h-4 w-4" />
                      Cari Lowongan
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app: any) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{app.jobs?.title}</h3>
                          <ApplicationStatusBadge status={app.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {app.jobs?.employers?.company_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Melamar{' '}
                          {new Date(app.applied_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/candidate/applications/${app.id}`}>
                          Detail
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Interviews */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Interview Mendatang</CardTitle>
              <CardDescription>
                Jadwal interview Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingInterviews.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Belum ada interview dijadwalkan
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingInterviews.map((app: any) => (
                    <div
                      key={app.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <h4 className="font-medium text-sm">
                        {app.jobs?.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {app.jobs?.employers?.company_name}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(app.interview_at).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </span>
                      </div>
                      {app.interview_location && (
                        <p className="text-xs text-muted-foreground">
                          📍 {app.interview_location}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Completeness */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Kelengkapan Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileCompletenessWidget profile={candidateProfile} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Status Badge Component
function ApplicationStatusBadge({ status }: { status: string }) {
  const variants: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
  > = {
    submitted: { label: 'Menunggu', variant: 'secondary' },
    screening: { label: 'Screening', variant: 'outline' },
    interview: { label: 'Interview', variant: 'default' },
    offer: { label: 'Ditawarkan', variant: 'default' },
    hired: { label: 'Diterima', variant: 'default' },
    rejected: { label: 'Ditolak', variant: 'destructive' },
  }

  const config = variants[status] || variants.submitted

  return <Badge variant={config.variant}>{config.label}</Badge>
}

// Profile Completeness Widget
function ProfileCompletenessWidget({ profile }: { profile: any }) {
  if (!profile) {
    return (
      <div className="text-sm">
        <p className="text-muted-foreground mb-2">
          Lengkapi profil untuk meningkatkan peluang Anda
        </p>
        <Button asChild size="sm" className="w-full">
          <Link href="/dashboard/candidate/profile/edit">Lengkapi Profil</Link>
        </Button>
      </div>
    )
  }

  const fields = [
    { label: 'Data Pribadi', value: profile.full_name && profile.birth_date },
    { label: 'Pendidikan', value: profile.education_level && profile.institution },
    { label: 'Keahlian', value: profile.skills && profile.skills.length > 0 },
    { label: 'Dokumen', value: profile.cv_url || profile.diploma_url },
  ]

  const completedFields = fields.filter((f) => f.value).length
  const percentage = (completedFields / fields.length) * 100

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="space-y-1">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {field.value ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <div className="h-3 w-3 rounded-full border-2" />
            )}
            <span className={field.value ? '' : 'text-muted-foreground'}>
              {field.label}
            </span>
          </div>
        ))}
      </div>
      {percentage < 100 && (
        <Button asChild size="sm" variant="outline" className="w-full mt-2">
          <Link href="/dashboard/candidate/profile/edit">
            Lengkapi Profil
          </Link>
        </Button>
      )}
    </div>
  )
}
