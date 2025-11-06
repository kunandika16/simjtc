'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  CandidatePersonalDataInput,
  CandidateEducationInput,
  CandidateSkillsInput,
  CandidateDocumentsInput,
  CandidateExperienceInput,
} from '@/lib/validations/candidate'
import type { ActionResponse } from '@/types/database.types'

export async function saveCandidatePersonalData(
  data: CandidatePersonalDataInput
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Update candidate_profiles table
    const { error } = await supabase
      .from('candidate_profiles')
      .upsert({
        user_id: user.id,
        nik: data.nik,
        full_name: data.full_name,
        birth_place: data.birth_place,
        birth_date: data.birth_date,
        gender: data.gender,
        address: data.address,
        phone: data.phone,
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error saving personal data:', error)
      return { success: false, error: 'Gagal menyimpan data pribadi' }
    }

    // Also update profiles table full_name
    await supabase
      .from('profiles')
      .update({ full_name: data.full_name })
      .eq('id', user.id)

    revalidatePath('/onboarding/candidate')
    return { success: true, message: 'Data pribadi berhasil disimpan' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

export async function saveCandidateEducation(
  data: CandidateEducationInput
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('candidate_profiles')
      .update({
        education_level: data.education_level,
        institution: data.institution,
        major: data.major,
        graduation_year: data.graduation_year,
        gpa: data.gpa,
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error saving education:', error)
      return { success: false, error: 'Gagal menyimpan data pendidikan' }
    }

    revalidatePath('/onboarding/candidate')
    return { success: true, message: 'Data pendidikan berhasil disimpan' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

export async function saveCandidateSkills(
  data: CandidateSkillsInput
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Save skills to candidate_profiles
    const { error: skillsError } = await supabase
      .from('candidate_profiles')
      .update({
        skills: data.skills,
      })
      .eq('user_id', user.id)

    if (skillsError) {
      console.error('Error saving skills:', skillsError)
      return { success: false, error: 'Gagal menyimpan skills' }
    }

    // Save experiences to candidate_experiences
    if (data.experiences && data.experiences.length > 0) {
      // Delete existing experiences first
      await supabase
        .from('candidate_experiences')
        .delete()
        .eq('candidate_id', user.id)

      // Insert new experiences
      const experiencesData = data.experiences.map((exp) => ({
        candidate_id: user.id,
        company_name: exp.company_name,
        position: exp.position,
        start_date: exp.start_date,
        end_date: exp.end_date,
        is_current: exp.is_current,
        description: exp.description,
      }))

      const { error: experiencesError } = await supabase
        .from('candidate_experiences')
        .insert(experiencesData)

      if (experiencesError) {
        console.error('Error saving experiences:', experiencesError)
        return { success: false, error: 'Gagal menyimpan pengalaman kerja' }
      }
    }

    revalidatePath('/onboarding/candidate')
    return {
      success: true,
      message: 'Skills dan pengalaman berhasil disimpan',
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

export async function saveCandidateDocuments(
  data: CandidateDocumentsInput
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('candidate_profiles')
      .update({
        ktp_url: data.ktp_url,
        diploma_url: data.diploma_url,
        certificate_urls: data.certificate_urls,
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error saving documents:', error)
      return { success: false, error: 'Gagal menyimpan dokumen' }
    }

    revalidatePath('/onboarding/candidate')
    return { success: true, message: 'Dokumen berhasil disimpan' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

export async function completeCandidateOnboarding(): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Mark onboarding as completed
    const { error } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', user.id)

    if (error) {
      console.error('Error completing onboarding:', error)
      return { success: false, error: 'Gagal menyelesaikan onboarding' }
    }

    revalidatePath('/dashboard')
    return {
      success: true,
      message: 'Onboarding berhasil diselesaikan',
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Get Candidate's Own Applications (for candidate dashboard)
export async function getCandidateApplications(): Promise<
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

    // Get applications with job and employer data
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
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
      `)
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

export async function getCandidateProfile(): Promise<
  ActionResponse<{
    profile: any
    experiences: any[]
  }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get candidate profile
    const { data: profile, error: profileError } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError)
      return { success: false, error: 'Gagal mengambil data profil' }
    }

    // Get candidate experiences
    const { data: experiences, error: experiencesError } = await supabase
      .from('candidate_experiences')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })

    if (experiencesError) {
      console.error('Error fetching experiences:', experiencesError)
    }

    return {
      success: true,
      data: {
        profile: profile || null,
        experiences: experiences || [],
      },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// ==================== EMPLOYER ACTIONS ====================

// Get All Candidates (for employer to view)
export async function getAllCandidates(): Promise<
  ActionResponse<{ candidates: any[] }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get all profiles with role candidate and their candidate_profiles data
    const { data: candidates, error } = await supabase
      .from('profiles')
      .select(`
        *,
        candidate_profiles (*)
      `)
      .eq('role', 'candidate')
      .eq('onboarding_completed', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching candidates:', error)
      return { success: false, error: 'Gagal mengambil data kandidat' }
    }

    return {
      success: true,
      data: { candidates: candidates || [] },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Get Candidate Detail (for employer)
export async function getCandidateDetail(
  candidateId: string
): Promise<
  ActionResponse<{ profile: any; candidateProfile: any; experiences: any[] }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', candidateId)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return { success: false, error: 'Gagal mengambil data profil' }
    }

    // Get candidate profile
    const { data: candidateProfile, error: candidateError } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('user_id', candidateId)
      .single()

    if (candidateError && candidateError.code !== 'PGRST116') {
      console.error('Error fetching candidate profile:', candidateError)
    }

    // Get experiences
    const { data: experiences, error: expError } = await supabase
      .from('candidate_experiences')
      .select('*')
      .eq('user_id', candidateId)
      .order('start_date', { ascending: false })

    if (expError && expError.code !== 'PGRST116') {
      console.error('Error fetching experiences:', expError)
    }

    return {
      success: true,
      data: {
        profile: profile || null,
        candidateProfile: candidateProfile || null,
        experiences: experiences || [],
      },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Get Applications for a specific job
export async function getJobApplications(
  jobId: string
): Promise<ActionResponse<{ applications: any[] }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get applications with candidate data
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        profiles!applications_user_id_fkey (
          id,
          full_name,
          phone,
          city,
          province,
          avatar_url
        )
      `)
      .eq('job_id', jobId)
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

// Update Application Status
export async function updateApplicationStatus(
  applicationId: string,
  status: 'submitted' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected',
  notes?: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('applications')
      .update({
        status,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)

    if (error) {
      console.error('Error updating application status:', error)
      return { success: false, error: 'Gagal memperbarui status aplikasi' }
    }

    revalidatePath('/dashboard/employer')
    return { success: true, message: 'Status berhasil diperbarui' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Schedule Interview
export async function scheduleInterview(
  applicationId: string,
  interviewDate: string,
  interviewLocation: string,
  interviewNotes?: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('applications')
      .update({
        status: 'interview',
        interview_at: interviewDate,
        interview_location: interviewLocation,
        interview_notes: interviewNotes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)

    if (error) {
      console.error('Error scheduling interview:', error)
      return { success: false, error: 'Gagal menjadwalkan interview' }
    }

    revalidatePath('/dashboard/employer')
    return { success: true, message: 'Interview berhasil dijadwalkan' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Accept Application (Make Offer)
export async function acceptApplication(
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

    const { error } = await supabase
      .from('applications')
      .update({
        status: 'offer',
        offer_sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)

    if (error) {
      console.error('Error accepting application:', error)
      return { success: false, error: 'Gagal menerima aplikasi' }
    }

    revalidatePath('/dashboard/employer')
    return { success: true, message: 'Kandidat berhasil diterima' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Reject Application
export async function rejectApplication(
  applicationId: string,
  reason?: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('applications')
      .update({
        status: 'rejected',
        notes: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)

    if (error) {
      console.error('Error rejecting application:', error)
      return { success: false, error: 'Gagal menolak aplikasi' }
    }

    revalidatePath('/dashboard/employer')
    return { success: true, message: 'Aplikasi berhasil ditolak' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}
