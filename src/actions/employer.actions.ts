'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResponse } from '@/types/database.types'

// Employer Company Info
export async function saveEmployerCompanyInfo(data: {
  company_name: string
  industry?: string
  website?: string
  address?: string
  city?: string
  province: string
}): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if employer exists
    const { data: existingEmployer } = await supabase
      .from('employers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    let error

    if (existingEmployer) {
      // Update existing
      const result = await supabase
        .from('employers')
        .update({
          company_name: data.company_name,
          industry: data.industry || null,
          website: data.website || null,
          address: data.address || null,
          city: data.city || null,
          province: data.province || 'Jawa Barat',
        })
        .eq('user_id', user.id)
      error = result.error
    } else {
      // Insert new - need required fields
      const result = await supabase.from('employers').insert({
        user_id: user.id,
        company_name: data.company_name,
        industry: data.industry || null,
        website: data.website || null,
        address: data.address || null,
        city: data.city || null,
        province: data.province || 'Jawa Barat',
        // Required fields from schema
        pic_name: '', // Will be filled in next step
        pic_email: '', // Will be filled in next step
        pic_phone: '', // Will be filled in next step
      })
      error = result.error
    }

    if (error) {
      console.error('Error saving employer company info:', error)
      return { success: false, error: error.message || 'Gagal menyimpan data perusahaan' }
    }

    // Update profile name
    await supabase
      .from('profiles')
      .update({ full_name: data.company_name })
      .eq('id', user.id)

    revalidatePath('/onboarding/employer')
    return { success: true, message: 'Data perusahaan berhasil disimpan' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Employer Legal Info
export async function saveEmployerLegalInfo(data: {
  nib?: string
  npwp?: string
}): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('employers')
      .update({
        nib: data.nib,
        npwp: data.npwp,
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error saving employer legal info:', error)
      return { success: false, error: 'Gagal menyimpan data legal' }
    }

    revalidatePath('/onboarding/employer')
    return { success: true, message: 'Data legal berhasil disimpan' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Employer PIC Info
export async function saveEmployerPIC(data: {
  pic_name: string
  pic_email: string
  pic_phone: string
  pic_position?: string
}): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('employers')
      .update({
        pic_name: data.pic_name,
        pic_email: data.pic_email,
        pic_phone: data.pic_phone,
        pic_position: data.pic_position,
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error saving employer PIC:', error)
      return { success: false, error: 'Gagal menyimpan data PIC' }
    }

    revalidatePath('/onboarding/employer')
    return { success: true, message: 'Data PIC berhasil disimpan' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Employer Recruitment Preferences
export async function saveEmployerPreferences(data: {
  recruitment_location?: string[]
  notes?: string
}): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('employers')
      .update({
        recruitment_location: data.recruitment_location || [],
        notes: data.notes,
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error saving employer preferences:', error)
      return { success: false, error: 'Gagal menyimpan preferensi rekrutmen' }
    }

    revalidatePath('/onboarding/employer')
    return { success: true, message: 'Preferensi berhasil disimpan' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Complete Employer Onboarding
export async function completeEmployerOnboarding(): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

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

// Get Employer Profile
export async function getEmployerProfile(): Promise<
  ActionResponse<{ employer: any }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: employer, error } = await supabase
      .from('employers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching employer:', error)
      return { success: false, error: 'Gagal mengambil data perusahaan' }
    }

    return {
      success: true,
      data: {
        employer: employer || null,
      },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Update Full Employer Profile
export async function updateEmployerProfile(data: {
  company_name: string
  industry?: string
  website?: string
  address?: string
  city?: string
  province?: string
  nib?: string
  npwp?: string
  pic_name: string
  pic_email: string
  pic_phone: string
  pic_position?: string
  recruitment_location?: string[]
  notes?: string
}): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('employers')
      .update({
        company_name: data.company_name,
        industry: data.industry || null,
        website: data.website || null,
        address: data.address || null,
        city: data.city || null,
        province: data.province || null,
        nib: data.nib || null,
        npwp: data.npwp || null,
        pic_name: data.pic_name,
        pic_email: data.pic_email,
        pic_phone: data.pic_phone,
        pic_position: data.pic_position || null,
        recruitment_location: data.recruitment_location || [],
        notes: data.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating employer profile:', error)
      return { success: false, error: 'Gagal mengupdate profil perusahaan' }
    }

    // Also update company name in profiles table
    await supabase
      .from('profiles')
      .update({ full_name: data.company_name })
      .eq('id', user.id)

    revalidatePath('/dashboard/employer/profile')
    return { success: true, message: 'Profil perusahaan berhasil diperbarui' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Upload Company Logo
export async function uploadCompanyLogo(
  formData: FormData
): Promise<ActionResponse<{ url: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const file = formData.get('logo') as File
    if (!file) {
      return { success: false, error: 'File tidak ditemukan' }
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Tipe file tidak valid. Gunakan JPG, PNG, atau WebP' }
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: 'Ukuran file maksimal 2MB' }
    }

    // Delete old logo if exists
    const { data: employer } = await supabase
      .from('employers')
      .select('logo_url')
      .eq('user_id', user.id)
      .single()

    if (employer?.logo_url) {
      // Extract file path from URL
      const oldPath = employer.logo_url.split('/').pop()
      if (oldPath) {
        await supabase.storage
          .from('company-logos')
          .remove([`${user.id}/${oldPath}`])
      }
    }

    // Upload new logo
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading logo:', uploadError)
      return { success: false, error: 'Gagal mengupload logo' }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('company-logos').getPublicUrl(filePath)

    // Update employer record
    const { error: updateError } = await supabase
      .from('employers')
      .update({ logo_url: publicUrl })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating logo URL:', updateError)
      return { success: false, error: 'Gagal menyimpan URL logo' }
    }

    revalidatePath('/dashboard/employer/profile')
    return { success: true, message: 'Logo berhasil diupload', data: { url: publicUrl } }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Delete Company Logo
export async function deleteCompanyLogo(): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get current logo URL
    const { data: employer } = await supabase
      .from('employers')
      .select('logo_url')
      .eq('user_id', user.id)
      .single()

    if (!employer?.logo_url) {
      return { success: false, error: 'Tidak ada logo untuk dihapus' }
    }

    // Extract file path from URL
    const urlParts = employer.logo_url.split('company-logos/')
    if (urlParts.length < 2) {
      return { success: false, error: 'Format URL tidak valid' }
    }
    const filePath = urlParts[1]

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('company-logos')
      .remove([filePath])

    if (deleteError) {
      console.error('Error deleting logo:', deleteError)
      return { success: false, error: 'Gagal menghapus logo' }
    }

    // Update employer record
    const { error: updateError } = await supabase
      .from('employers')
      .update({ logo_url: null })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating logo URL:', updateError)
      return { success: false, error: 'Gagal mengupdate data' }
    }

    revalidatePath('/dashboard/employer/profile')
    return { success: true, message: 'Logo berhasil dihapus' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}
