'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResponse } from '@/types/database.types'

/**
 * Check if user has already applied to a job
 */
export async function checkApplicationStatus(
  jobId: string
): Promise<ActionResponse<{ hasApplied: boolean; applicationId?: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: application, error } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error checking application status:', error)
      return { success: false, error: 'Gagal mengecek status aplikasi' }
    }

    return {
      success: true,
      data: {
        hasApplied: !!application,
        applicationId: application?.id,
      },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

/**
 * Apply to a job
 */
export async function applyToJob(data: {
  jobId: string
  coverLetter?: string
  screeningAnswers?: Record<string, string>
}): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if already applied
    const statusCheck = await checkApplicationStatus(data.jobId)
    if (statusCheck.data?.hasApplied) {
      return { success: false, error: 'Anda sudah melamar pekerjaan ini' }
    }

    // Get job details to check deadline
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('deadline, status, quota, applications_count')
      .eq('id', data.jobId)
      .single()

    if (jobError || !job) {
      return { success: false, error: 'Lowongan tidak ditemukan' }
    }

    // Check if job is still published
    if (job.status !== 'published') {
      return { success: false, error: 'Lowongan tidak tersedia' }
    }

    // Check deadline
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return { success: false, error: 'Lowongan sudah ditutup' }
    }

    // Check quota (if set)
    if (job.quota && job.applications_count && job.applications_count >= job.quota) {
      return { success: false, error: 'Kuota lowongan sudah penuh' }
    }

    // Get candidate profile to ensure it's complete
    const { data: candidateProfile } = await supabase
      .from('candidate_profiles')
      .select('full_name, cv_url')
      .eq('user_id', user.id)
      .single()

    if (!candidateProfile?.full_name) {
      return {
        success: false,
        error: 'Lengkapi profil Anda terlebih dahulu',
      }
    }

    // CV is optional but recommended
    // if (!candidateProfile?.cv_url) {
    //   return {
    //     success: false,
    //     error: 'Upload CV Anda terlebih dahulu',
    //   }
    // }

    // Create application
    const { error: applicationError } = await supabase.from('applications').insert({
      job_id: data.jobId,
      user_id: user.id,
      status: 'submitted',
      cover_letter: data.coverLetter || null,
      screening_answers: data.screeningAnswers || null,
      applied_at: new Date().toISOString(),
    })

    if (applicationError) {
      console.error('Error creating application:', applicationError)
      return { success: false, error: 'Gagal mengirim lamaran' }
    }

    // Increment applications count (fire and forget)
    supabase
      .from('jobs')
      .update({
        applications_count: (job.applications_count || 0) + 1,
      })
      .eq('id', data.jobId)
      .then()

    revalidatePath('/dashboard/candidate/applications')
    revalidatePath('/dashboard/candidate/jobs')
    revalidatePath(`/dashboard/candidate/jobs/${data.jobId}`)

    return {
      success: true,
      message: 'Lamaran berhasil dikirim!',
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

/**
 * Withdraw application
 */
export async function withdrawApplication(
  applicationId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get application to verify ownership
    const { data: application, error: getError } = await supabase
      .from('applications')
      .select('user_id, status, job_id')
      .eq('id', applicationId)
      .single()

    if (getError || !application) {
      return { success: false, error: 'Aplikasi tidak ditemukan' }
    }

    // Verify ownership
    if (application.user_id !== user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if application can be withdrawn
    if (['hired', 'rejected'].includes(application.status)) {
      return {
        success: false,
        error: 'Aplikasi tidak dapat dibatalkan',
      }
    }

    // Delete application
    const { error: deleteError } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId)

    if (deleteError) {
      console.error('Error withdrawing application:', deleteError)
      return { success: false, error: 'Gagal membatalkan lamaran' }
    }

    // Decrement applications count (fire and forget)
    const { data: job } = await supabase
      .from('jobs')
      .select('applications_count')
      .eq('id', application.job_id)
      .single()

    if (job && job.applications_count && job.applications_count > 0) {
      supabase
        .from('jobs')
        .update({
          applications_count: job.applications_count - 1,
        })
        .eq('id', application.job_id)
        .then()
    }

    revalidatePath('/dashboard/candidate/applications')
    revalidatePath('/dashboard/candidate/jobs')

    return {
      success: true,
      message: 'Lamaran berhasil dibatalkan',
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

/**
 * Get my applications (already exists in candidate.actions.ts but we can add here too)
 */
export async function getMyApplications(): Promise<
  ActionResponse<{ applications: any[] }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: applications, error } = await supabase
      .from('applications')
      .select(
        `
        *,
        jobs!applications_job_id_fkey (
          id,
          title,
          slug,
          location_city,
          employment_type,
          salary_min,
          salary_max,
          deadline,
          status,
          employers!jobs_employer_id_fkey (
            company_name,
            industry
          )
        )
      `
      )
      .eq('user_id', user.id)
      .order('applied_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
      return { success: false, error: 'Gagal mengambil data aplikasi' }
    }

    return {
      success: true,
      data: { applications: applications || [] },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}
