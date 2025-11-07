import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, Briefcase, Eye, Users, Calendar } from 'lucide-react'
import { JobActions } from '@/components/employer/job-actions'

export default async function EmployerJobsPage() {
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

  // Get all jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('employer_id', employer.id)
    .order('created_at', { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Published</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'pending':
        return <Badge variant="outline">Pending</Badge>
      case 'closed':
        return <Badge variant="destructive">Closed</Badge>
      case 'archived':
        return <Badge variant="outline" className="opacity-50">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getEmploymentTypeBadge = (type: string | null) => {
    if (!type) return null
    const labels: Record<string, string> = {
      fulltime: 'Full Time',
      parttime: 'Part Time',
      internship: 'Internship',
      contract: 'Contract',
    }
    return <Badge variant="outline">{labels[type] || type}</Badge>
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Calculate stats
  const stats = {
    total: jobs?.length || 0,
    published: jobs?.filter((j) => j.status === 'published').length || 0,
    draft: jobs?.filter((j) => j.status === 'draft').length || 0,
    closed: jobs?.filter((j) => j.status === 'closed').length || 0,
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Lowongan Kerja</h1>
          <p className="text-muted-foreground">Kelola semua lowongan kerja perusahaan Anda</p>
        </div>
        <Link href="/dashboard/employer/jobs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Buat Lowongan Baru
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Lowongan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.published}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.draft}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.closed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {!jobs || jobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Belum ada lowongan</p>
              <p className="text-muted-foreground mb-4">Mulai buat lowongan kerja pertama Anda</p>
              <Link href="/dashboard/employer/jobs/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Lowongan Baru
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      {getStatusBadge(job.status)}
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                      {job.location_city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location_city}
                          {job.is_remote && ' (Remote)'}
                        </span>
                      )}
                      {job.employment_type && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {getEmploymentTypeBadge(job.employment_type)}
                        </span>
                      )}
                      {job.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline: {formatDate(job.deadline)}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {job.views_count} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applications_count} aplikasi
                    </span>
                    {job.quota && (
                      <span>
                        Kuota: {job.quota} posisi
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/employer/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                    </Link>
                    <JobActions jobId={job.id} currentStatus={job.status} />
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
