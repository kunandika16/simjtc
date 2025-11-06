import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getJobById } from '@/actions/job.actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { JobActions } from '@/components/employer/job-actions'
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  Users,
  Eye,
  DollarSign,
  Calendar,
} from 'lucide-react'

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
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
  const result = await getJobById(id)

  if (!result.success || !result.data) {
    redirect('/dashboard/employer')
  }

  const job = result.data.job

  return (
    <div className="container mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/employer">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <JobStatusBadge status={job.status} />
            {job.published_at && (
              <span className="text-sm text-muted-foreground">
                Dipublikasi {new Date(job.published_at).toLocaleDateString('id-ID')}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/employer/jobs/${job.id}/applications`}>
              <Users className="mr-2 h-4 w-4" />
              Lihat Pelamar ({job.applications_count})
            </Link>
          </Button>
          <JobActions jobId={job.id} currentStatus={job.status} />
        </div>
      </div>

      <Separator />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <Link href={`/dashboard/employer/jobs/${job.id}/applications`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pelamar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{job.applications_count}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Klik untuk lihat detail
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{job.views_count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quota</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{job.quota || 'Tidak dibatasi'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Job Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deskripsi Pekerjaan</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>

          {job.responsibilities && (
            <Card>
              <CardHeader>
                <CardTitle>Tanggung Jawab</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="whitespace-pre-wrap">{job.responsibilities}</p>
              </CardContent>
            </Card>
          )}

          {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Persyaratan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(job.requirements as string[]).map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {job.benefits && (
            <Card>
              <CardHeader>
                <CardTitle>Benefit</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="whitespace-pre-wrap">{job.benefits}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Lowongan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.employment_type && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Tipe Pekerjaan</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {job.employment_type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Lokasi</p>
                  <p className="text-sm text-muted-foreground">
                    {job.is_remote
                      ? 'Remote / Work from Home'
                      : job.location_city || 'Tidak disebutkan'}
                  </p>
                </div>
              </div>

              {job.category && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Kategori</p>
                    <p className="text-sm text-muted-foreground">{job.category}</p>
                  </div>
                </div>
              )}

              {(job.salary_min || job.salary_max) && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Gaji</p>
                    <p className="text-sm text-muted-foreground">
                      {job.salary_min && job.salary_max
                        ? `Rp ${job.salary_min.toLocaleString('id-ID')} - Rp ${job.salary_max.toLocaleString('id-ID')}`
                        : job.salary_min
                        ? `Mulai dari Rp ${job.salary_min.toLocaleString('id-ID')}`
                        : `Sampai Rp ${job.salary_max?.toLocaleString('id-ID')}`}
                      {job.salary_negotiable && ' (Negotiable)'}
                    </p>
                  </div>
                </div>
              )}

              {job.deadline && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Batas Akhir</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(job.deadline).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Tambahan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dibuat</span>
                <span>
                  {new Date(job.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Terakhir diupdate</span>
                <span>
                  {new Date(job.updated_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
