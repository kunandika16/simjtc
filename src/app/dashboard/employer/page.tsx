import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getEmployerJobs } from '@/actions/job.actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Briefcase, Eye, Users } from 'lucide-react'

export default async function EmployerDashboardPage() {
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

  // Get employer's jobs
  const result = await getEmployerJobs()
  const jobs = result.success && result.data ? result.data.jobs : []

  // Calculate stats
  const stats = {
    total: jobs.length,
    published: jobs.filter((j) => j.status === 'published').length,
    draft: jobs.filter((j) => j.status === 'draft').length,
    totalApplications: jobs.reduce((sum, j) => sum + j.applications_count, 0),
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Perusahaan</h1>
          <p className="mt-2 text-muted-foreground">
            Kelola lowongan pekerjaan dan kandidat
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/employer/jobs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Posting Lowongan
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Lowongan
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lowongan Aktif
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pelamar
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Lowongan Pekerjaan</CardTitle>
          <CardDescription>
            Daftar semua lowongan yang Anda posting
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Belum ada lowongan
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Mulai dengan membuat lowongan pekerjaan pertama Anda
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/employer/jobs/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Buat Lowongan
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{job.title}</h3>
                      <JobStatusBadge status={job.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {job.location_city && (
                        <span>{job.location_city}</span>
                      )}
                      {job.employment_type && (
                        <span className="capitalize">
                          {job.employment_type}
                        </span>
                      )}
                      <span>{job.applications_count} pelamar</span>
                      <span>{job.views_count} views</span>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/employer/jobs/${job.id}`}>
                      Lihat Detail
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function JobStatusBadge({ status }: { status: string }) {
  const variants: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
  > = {
    draft: { label: 'Draft', variant: 'secondary' },
    pending: { label: 'Pending', variant: 'outline' },
    published: { label: 'Published', variant: 'default' },
    closed: { label: 'Closed', variant: 'destructive' },
    archived: { label: 'Archived', variant: 'outline' },
  }

  const config = variants[status] || variants.draft

  return <Badge variant={config.variant}>{config.label}</Badge>
}
