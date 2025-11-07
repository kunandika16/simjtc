import { Suspense } from 'react'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getJobBySlug, getSimilarJobs } from '@/actions/job.actions'
import { checkApplicationStatus } from '@/actions/application.actions'
import { checkIfJobSaved, getSavedJobIds } from '@/actions/saved-jobs.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { JobCard } from '@/components/jobs/job-card'
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  Calendar,
  ExternalLink,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Globe,
  Home,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { ApplyButton } from '@/components/jobs/apply-button'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface JobDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

async function JobDetailContent({ slug }: { slug: string }) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch job details
  const jobResult = await getJobBySlug(slug)

  if (!jobResult.success || !jobResult.data?.job) {
    notFound()
  }

  const job = jobResult.data.job

  // Check application and saved status in parallel
  const [applicationStatus, savedStatus, candidateProfileResult, similarJobsResult] = await Promise.all([
    checkApplicationStatus(job.id),
    checkIfJobSaved(job.id),
    supabase
      .from('candidate_profiles')
      .select('full_name, cv_url')
      .eq('user_id', user.id)
      .single(),
    getSimilarJobs(job.id, job.category, job.location_city, 4),
  ])

  const hasApplied = applicationStatus.data?.hasApplied || false
  const isSaved = savedStatus.data?.isSaved || false
  const candidateProfile = candidateProfileResult.data
  const similarJobs = similarJobsResult.data?.jobs || []

  // Get saved job IDs for similar jobs
  const savedJobIdsResult = await getSavedJobIds()
  const savedJobIds = savedJobIdsResult.data?.jobIds || []

  // Get applied job IDs for similar jobs
  const { data: applications } = await supabase
    .from('applications')
    .select('job_id')
    .eq('user_id', user.id)

  const appliedJobIds = (applications || []).map(app => app.job_id)

  const employer = job.employers

  // Format employment type
  const employmentTypeLabel = {
    fulltime: 'Full Time',
    parttime: 'Part Time',
    internship: 'Internship',
    contract: 'Contract',
  }[job.employment_type || 'fulltime']

  // Format salary
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) {
      return job.salary_negotiable ? 'Negotiable' : null
    }

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('id-ID').format(num)
    }

    if (job.salary_min && job.salary_max) {
      return `Rp ${formatNumber(job.salary_min)} - ${formatNumber(job.salary_max)}`
    }
    if (job.salary_min) {
      return `Rp ${formatNumber(job.salary_min)}+`
    }
    if (job.salary_max) {
      return `Up to Rp ${formatNumber(job.salary_max)}`
    }
    return null
  }

  const salaryText = formatSalary()

  // Posted date
  const postedDate = job.published_at
    ? formatDistanceToNow(new Date(job.published_at), {
        addSuffix: true,
        locale: localeId,
      })
    : null

  // Deadline date
  const deadlineDate = job.deadline ? new Date(job.deadline) : null
  const isExpired = deadlineDate ? deadlineDate < new Date() : false
  const deadlineText = deadlineDate
    ? formatDistanceToNow(deadlineDate, {
        addSuffix: true,
        locale: localeId,
      })
    : null

  // Location text
  const locationText = job.is_remote
    ? 'Remote'
    : job.location_city
    ? `${job.location_city}${job.location_country && job.location_country !== 'Indonesia' ? `, ${job.location_country}` : ''}`
    : null

  // Parse requirements if it's JSONB
  const requirements =
    typeof job.requirements === 'string'
      ? JSON.parse(job.requirements)
      : job.requirements || []

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/candidate/jobs" className="hover:text-foreground">
          Lowongan
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <span className="text-foreground font-medium line-clamp-1">{job.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Company & Title */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <p className="text-lg text-muted-foreground mb-4">
                    {employer?.company_name}
                  </p>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {locationText && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {locationText}
                      </span>
                    )}
                    {job.employment_type && (
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4" />
                        {employmentTypeLabel}
                      </span>
                    )}
                    {postedDate && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Posted {postedDate}
                      </span>
                    )}
                    {job.views_count && (
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {job.views_count} views
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {job.category && (
                  <Badge variant="secondary">{job.category}</Badge>
                )}
                {job.is_remote && (
                  <Badge variant="default" className="bg-green-500">
                    Remote
                  </Badge>
                )}
                {isExpired && (
                  <Badge variant="destructive">Expired</Badge>
                )}
              </div>

              {/* Apply Status Alert */}
              {hasApplied && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Anda sudah melamar pekerjaan ini
                  </span>
                </div>
              )}

              {isExpired && !hasApplied && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-red-900">
                    Lowongan ini sudah ditutup
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Description */}
          {job.description && (
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi Pekerjaan</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </CardContent>
            </Card>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <Card>
              <CardHeader>
                <CardTitle>Tanggung Jawab</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                />
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {Array.isArray(requirements) && requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Persyaratan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits && (
            <Card>
              <CardHeader>
                <CardTitle>Benefit & Fasilitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.benefits }}
                />
              </CardContent>
            </Card>
          )}

          {/* Similar Jobs */}
          {similarJobs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Lowongan Serupa</h2>
              <div className="grid gap-4">
                {similarJobs.map((similarJob) => (
                  <JobCard
                    key={similarJob.id}
                    job={similarJob}
                    isSaved={savedJobIds.includes(similarJob.id)}
                    isApplied={appliedJobIds.includes(similarJob.id)}
                    showActions
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Apply Button - Sticky */}
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-4">
              <ApplyJobDialog
                job={job}
                candidateProfile={candidateProfile}
                hasApplied={hasApplied}
                isExpired={isExpired}
              />
            </CardContent>
          </Card>

          {/* Job Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Lowongan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Salary */}
              {salaryText && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Gaji</p>
                    <p className="font-semibold text-primary">{salaryText}</p>
                    {job.salary_negotiable && (
                      <p className="text-xs text-muted-foreground">Negotiable</p>
                    )}
                  </div>
                </div>
              )}

              {/* Deadline */}
              {deadlineDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-semibold">
                      {deadlineDate.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">{deadlineText}</p>
                  </div>
                </div>
              )}

              {/* Quota */}
              {job.quota && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Kuota</p>
                    <p className="font-semibold">
                      {job.applications_count || 0} / {job.quota} pelamar
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Info */}
          {employer && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tentang Perusahaan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{employer.company_name}</p>
                    {employer.industry && (
                      <p className="text-sm text-muted-foreground">
                        {employer.industry}
                      </p>
                    )}
                  </div>
                </div>

                {employer.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <Home className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{employer.address}</span>
                  </div>
                )}

                {employer.website && (
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={employer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Kunjungi Website
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}


export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params

  return (
    <div className="p-8">
      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-64" />
            <div className="h-64 bg-muted rounded animate-pulse" />
          </div>
        }
      >
        <JobDetailContent slug={slug} />
      </Suspense>
    </div>
  )
}
