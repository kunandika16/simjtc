'use server'

import { createClient } from '@/lib/supabase/server'
import type { ActionResponse } from '@/types/database.types'

export async function uploadFile(
  formData: FormData,
  bucket: string,
  path?: string
): Promise<ActionResponse<{ url: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const file = formData.get('file') as File
    if (!file) {
      return { success: false, error: 'File tidak ditemukan' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${path || 'default'}/${Date.now()}.${fileExt}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: 'Gagal mengupload file' }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return {
      success: true,
      data: { url: publicUrl },
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: 'Gagal menghapus file' }
    }

    return { success: true, message: 'File berhasil dihapus' }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: 'Terjadi kesalahan' }
  }
}
