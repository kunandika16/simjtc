'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { toast } from 'sonner'
import { uploadFile } from '@/actions/upload.actions'
import { saveCandidateDocuments } from '@/actions/candidate.actions'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DocumentsStepProps {
  onComplete: () => void
  profileData: any
}

export function DocumentsStep({ onComplete, profileData }: DocumentsStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [ktpUrl, setKtpUrl] = useState<string | null>(
    profileData?.profile?.ktp_url || null
  )
  const [diplomaUrl, setDiplomaUrl] = useState<string | null>(
    profileData?.profile?.diploma_url || null
  )
  const [certificateUrls, setCertificateUrls] = useState<string[]>(
    profileData?.profile?.certificate_urls || []
  )

  const handleKtpUpload = async (formData: FormData) => {
    const result = await uploadFile(formData, 'documents', 'ktp')
    if (result.success && result.data) {
      setKtpUrl(result.data.url)
      return result.data.url
    }
    throw new Error(result.error)
  }

  const handleDiplomaUpload = async (formData: FormData) => {
    const result = await uploadFile(formData, 'documents', 'diploma')
    if (result.success && result.data) {
      setDiplomaUrl(result.data.url)
      return result.data.url
    }
    throw new Error(result.error)
  }

  const handleCertificateUpload = async (formData: FormData) => {
    const result = await uploadFile(formData, 'documents', 'certificates')
    if (result.success && result.data) {
      setCertificateUrls((prev) => [...prev, result.data!.url])
      return result.data.url
    }
    throw new Error(result.error)
  }

  const removeCertificate = (index: number) => {
    setCertificateUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const result = await saveCandidateDocuments({
        ktp_url: ktpUrl,
        diploma_url: diplomaUrl,
        certificate_urls: certificateUrls,
      })

      if (result.success) {
        toast.success('Dokumen berhasil disimpan')
        onComplete()
      } else {
        toast.error(result.error || 'Gagal menyimpan dokumen')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Dokumen</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload dokumen pendukung Anda
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Pastikan dokumen yang diupload jelas dan dapat dibaca. Format yang
          diterima: JPG, PNG, atau PDF dengan ukuran maksimal 5MB per file.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <FileUpload
          label="KTP / Identitas"
          accept="image/*,application/pdf"
          maxSize={5}
          currentFile={ktpUrl}
          onUpload={handleKtpUpload}
          onRemove={() => setKtpUrl(null)}
          disabled={isLoading}
        />

        <FileUpload
          label="Ijazah Terakhir"
          accept="image/*,application/pdf"
          maxSize={5}
          currentFile={diplomaUrl}
          onUpload={handleDiplomaUpload}
          onRemove={() => setDiplomaUrl(null)}
          disabled={isLoading}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Sertifikat (Opsional)
          </label>
          <p className="text-xs text-muted-foreground">
            Upload sertifikat pelatihan atau kursus yang pernah Anda ikuti
          </p>

          {certificateUrls.map((url, index) => (
            <FileUpload
              key={index}
              label={`Sertifikat ${index + 1}`}
              accept="image/*,application/pdf"
              maxSize={5}
              currentFile={url}
              onUpload={async (formData) => url}
              onRemove={() => removeCertificate(index)}
              disabled={isLoading}
            />
          ))}

          {certificateUrls.length < 5 && (
            <FileUpload
              label={`Sertifikat ${certificateUrls.length + 1}`}
              accept="image/*,application/pdf"
              maxSize={5}
              onUpload={handleCertificateUpload}
              disabled={isLoading}
            />
          )}

          {certificateUrls.length >= 5 && (
            <p className="text-xs text-muted-foreground">
              Maksimal 5 sertifikat dapat diupload
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan & Lanjut'}
        </Button>
      </div>
    </div>
  )
}
