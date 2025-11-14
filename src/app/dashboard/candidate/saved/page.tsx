import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSavedJobs } from '@/actions/saved-jobs.actions'
import { JobCard } from '@/components/jobs/job-card'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, Heart, Search } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function SavedJobsPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch saved jobs
  const savedJobsResult = await getSavedJobs()
  const savedJobs = savedJobsResult.data?.savedJobs || []
  const total = savedJobsResult.data?.total || 0

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bookmark className="h-8 w-8 text-primary" />
          Lowongan Tersimpan
        </h1>
        <p className="mt-2 text-muted-foreground">
          {total > 0
            ? `${total} lowongan yang Anda simpan`
            : 'Belum ada lowongan yang disimpan'}
        </p>
      </div>

      {/* Content */}
      {savedJobs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedJobs.map((job: any) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={true}
              showActions
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <Heart className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Belum Ada Lowongan Tersimpan
                </h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Simpan lowongan yang menarik untuk Anda agar mudah diakses
                  kembali nanti. Klik ikon bookmark pada kartu lowongan untuk
                  menyimpan.
                </p>
                <Button asChild className="mt-2">
                  <Link href="/dashboard/candidate/jobs">
                    <Search className="h-4 w-4 mr-2" />
                    Cari Lowongan
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
