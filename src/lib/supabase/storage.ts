import { createClient } from '@/lib/supabase/client'

/**
 * Upload file to Supabase storage bucket
 * @param file - File to upload
 * @param bucket - Storage bucket name (avatars, documents, cvs, etc.)
 * @param folder - Folder path within bucket (usually user ID)
 * @param fileName - Optional custom file name
 * @returns URL path (not full URL) of uploaded file or null on error
 */
export async function uploadFile(
  file: File,
  bucket: string,
  folder: string,
  fileName?: string
): Promise<{ path: string | null; error: string | null }> {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { path: null, error: 'User not authenticated' }
    }

    // Generate unique file name if not provided
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const uploadFileName = fileName || `${timestamp}.${fileExt}`
    const filePath = `${folder}/${uploadFileName}`

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Replace if exists
      })

    if (error) {
      console.error('Upload error:', error)
      return { path: null, error: error.message }
    }

    // Return the file path (will be converted to proper URL later)
    return { path: filePath, error: null }
  } catch (error) {
    console.error('Upload exception:', error)
    return { path: null, error: 'Failed to upload file' }
  }
}

/**
 * Get URL for a file in storage bucket
 * For public buckets: returns public URL
 * For private buckets: returns signed URL (valid for 1 hour)
 * @param bucket - Storage bucket name
 * @param filePath - File path within bucket
 */
export async function getFileUrl(
  bucket: string,
  filePath: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    // Public buckets: avatars, certificates, company-logos, institution-photos
    const publicBuckets = ['avatars', 'certificates', 'company-logos', 'institution-photos']

    if (publicBuckets.includes(bucket)) {
      // Return public URL
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`
      return { url: publicUrl, error: null }
    } else {
      // Private buckets: documents, cvs - need signed URL
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600) // Valid for 1 hour

      if (error) {
        console.error('Error creating signed URL:', error)
        return { url: null, error: error.message }
      }

      return { url: data.signedUrl, error: null }
    }
  } catch (error) {
    console.error('Get file URL exception:', error)
    return { url: null, error: 'Failed to get file URL' }
  }
}

/**
 * Delete file from Supabase storage bucket
 * @param bucket - Storage bucket name
 * @param filePath - Full file path including folder
 */
export async function deleteFile(
  bucket: string,
  filePath: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Delete exception:', error)
    return { success: false, error: 'Failed to delete file' }
  }
}

/**
 * Upload profile photo (avatar) to avatars bucket
 * @param file - Image file to upload
 * @param userId - User ID for folder organization
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<{ url: string | null; error: string | null }> {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return {
      url: null,
      error: 'Format file tidak valid. Gunakan JPG, PNG, atau WebP',
    }
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return { url: null, error: 'Ukuran file maksimal 5MB' }
  }

  // Upload file and get path - DON'T provide fileName to use timestamp
  const uploadResult = await uploadFile(file, 'avatars', userId)

  if (uploadResult.error || !uploadResult.path) {
    return { url: null, error: uploadResult.error }
  }

  // Get public URL for avatars bucket with cache-busting timestamp
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const timestamp = Date.now()
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${uploadResult.path}?t=${timestamp}`
  return { url: publicUrl, error: null }
}

/**
 * Upload document to documents bucket
 * @param file - Document file to upload
 * @param userId - User ID for folder organization
 * @param docType - Document type (cv, ktp, diploma, certificate)
 */
export async function uploadDocument(
  file: File,
  userId: string,
  docType: string
): Promise<{ url: string | null; error: string | null }> {
  // Validate file type
  const validTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]
  if (!validTypes.includes(file.type)) {
    return {
      url: null,
      error: 'Format file tidak valid. Gunakan PDF, JPG, PNG, atau WebP',
    }
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    return { url: null, error: 'Ukuran file maksimal 10MB' }
  }

  const bucket = docType === 'cv' ? 'cvs' : 'documents'
  const uploadResult = await uploadFile(file, bucket, userId, docType)

  if (uploadResult.error || !uploadResult.path) {
    return { url: null, error: uploadResult.error }
  }

  // Return public URL (now all buckets are public for easier access)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${uploadResult.path}`
  return { url: publicUrl, error: null }
}

/**
 * Get file path from full URL
 * @param url - Full Supabase storage URL
 * @param bucket - Storage bucket name
 */
export function getFilePathFromUrl(url: string, bucket: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split(`/${bucket}/`)
    return pathParts[1] || null
  } catch {
    return null
  }
}
