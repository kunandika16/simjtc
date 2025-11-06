'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { saveEmployerCompanyInfo } from '@/actions/employer.actions'

const schema = z.object({
  company_name: z.string().min(3, 'Nama perusahaan minimal 3 karakter'),
  industry: z.string().optional(),
  website: z.string().url('URL tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().default('Jawa Barat'),
})

type FormData = z.infer<typeof schema>

interface EmployerCompanyInfoStepProps {
  onComplete: () => void
  employerData: any
}

export function EmployerCompanyInfoStep({
  onComplete,
  employerData,
}: EmployerCompanyInfoStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      company_name: employerData?.employer?.company_name || '',
      industry: employerData?.employer?.industry || '',
      website: employerData?.employer?.website || '',
      address: employerData?.employer?.address || '',
      city: employerData?.employer?.city || '',
      province: employerData?.employer?.province || 'Jawa Barat',
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const result = await saveEmployerCompanyInfo(data)

      if (result.success) {
        toast.success('Data perusahaan berhasil disimpan')
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
        <h2 className="text-2xl font-semibold">Informasi Perusahaan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Lengkapi data perusahaan Anda
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">
            Nama Perusahaan <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company_name"
            type="text"
            placeholder="PT. Contoh Perusahaan"
            disabled={isLoading}
            {...register('company_name')}
          />
          {errors.company_name && (
            <p className="text-sm text-destructive">
              {errors.company_name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industri</Label>
          <Input
            id="industry"
            type="text"
            placeholder="Contoh: Manufacturing, IT, Hospitality"
            disabled={isLoading}
            {...register('industry')}
          />
          <p className="text-xs text-muted-foreground">Opsional</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website Perusahaan</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://perusahaan.com"
            disabled={isLoading}
            {...register('website')}
          />
          {errors.website && (
            <p className="text-sm text-destructive">{errors.website.message}</p>
          )}
          <p className="text-xs text-muted-foreground">Opsional</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Alamat Perusahaan</Label>
          <Textarea
            id="address"
            placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
            rows={3}
            disabled={isLoading}
            {...register('address')}
          />
          <p className="text-xs text-muted-foreground">Opsional</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">Kota/Kabupaten</Label>
            <Input
              id="city"
              type="text"
              placeholder="Contoh: Bandung"
              disabled={isLoading}
              {...register('city')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Provinsi</Label>
            <Input
              id="province"
              type="text"
              value="Jawa Barat"
              disabled
              {...register('province')}
            />
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
