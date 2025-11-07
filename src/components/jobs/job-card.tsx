'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  MapPin,
  Briefcase,
  Clock,
  Building2,
  DollarSign,
  Bookmark,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { toggleSaveJob } from '@/actions/saved-jobs.actions'
import { toast } from 'sonner'

interface JobCardProps {
  job: {
    id: string
    slug: string
    title: string
    description?: string
    location_city?: string
    location_country?: string
    is_remote?: boolean
    employment_type?: string
    category?: string
    salary_min?: number
    salary_max?: number
    currency?: string
    salary_negotiable?: boolean
    deadline?: string
    published_at?: string
    employers?: {
      company_name: string
      industry?: string
      city?: string
    }
  }
  isApplied?: boolean
  isSaved?: boolean
  onSaveToggle?: () => void
  showActions?: boolean
}

export function JobCard({
  job,
  isApplied = false,
  isSaved: initialIsSaved = false,
  onSaveToggle,
  showActions = true,
}: JobCardProps) {
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isSaving, setIsSaving] = useState(false)

  const employer = job.employers

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isSaving) return

    setIsSaving(true)

    try {
      const result = await toggleSaveJob(job.id)

      if (result.success) {
        setIsSaved(!isSaved)
        toast.success(result.message || (!isSaved ? 'Lowongan disimpan' : 'Lowongan dihapus dari simpanan'))
        router.refresh()
        if (onSaveToggle) {
          onSaveToggle()
        }
      } else {
        toast.error(result.error || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Error toggling save:', error)
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSaving(false)
    }
  }

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
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}jt`
      }
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

  // Format posted date
  const postedDate = job.published_at
    ? formatDistanceToNow(new Date(job.published_at), {
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

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header: Company & Save Button */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Company Logo Placeholder */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>

              {/* Company Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {employer?.company_name || 'Company'}
                </h3>
                {employer?.industry && (
                  <p className="text-sm text-muted-foreground truncate">
                    {employer.industry}
                  </p>
                )}
              </div>
            </div>

            {/* Save Button */}
            {showActions && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0 h-9 w-9 p-0"
                onClick={handleSaveToggle}
                disabled={isSaving}
              >
                <Bookmark
                  className={`h-4 w-4 transition-colors ${
                    isSaved ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                />
              </Button>
            )}
          </div>

          {/* Job Title */}
          <div>
            <Link href={`/dashboard/candidate/jobs/${job.slug}`}>
              <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {job.title}
              </h2>
            </Link>
          </div>

          {/* Description */}
          {job.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description.replace(/<[^>]*>/g, '').substring(0, 150)}
            </p>
          )}

          {/* Badges & Info */}
          <div className="flex flex-wrap gap-2">
            {/* Employment Type */}
            {job.employment_type && (
              <Badge variant="secondary" className="font-normal">
                <Briefcase className="h-3 w-3 mr-1" />
                {employmentTypeLabel}
              </Badge>
            )}

            {/* Category */}
            {job.category && (
              <Badge variant="outline" className="font-normal">
                {job.category}
              </Badge>
            )}

            {/* Remote Badge */}
            {job.is_remote && (
              <Badge variant="default" className="font-normal bg-green-500">
                Remote
              </Badge>
            )}
          </div>

          {/* Location, Salary, Posted Date */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {/* Location */}
            {locationText && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {locationText}
              </span>
            )}

            {/* Salary */}
            {salaryText && (
              <span className="flex items-center gap-1.5 text-primary font-medium">
                <DollarSign className="h-3.5 w-3.5" />
                {salaryText}
              </span>
            )}

            {/* Posted Date */}
            {postedDate && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {postedDate}
              </span>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between pt-2 border-t">
              {/* Applied Status */}
              {isApplied ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Sudah Melamar</span>
                </div>
              ) : (
                <div className="flex-1" />
              )}

              {/* View Details Button */}
              <Button variant="outline" size="sm" asChild className="group-hover:border-primary group-hover:text-primary">
                <Link href={`/dashboard/candidate/jobs/${job.slug}`}>
                  Lihat Detail
                  <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
