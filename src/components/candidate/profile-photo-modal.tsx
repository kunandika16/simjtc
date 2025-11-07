'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Camera, Loader2, Upload, ZoomIn, ZoomOut } from 'lucide-react'
import Cropper from 'react-easy-crop'
import { Point, Area } from 'react-easy-crop/types'
import { uploadAvatar, deleteFile, getFilePathFromUrl } from '@/lib/supabase/storage'
import { updateAvatarUrl } from '@/actions/candidate.actions'

interface ProfilePhotoModalProps {
  userId: string
  currentPhotoUrl?: string | null
  onPhotoUpdated?: (newUrl: string) => void
}

export function ProfilePhotoModal({
  userId,
  currentPhotoUrl,
  onPhotoUpdated,
}: ProfilePhotoModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Cropper states
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Format file tidak valid. Gunakan JPG, PNG, atau WebP')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      setIsOpen(true)
      // Reset crop and zoom
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    }
    reader.readAsDataURL(file)

    // Reset input value so same file can be selected again
    e.target.value = ''
  }

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    // Set canvas size to the cropped area
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'))
          return
        }
        resolve(blob)
      }, 'image/jpeg', 0.95)
    })
  }

  const handleSaveCrop = async () => {
    if (!imagePreview || !croppedAreaPixels) {
      toast.error('Tidak ada gambar untuk disimpan')
      return
    }

    setIsLoading(true)

    try {
      // Delete old avatar if exists (to save storage space)
      if (currentPhotoUrl) {
        const oldFilePath = getFilePathFromUrl(currentPhotoUrl, 'avatars')
        if (oldFilePath) {
          // Delete old file (don't wait for it, just fire and forget)
          deleteFile('avatars', oldFilePath).catch(err =>
            console.warn('Failed to delete old avatar:', err)
          )
        }
      }

      // Get cropped image blob
      const croppedBlob = await getCroppedImg(imagePreview, croppedAreaPixels)

      // Convert blob to file
      const croppedFile = new File([croppedBlob], 'avatar.jpg', {
        type: 'image/jpeg',
      })

      // Upload to Supabase
      const uploadResult = await uploadAvatar(croppedFile, userId)

      if (uploadResult.url) {
        // Update database
        const updateResult = await updateAvatarUrl(uploadResult.url)

        if (updateResult.success) {
          toast.success('Foto profil berhasil diperbarui!')

          // Close modal
          setIsOpen(false)
          setImagePreview(null)

          // Callback to parent component
          if (onPhotoUpdated) {
            onPhotoUpdated(uploadResult.url)
          }

          // Refresh page to show new photo
          router.refresh()
        } else {
          toast.error(updateResult.error || 'Gagal menyimpan foto profil')
        }
      } else {
        toast.error(uploadResult.error || 'Gagal mengupload foto')
      }
    } catch (error) {
      console.error('Error saving photo:', error)
      toast.error('Terjadi kesalahan saat menyimpan foto')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setImagePreview(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  return (
    <>
      {/* Trigger Button - Hidden input */}
      <label htmlFor="profile-photo-input" className="cursor-pointer">
        <div className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
          <Camera className="h-4 w-4" />
        </div>
      </label>
      <input
        id="profile-photo-input"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Ganti Foto Profil
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden space-y-4">
            {/* Cropper Area */}
            <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: '400px' }}>
              {imagePreview && (
                <Cropper
                  image={imagePreview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              )}
            </div>

            {/* Zoom Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="zoom-slider" className="flex items-center gap-2">
                  <ZoomOut className="h-4 w-4" />
                  Zoom
                  <ZoomIn className="h-4 w-4" />
                </Label>
                <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
              </div>
              <Slider
                id="zoom-slider"
                min={1}
                max={3}
                step={0.1}
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                className="cursor-pointer"
              />
            </div>

            {/* Instructions */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <ul className="space-y-1 list-disc list-inside">
                <li>Drag gambar untuk mengatur posisi</li>
                <li>Gunakan slider untuk zoom in/out</li>
                <li>Foto akan otomatis di-crop menjadi lingkaran</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleSaveCrop}
              disabled={isLoading || !croppedAreaPixels}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Simpan Foto
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
