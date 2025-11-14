'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResponse } from '@/types/database.types'

/**
 * Check if a job is saved by the current user
 */
export async function checkIfJobSaved(
  jobId: string
): Promise<ActionResponse<{ isSaved: boolean; savedId?: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: savedJob, error } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('user_id', user.id)
      .eq('job_id', jobId)
      .maybeSingle()

    if (error) {
      console.error('Error checking saved status:', error)
      return { success: false, error: 'Gagal mengecek status' }
    }

    return {
      success: true,
      data: {
        isSaved: !!savedJob,
        savedId: savedJob?.id,
      },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

/**
 * Save/bookmark a job
 */
export async function saveJob(jobId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if already saved
    const checkResult = await checkIfJobSaved(jobId)
    if (checkResult.data?.isSaved) {
      return { success: false, error: 'Lowongan sudah disimpan' }
    }

    // Check if job exists and is published
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, status')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return { success: false, error: 'Lowongan tidak ditemukan' }
    }

    if (job.status !== 'published') {
      return { success: false, error: 'Lowongan tidak tersedia' }
    }

    // Save the job
    const { error: saveError } = await supabase.from('saved_jobs').insert({
      user_id: user.id,
      job_id: jobId,
      saved_at: new Date().toISOString(),
    })

    if (saveError) {
      console.error('Error saving job:', saveError)
      return { success: false, error: 'Gagal menyimpan lowongan' }
    }

    revalidatePath('/dashboard/candidate/saved')
    revalidatePath('/dashboard/candidate/jobs')

    return {
      success: true,
      message: 'Lowongan berhasil disimpan',
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

/**
 * Unsave/remove bookmark from a job
 */
export async function unsaveJob(jobId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Delete the saved job
    const { error: deleteError } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', user.id)
      .eq('job_id', jobId)

    if (deleteError) {
      console.error('Error unsaving job:', deleteError)
      return { success: false, error: 'Gagal menghapus dari simpanan' }
    }

    revalidatePath('/dashboard/candidate/saved')
    revalidatePath('/dashboard/candidate/jobs')

    return {
      success: true,
      message: 'Lowongan dihapus dari simpanan',
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

/**
 * Toggle save/unsave a job
 */
export async function toggleSaveJob(jobId: string): Promise<ActionResponse> {
  const checkResult = await checkIfJobSaved(jobId)

  if (!checkResult.success) {
    return checkResult
  }

  if (checkResult.data?.isSaved) {
    return await unsaveJob(jobId)
  } else {
    return await saveJob(jobId)
  }
}

/**
 * Get all saved jobs for the current user
 */
export async function getSavedJobs(params?: {
  sort_by?: 'latest' | 'deadline'
  category?: string
  location_city?: string
}): Promise<ActionResponse<{ savedJobs: any[]; total: number }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { sort_by = 'latest', category, location_city } = params || {}

    // Build query
    let query = supabase
      .from('saved_jobs')
      .select(
        `
        id,
        saved_at,
        jobs!saved_jobs_job_id_fkey (
          id,
          slug,
          title,
          description,
          location_city,
          location_country,
          is_remote,
          employment_type,
          category,
          salary_min,
          salary_max,
          currency,
          salary_negotiable,
          deadline,
          published_at,
          status,
          employers (
            company_name,
            industry,
            city
          )
        )
      `,
        { count: 'exact' }
      )
      .eq('user_id', user.id)

    // Sorting
    if (sort_by === 'latest') {
      query = query.order('saved_at', { ascending: false })
    }

    const { data: savedJobs, error, count } = await query

    if (error) {
      console.error('Error fetching saved jobs:', error)
      return { success: false, error: 'Gagal mengambil data simpanan' }
    }

    // Filter out jobs that are no longer published or deleted
    const filteredJobs = (savedJobs || [])
      .filter((item) => item.jobs && item.jobs.status === 'published')
      .map((item) => ({
        ...item.jobs,
        saved_at: item.saved_at,
        saved_id: item.id,
      }))

    // Apply client-side filters if needed
    let resultJobs = filteredJobs

    if (category) {
      resultJobs = resultJobs.filter((job) => job.category === category)
    }

    if (location_city) {
      resultJobs = resultJobs.filter((job) => job.location_city === location_city)
    }

    // Sort by deadline if requested (client-side since it's on the job)
    if (sort_by === 'deadline') {
      resultJobs.sort((a, b) => {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      })
    }

    return {
      success: true,
      data: {
        savedJobs: resultJobs,
        total: resultJobs.length,
      },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

/**
 * Get saved jobs IDs for checking multiple jobs at once
 */
export async function getSavedJobIds(): Promise<
  ActionResponse<{ jobIds: string[] }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: savedJobs, error } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching saved job IDs:', error)
      return { success: false, error: 'Gagal mengambil data' }
    }

    const jobIds = (savedJobs || []).map((item) => item.job_id)

    return {
      success: true,
      data: { jobIds },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}
