import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPublishedJobs, getJobCategories, getJobLocations } from '@/actions/job.actions'
import { getSavedJobIds } from '@/actions/saved-jobs.actions'
import { JobCard } from '@/components/jobs/job-card'
import { JobFilters } from '@/components/jobs/job-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface SearchParams {
  search?: string
  category?: string
  location_city?: string
  employment_type?: string
  is_remote?: string
  sort_by?: string
  page?: string
}

async function JobsContent({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Parse search params
  const search = searchParams.search || ''
  const category = searchParams.category || ''
  const location_city = searchParams.location_city || ''
  const employment_type = searchParams.employment_type || ''
  const is_remote = searchParams.is_remote === 'true'
  const sort_by = (searchParams.sort_by as any) || 'latest'
  const page = parseInt(searchParams.page || '1', 10)

  // Fetch jobs with filters
  const jobsResult = await getPublishedJobs({
    search,
    category,
    location_city,
    employment_type: employment_type as any,
    is_remote: is_remote || undefined,
    sort_by,
    page,
    limit: 12,
  })

  const jobs = jobsResult.data?.jobs || []
  const total = jobsResult.data?.total || 0
  const pages = jobsResult.data?.pages || 1

  // Get categories, locations, and saved job IDs
  const [categoriesResult, locationsResult, savedJobIdsResult] = await Promise.all([
    getJobCategories(),
    getJobLocations(),
    getSavedJobIds(),
  ])

  const categories = categoriesResult.data?.categories || []
  const locations = locationsResult.data?.locations || []
  const savedJobIds = savedJobIdsResult.data?.jobIds || []

  // Get user's applications to check applied status
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let appliedJobIds: string[] = []
  if (user) {
    const { data: applications } = await supabase
      .from('applications')
      .select('job_id')
      .eq('user_id', user.id)

    appliedJobIds = (applications || []).map(app => app.job_id)
  }

  // Count active filters
  const activeFilters = [
    search && { key: 'search', label: `"${search}"` },
    category && { key: 'category', label: category },
    location_city && { key: 'location_city', label: location_city },
    employment_type && { key: 'employment_type', label: employment_type },
    is_remote && { key: 'is_remote', label: 'Remote' },
  ].filter(Boolean) as { key: string; label: string }[]

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Filters - Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-80 flex-shrink-0">
        <JobFilters categories={categories} locations={locations} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {total > 0 ? `${total} Lowongan Tersedia` : 'Tidak Ada Lowongan'}
              </h2>
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Filter aktif:</span>
                  {activeFilters.map((filter) => (
                    <Badge key={filter.key} variant="secondary">
                      {filter.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <JobFilters categories={categories} locations={locations} isMobile />
            </div>
          </div>

          {/* Jobs Grid */}
          {jobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobIds.includes(job.id)}
                  isApplied={appliedJobIds.includes(job.id)}
                  showActions
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Tidak Ada Lowongan Ditemukan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Coba ubah filter atau kata kunci pencarian Anda
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                asChild={page > 1}
              >
                {page > 1 ? (
                  <a
                    href={`?${new URLSearchParams({
                      ...searchParams,
                      page: String(page - 1),
                    }).toString()}`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </a>
                ) : (
                  <span>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </span>
                )}
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                  let pageNum: number
                  if (pages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= pages - 2) {
                    pageNum = pages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      asChild={page !== pageNum}
                      disabled={page === pageNum}
                    >
                      {page === pageNum ? (
                        <span>{pageNum}</span>
                      ) : (
                        <a
                          href={`?${new URLSearchParams({
                            ...searchParams,
                            page: String(pageNum),
                          }).toString()}`}
                        >
                          {pageNum}
                        </a>
                      )}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= pages}
                asChild={page < pages}
              >
                {page < pages ? (
                  <a
                    href={`?${new URLSearchParams({
                      ...searchParams,
                      page: String(page + 1),
                    }).toString()}`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                ) : (
                  <span>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar Skeleton */}
      <aside className="hidden lg:block lg:w-80 flex-shrink-0">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-20 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      </aside>

      {/* Content Skeleton */}
      <div className="flex-1">
        <div className="space-y-6">
          <div className="h-10 bg-muted rounded animate-pulse w-64" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function CandidateJobsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Check authentication
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          Cari Lowongan
        </h1>
        <p className="mt-2 text-muted-foreground">
          Temukan pekerjaan yang sesuai dengan keahlian dan minat Anda
        </p>
      </div>

      {/* Jobs Content */}
      <Suspense fallback={<LoadingSkeleton />}>
        <JobsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
