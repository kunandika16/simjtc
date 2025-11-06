'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { saveEmployerPIC } from '@/actions/employer.actions'

const schema = z.object({
  pic_name: z.string().min(3, 'Nama PIC minimal 3 karakter'),
  pic_email: z.string().email('Email tidak valid'),
  pic_phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid'),
  pic_position: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface EmployerPICStepProps {
  onComplete: () => void
  employerData: any
}

export function EmployerPICStep({
  onComplete,
  employerData,
}: EmployerPICStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      pic_name: employerData?.employer?.pic_name || '',
      pic_email: employerData?.employer?.pic_email || '',
      pic_phone: employerData?.employer?.pic_phone || '',
      pic_position: employerData?.employer?.pic_position || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const result = await saveEmployerPIC(data)

      if (result.success) {
        toast.success('Data PIC berhasil disimpan')
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
        <h2 className="text-2xl font-semibold">Person In Charge (PIC)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Informasi penanggung jawab rekrutmen dari perusahaan
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pic_name">
            Nama PIC <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pic_name"
            type="text"
            placeholder="Nama lengkap penanggung jawab"
            disabled={isLoading}
            {...register('pic_name')}
          />
          {errors.pic_name && (
            <p className="text-sm text-destructive">
              {errors.pic_name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pic_position">Jabatan PIC</Label>
          <Input
            id="pic_position"
            type="text"
            placeholder="Contoh: HR Manager, Recruitment Lead"
            disabled={isLoading}
            {...register('pic_position')}
          />
          <p className="text-xs text-muted-foreground">Opsional</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pic_email">
            Email PIC <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pic_email"
            type="email"
            placeholder="email@perusahaan.com"
            disabled={isLoading}
            {...register('pic_email')}
          />
          {errors.pic_email && (
            <p className="text-sm text-destructive">
              {errors.pic_email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pic_phone">
            Telepon PIC <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pic_phone"
            type="tel"
            placeholder="08xxxxxxxxxx"
            disabled={isLoading}
            {...register('pic_phone')}
          />
          {errors.pic_phone && (
            <p className="text-sm text-destructive">
              {errors.pic_phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Informasi PIC ini akan digunakan untuk:</strong>
        </p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>• Komunikasi terkait lowongan pekerjaan</li>
          <li>• Notifikasi aplikasi kandidat</li>
          <li>• Koordinasi proses rekrutmen</li>
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
