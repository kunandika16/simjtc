'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { saveInstitutionPrograms } from '@/actions/institution.actions'

const schema = z.object({
  certifications: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof schema>

interface InstitutionProgramsStepProps {
  onComplete: () => void
  institutionData: any
}

const COMMON_CERTIFICATIONS = [
  'BNSP',
  'JLPT',
  'TOEFL',
  'Google Career Certificates',
  'Microsoft Certified',
  'AWS Certified',
  'Sertifikat Kemnaker',
]

export function InstitutionProgramsStep({
  onComplete,
  institutionData,
}: InstitutionProgramsStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [certInput, setCertInput] = useState('')

  const {
    handleSubmit,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      certifications: institutionData?.institution?.certifications || [],
    },
  })

  const certifications = watch('certifications')

  const addCertification = (cert: string) => {
    const currentCerts = certifications || []
    if (!currentCerts.includes(cert.trim())) {
      setValue('certifications', [...currentCerts, cert.trim()])
      setCertInput('')
    } else {
      toast.error('Sertifikasi sudah ditambahkan')
    }
  }

  const removeCertification = (index: number) => {
    const currentCerts = certifications || []
    setValue(
      'certifications',
      currentCerts.filter((_, i) => i !== index)
    )
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const result = await saveInstitutionPrograms(data)

      if (result.success) {
        toast.success('Data program berhasil disimpan')
        onComplete()
      } else {
        toast.error(result.error || 'Gagal menyimpan data')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Program & Sertifikasi</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Informasi sertifikasi yang dapat Anda berikan kepada peserta
        </p>
      </div>

      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          Data dasar institusi sudah lengkap! Pada langkah ini Anda bisa
          menambahkan sertifikasi yang ditawarkan (opsional). Anda juga bisa
          melewati langkah ini dan mengisinya nanti.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Sertifikasi yang Ditawarkan</Label>
          <p className="text-sm text-muted-foreground">
            Tambahkan sertifikasi yang akan diberikan kepada peserta yang lulus
            dari program pelatihan Anda
          </p>

          <div className="mb-2 flex flex-wrap gap-2">
            {COMMON_CERTIFICATIONS.map((cert) => (
              <Button
                key={cert}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addCertification(cert)}
                disabled={isLoading || certifications?.includes(cert)}
              >
                <Plus className="mr-1 h-3 w-3" />
                {cert}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Sertifikasi lainnya..."
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (certInput.trim()) addCertification(certInput)
                }
              }}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (certInput.trim()) addCertification(certInput)
              }}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {certifications && certifications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="ml-1 hover:text-destructive"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {(!certifications || certifications.length === 0) && (
            <p className="text-xs text-muted-foreground">
              Belum ada sertifikasi ditambahkan. Anda bisa menambahkannya nanti
              dari dashboard.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <h3 className="mb-2 font-medium">Langkah Selanjutnya</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Profil institusi Anda akan direview oleh admin</li>
          <li>• Setelah disetujui, Anda dapat membuat program pelatihan</li>
          <li>• Kandidat dapat mendaftar ke program yang Anda tawarkan</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan & Lanjut'}
        </Button>
      </div>
    </form>
  )
}
