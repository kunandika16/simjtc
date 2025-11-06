'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { saveEmployerLegalInfo } from '@/actions/employer.actions'

const schema = z.object({
  nib: z.string().optional(),
  npwp: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface EmployerLegalInfoStepProps {
  onComplete: () => void
  employerData: any
}

export function EmployerLegalInfoStep({
  onComplete,
  employerData,
}: EmployerLegalInfoStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nib: employerData?.employer?.nib || '',
      npwp: employerData?.employer?.npwp || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const result = await saveEmployerLegalInfo(data)

      if (result.success) {
        toast.success('Data legal berhasil disimpan')
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
        <h2 className="text-2xl font-semibold">Data Legal Perusahaan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Informasi legal dan perizinan perusahaan
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nib">NIB (Nomor Induk Berusaha)</Label>
          <Input
            id="nib"
            type="text"
            placeholder="13 digit NIB"
            maxLength={13}
            disabled={isLoading}
            {...register('nib')}
          />
          <p className="text-xs text-muted-foreground">
            Opsional. NIB dari OSS (Online Single Submission)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="npwp">NPWP (Nomor Pokok Wajib Pajak)</Label>
          <Input
            id="npwp"
            type="text"
            placeholder="15 digit NPWP"
            maxLength={15}
            disabled={isLoading}
            {...register('npwp')}
          />
          <p className="text-xs text-muted-foreground">
            Opsional. NPWP perusahaan
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Catatan:</strong> Data legal ini bersifat opsional pada tahap
          onboarding. Anda bisa melengkapinya nanti dari dashboard untuk
          meningkatkan kredibilitas perusahaan.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan & Lanjut'}
        </Button>
      </div>
    </form>
  )
}
