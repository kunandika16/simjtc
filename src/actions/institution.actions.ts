'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResponse } from '@/types/database.types'

// Institution Basic Info
export async function saveInstitutionBasicInfo(data: {
  name: string
  type: 'blk_pemerintah' | 'blk_pesantren' | 'lpk'
  nib?: string
  address: string
  city: string
  province: string
  latitude?: number
  longitude?: number
}): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if institution exists
    const { data: existingInstitution } = await supabase
      .from('institutions')
      .select('id')
      .eq('user_id', user.id)
      .single()

    let error

    if (existingInstitution) {
      // Update existing
      const result = await supabase
        .from('institutions')
        .update({
          name: data.name,
          type: data.type,
          nib: data.nib || null,
          address: data.address,
          city: data.city,
          province: data.province || 'Jawa Barat',
          latitude: data.latitude || null,
          longitude: data.longitude || null,
        })
        .eq('user_id', user.id)
      error = result.error
    } else {
      // Insert new - need required fields
      const result = await supabase.from('institutions').insert({
        user_id: user.id,
        name: data.name,
        type: data.type,
        nib: data.nib || null,
        address: data.address,
        city: data.city,
        province: data.province || 'Jawa Barat',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        // Required fields from schema
        email: '', // Will be filled in next step
        phone: '', // Will be filled in next step
        pic_name: '', // Will be filled in next step
        pic_phone: '', // Will be filled in next step
        pic_email: '', // Will be filled in next step
      })
      error = result.error
    }

    if (error) {
      console.error('Error saving institution basic info:', error)
      return { success: false, error: error.message || 'Gagal menyimpan data institusi' }
    }

    // Update profile name
    await supabase
      .from('profiles')
      .update({ full_name: data.name })
      .eq('id', user.id)

    revalidatePath('/onboarding/institution')
    return { success: true, message: 'Data institusi berhasil disimpan' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Institution Contact & PIC
export async function saveInstitutionContact(data: {
  email: string
  phone: string
  pic_name: string
  pic_position?: string
  pic_phone: string
  pic_email: string
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
      .from('institutions')
      .update({
        email: data.email,
        phone: data.phone,
        pic_name: data.pic_name,
        pic_position: data.pic_position,
        pic_phone: data.pic_phone,
        pic_email: data.pic_email,
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error saving institution contact:', error)
      return { success: false, error: 'Gagal menyimpan data kontak' }
    }

    revalidatePath('/onboarding/institution')
    return { success: true, message: 'Data kontak berhasil disimpan' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Institution Capacity & Facilities
export async function saveInstitutionCapacity(data: {
  capacity_per_month?: number
  facilities?: string[]
  specialties?: string[]
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
      .from('institutions')
      .update({
        capacity_per_month: data.capacity_per_month,
        facilities: data.facilities || [],
        specialties: data.specialties || [],
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error saving institution capacity:', error)
      return { success: false, error: 'Gagal menyimpan data kapasitas' }
    }

    revalidatePath('/onboarding/institution')
    return { success: true, message: 'Data kapasitas berhasil disimpan' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Institution Programs & Certifications
export async function saveInstitutionPrograms(data: {
  certifications?: string[]
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
      .from('institutions')
      .update({
        certifications: data.certifications || [],
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error saving institution programs:', error)
      return { success: false, error: 'Gagal menyimpan data program' }
    }

    revalidatePath('/onboarding/institution')
    return { success: true, message: 'Data program berhasil disimpan' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

// Complete Institution Onboarding
export async function completeInstitutionOnboarding(): Promise<ActionResponse> {
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

// Get Institution Profile
export async function getInstitutionProfile(): Promise<
  ActionResponse<{ institution: any }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: institution, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching institution:', error)
      return { success: false, error: 'Gagal mengambil data institusi' }
    }

    return {
      success: true,
      data: {
        institution: institution || null,
      },
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}
