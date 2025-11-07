'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResponse } from '@/types/database.types'
import type { Database } from '@/types/database.types'

type Job = Database['public']['Tables']['jobs']['Row']
type JobInsert = Database['public']['Tables']['jobs']['Insert']
type JobUpdate = Database['public']['Tables']['jobs']['Update']

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100) + '-' + Date.now().toString(36)
}

// Get employer ID from user
async function getEmployerId(userId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('employers')
    .select('id')
    .eq('user_id', userId)
    .single()

  return data?.id || null
}

// Create Job Posting
export async function createJobPosting(data: {
  title: string
  description: string
  responsibilities?: string
  requirements?: string[]
  benefits?: string
  location_city?: string
  location_country?: string
  is_remote?: boolean
  employment_type?: 'fulltime' | 'parttime' | 'internship' | 'contract'
  category?: string
  salary_min?: number
  salary_max?: number
  salary_negotiable?: boolean
  quota?: number
  deadline?: string
  status?: 'draft' | 'pending' | 'published'
}): Promise<ActionResponse<{ job: Job }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get employer ID
    const employerId = await getEmployerId(user.id)
    if (!employerId) {
      return { success: false, error: 'Employer profile not found' }
    }

    // Generate slug
    const slug = generateSlug(data.title)

    // Prepare job data
    const jobData: JobInsert = {
      title: data.title,
      slug,
      employer_id: employerId,
      created_by: user.id,
      description: data.description,
      responsibilities: data.responsibilities || null,
      requirements: data.requirements ? JSON.parse(JSON.stringify(data.requirements)) : null,
      benefits: data.benefits || null,
      location_city: data.location_city || null,
      location_country: data.location_country || 'Indonesia',
      is_remote: data.is_remote || false,
      employment_type: data.employment_type || null,
      category: data.category || null,
      salary_min: data.salary_min || null,
      salary_max: data.salary_max || null,
      currency: 'IDR',
      salary_negotiable: data.salary_negotiable ?? true,
      quota: data.quota || null,
      deadline: data.deadline || null,
      status: data.status || 'draft',
      published_at: data.status === 'published' ? new Date().toISOString() : null,
    }

    const { data: job, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single()

    if (error) {
      console.error('Error creating job posting:', error)
      return { success: false, error: 'Gagal membuat lowongan' }
    }

    revalidatePath('/dashboard/employer')
    return {
      success: true,
      message: 'Lowongan berhasil dibuat',
      data: { job },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Get All Jobs for Employer
export async function getEmployerJobs(): Promise<
  ActionResponse<{ jobs: Job[] }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get employer ID
    const employerId = await getEmployerId(user.id)
    if (!employerId) {
      return { success: false, error: 'Employer profile not found' }
    }

    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching jobs:', error)
      return { success: false, error: 'Gagal mengambil data lowongan' }
    }

    return {
      success: true,
      data: { jobs: jobs || [] },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Get Single Job
export async function getJobById(
  jobId: string
): Promise<ActionResponse<{ job: Job }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error) {
      console.error('Error fetching job:', error)
      return { success: false, error: 'Gagal mengambil data lowongan' }
    }

    // Verify ownership
    const employerId = await getEmployerId(user.id)
    if (job.employer_id !== employerId) {
      return { success: false, error: 'Unauthorized' }
    }

    return {
      success: true,
      data: { job },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Update Job Posting
export async function updateJobPosting(
  jobId: string,
  data: {
    title?: string
    description?: string
    responsibilities?: string
    requirements?: string[]
    benefits?: string
    location_city?: string
    location_country?: string
    is_remote?: boolean
    employment_type?: 'fulltime' | 'parttime' | 'internship' | 'contract'
    category?: string
    salary_min?: number
    salary_max?: number
    salary_negotiable?: boolean
    quota?: number
    deadline?: string
    status?: 'draft' | 'pending' | 'published' | 'closed' | 'archived'
  }
): Promise<ActionResponse<{ job: Job }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify ownership
    const employerId = await getEmployerId(user.id)
    const { data: existingJob } = await supabase
      .from('jobs')
      .select('employer_id, status')
      .eq('id', jobId)
      .single()

    if (!existingJob || existingJob.employer_id !== employerId) {
      return { success: false, error: 'Unauthorized' }
    }

    // Prepare update data
    const updateData: JobUpdate = {
      ...data,
      requirements: data.requirements ? JSON.parse(JSON.stringify(data.requirements)) : undefined,
      updated_at: new Date().toISOString(),
    }

    // Set published_at if status changes to published
    if (data.status === 'published' && existingJob.status !== 'published') {
      updateData.published_at = new Date().toISOString()
    }

    // Update slug if title changes
    if (data.title) {
      updateData.slug = generateSlug(data.title)
    }

    const { data: job, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', jobId)
      .select()
      .single()

    if (error) {
      console.error('Error updating job:', error)
      return { success: false, error: 'Gagal memperbarui lowongan' }
    }

    revalidatePath('/dashboard/employer')
    return {
      success: true,
      message: 'Lowongan berhasil diperbarui',
      data: { job },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Delete Job Posting
export async function deleteJobPosting(
  jobId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify ownership
    const employerId = await getEmployerId(user.id)
    const { data: existingJob } = await supabase
      .from('jobs')
      .select('employer_id')
      .eq('id', jobId)
      .single()

    if (!existingJob || existingJob.employer_id !== employerId) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase.from('jobs').delete().eq('id', jobId)

    if (error) {
      console.error('Error deleting job:', error)
      return { success: false, error: 'Gagal menghapus lowongan' }
    }

    revalidatePath('/dashboard/employer')
    return {
      success: true,
      message: 'Lowongan berhasil dihapus',
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Publish Job
export async function publishJob(jobId: string): Promise<ActionResponse> {
  return updateJobPosting(jobId, { status: 'published' })
}

// Close Job
export async function closeJob(jobId: string): Promise<ActionResponse> {
  return updateJobPosting(jobId, { status: 'closed' })
}

// Archive Job
export async function archiveJob(jobId: string): Promise<ActionResponse> {
  return updateJobPosting(jobId, { status: 'archived' })
}

// ==================== CANDIDATE FACING ACTIONS ====================

/**
 * Get Published Jobs with Filters & Pagination (Public - for candidates)
 */
export async function getPublishedJobs(params?: {
  search?: string
  category?: string
  location_city?: string
  employment_type?: 'fulltime' | 'parttime' | 'internship' | 'contract'
  is_remote?: boolean
  salary_min?: number
  salary_max?: number
  sort_by?: 'latest' | 'salary_high' | 'salary_low' | 'deadline'
  page?: number
  limit?: number
}): Promise<ActionResponse<{ jobs: any[]; total: number; pages: number }>> {
  try {
    const supabase = await createClient()

    const {
      search = '',
      category,
      location_city,
      employment_type,
      is_remote,
      salary_min,
      salary_max,
      sort_by = 'latest',
      page = 1,
      limit = 20,
    } = params || {}

    // Build query
    let query = supabase
      .from('jobs')
      .select(
        `
        *,
        employers (
          id,
          company_name,
          industry,
          city,
          province
        )
      `,
        { count: 'exact' }
      )
      .eq('status', 'published')
      .gt('deadline', new Date().toISOString())

    // Search filter (full-text search)
    if (search && search.trim()) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`
      )
    }

    // Category filter
    if (category) {
      query = query.eq('category', category)
    }

    // Location filter
    if (location_city) {
      query = query.eq('location_city', location_city)
    }

    // Employment type filter
    if (employment_type) {
      query = query.eq('employment_type', employment_type)
    }

    // Remote filter
    if (is_remote !== undefined) {
      query = query.eq('is_remote', is_remote)
    }

    // Salary filters
    if (salary_min) {
      query = query.gte('salary_min', salary_min)
    }
    if (salary_max) {
      query = query.lte('salary_max', salary_max)
    }

    // Sorting
    switch (sort_by) {
      case 'latest':
        query = query.order('published_at', { ascending: false })
        break
      case 'salary_high':
        query = query.order('salary_max', { ascending: false, nullsLast: true })
        break
      case 'salary_low':
        query = query.order('salary_min', { ascending: true, nullsLast: true })
        break
      case 'deadline':
        query = query.order('deadline', { ascending: true, nullsLast: true })
        break
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: jobs, error, count } = await query

    if (error) {
      console.error('Error fetching published jobs:', error)
      return { success: false, error: 'Gagal mengambil data lowongan' }
    }

    const total = count || 0
    const pages = Math.ceil(total / limit)

    return {
      success: true,
      data: { jobs: jobs || [], total, pages },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

/**
 * Get Job by Slug (Public - for job detail page)
 */
export async function getJobBySlug(
  slug: string
): Promise<ActionResponse<{ job: any }>> {
  try {
    const supabase = await createClient()

    // Fetch job with employer info
    const { data: job, error } = await supabase
      .from('jobs')
      .select(
        `
        *,
        employers (
          id,
          company_name,
          industry,
          website,
          address,
          city,
          province
        )
      `
      )
      .eq('slug', slug)
      .single()

    if (error || !job) {
      console.error('Error fetching job by slug:', error)
      return { success: false, error: 'Lowongan tidak ditemukan' }
    }

    // Increment views count (fire and forget)
    supabase
      .from('jobs')
      .update({ views_count: (job.views_count || 0) + 1 })
      .eq('id', job.id)
      .then()

    return {
      success: true,
      data: { job },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

/**
 * Get Similar Jobs by Category & Location
 */
export async function getSimilarJobs(
  jobId: string,
  category?: string | null,
  locationCity?: string | null,
  limit: number = 6
): Promise<ActionResponse<{ jobs: any[] }>> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('jobs')
      .select(
        `
        *,
        employers (
          id,
          company_name,
          industry,
          city
        )
      `
      )
      .eq('status', 'published')
      .gt('deadline', new Date().toISOString())
      .neq('id', jobId)
      .limit(limit)

    // Prioritize same category or location
    if (category) {
      query = query.eq('category', category)
    } else if (locationCity) {
      query = query.eq('location_city', locationCity)
    }

    query = query.order('published_at', { ascending: false })

    const { data: jobs, error } = await query

    if (error) {
      console.error('Error fetching similar jobs:', error)
      return { success: false, error: 'Gagal mengambil data lowongan' }
    }

    return {
      success: true,
      data: { jobs: jobs || [] },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

/**
 * Get Available Categories (for filter dropdown)
 */
export async function getJobCategories(): Promise<
  ActionResponse<{ categories: string[] }>
> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('category')
      .eq('status', 'published')
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching categories:', error)
      return { success: false, error: 'Gagal mengambil kategori' }
    }

    // Get unique categories
    const categories = [...new Set(data.map((item) => item.category).filter(Boolean))] as string[]

    return {
      success: true,
      data: { categories: categories.sort() },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

/**
 * Get Available Locations (for filter dropdown)
 */
export async function getJobLocations(): Promise<
  ActionResponse<{ locations: string[] }>
> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('location_city')
      .eq('status', 'published')
      .not('location_city', 'is', null)

    if (error) {
      console.error('Error fetching locations:', error)
      return { success: false, error: 'Gagal mengambil lokasi' }
    }

    // Get unique locations
    const locations = [...new Set(data.map((item) => item.location_city).filter(Boolean))] as string[]

    return {
      success: true,
      data: { locations: locations.sort() },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}
