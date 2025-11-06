'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { saveInstitutionContact } from '@/actions/institution.actions'

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid'),
  pic_name: z.string().min(3, 'Nama PIC minimal 3 karakter'),
  pic_position: z.string().optional(),
  pic_phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid'),
  pic_email: z.string().email('Email tidak valid'),
})

type FormData = z.infer<typeof schema>

interface InstitutionContactStepProps {
  onComplete: () => void
  institutionData: any
}

export function InstitutionContactStep({
  onComplete,
  institutionData,
}: InstitutionContactStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: institutionData?.institution?.email || '',
      phone: institutionData?.institution?.phone || '',
      pic_name: institutionData?.institution?.pic_name || '',
      pic_position: institutionData?.institution?.pic_position || '',
      pic_phone: institutionData?.institution?.pic_phone || '',
      pic_email: institutionData?.institution?.pic_email || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const result = await saveInstitutionContact(data)

      if (result.success) {
        toast.success('Data kontak berhasil disimpan')
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
        <h2 className="text-2xl font-semibold">Kontak & Person In Charge</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Informasi kontak institusi dan penanggung jawab
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">Kontak Institusi</h3>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email Institusi <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="info@institusi.com"
              disabled={isLoading}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Telepon Institusi <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              disabled={isLoading}
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">Person In Charge (PIC)</h3>

          <div className="space-y-2">
            <Label htmlFor="pic_name">
              Nama PIC <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pic_name"
              type="text"
              placeholder="Nama lengkap PIC"
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
              placeholder="Contoh: Kepala BLK"
              disabled={isLoading}
              {...register('pic_position')}
            />
            <p className="text-xs text-muted-foreground">Opsional</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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

            <div className="space-y-2">
              <Label htmlFor="pic_email">
                Email PIC <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pic_email"
                type="email"
                placeholder="pic@institusi.com"
                disabled={isLoading}
                {...register('pic_email')}
              />
              {errors.pic_email && (
                <p className="text-sm text-destructive">
                  {errors.pic_email.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan & Lanjut'}
        </Button>
      </div>
    </form>
  )
}
