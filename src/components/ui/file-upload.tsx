'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, FileIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadProps {
  label: string
  accept?: string
  maxSize?: number // in MB
  currentFile?: string | null
  onUpload: (formData: FormData) => Promise<string>
  onRemove?: () => void
  disabled?: boolean
  required?: boolean
}

export function FileUpload({
  label,
  accept = 'image/*,application/pdf',
  maxSize = 5,
  currentFile,
  onUpload,
  onRemove,
  disabled = false,
  required = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(
    currentFile || null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Ukuran file maksimal ${maxSize}MB`)
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const url = await onUpload(formData)
      setUploadedUrl(url)
      toast.success('File berhasil diupload')
    } catch (error) {
      toast.error('Gagal mengupload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setUploadedUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemove?.()
  }

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'file'
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>

      {uploadedUrl ? (
        <div className="flex items-center gap-2 rounded-md border p-3">
          <FileIcon className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">{getFileName(uploadedUrl)}</p>
            <p className="text-xs text-muted-foreground">File berhasil diupload</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="hidden"
            id={`file-upload-${label}`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Pilih File
              </>
            )}
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Format: {accept.includes('image') && 'JPG, PNG, '}
        {accept.includes('pdf') && 'PDF'}. Maksimal {maxSize}MB
      </p>
    </div>
  )
}
