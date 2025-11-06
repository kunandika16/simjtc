'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { saveInstitutionBasicInfo } from '@/actions/institution.actions'

const schema = z.object({
  name: z.string().min(3, 'Nama institusi minimal 3 karakter'),
  type: z.enum(['blk_pemerintah', 'blk_pesantren', 'lpk'], {
    message: 'Pilih tipe institusi',
  }),
  nib: z.string().optional(),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  city: z.string().min(2, 'Kota/Kabupaten wajib diisi'),
  province: z.string().default('Jawa Barat'),
})

type FormData = z.infer<typeof schema>

interface InstitutionBasicInfoStepProps {
  onComplete: () => void
  institutionData: any
}

const INSTITUTION_TYPES = [
  { value: 'blk_pemerintah', label: 'BLK Pemerintah' },
  { value: 'blk_pesantren', label: 'BLK Pesantren' },
  { value: 'lpk', label: 'LPK (Lembaga Pelatihan Kerja)' },
]

export function InstitutionBasicInfoStep({
  onComplete,
  institutionData,
}: InstitutionBasicInfoStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: institutionData?.institution?.name || '',
      type: institutionData?.institution?.type || undefined,
      nib: institutionData?.institution?.nib || '',
      address: institutionData?.institution?.address || '',
      city: institutionData?.institution?.city || '',
      province: institutionData?.institution?.province || 'Jawa Barat',
    },
  })

  const type = watch('type')

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const result = await saveInstitutionBasicInfo(data)

      if (result.success) {
        toast.success('Data institusi berhasil disimpan')
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
        <h2 className="text-2xl font-semibold">Informasi Dasar Institusi</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Lengkapi data dasar lembaga pelatihan Anda
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nama Institusi <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Nama lembaga pelatihan"
            disabled={isLoading}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">
            Tipe Institusi <span className="text-destructive">*</span>
          </Label>
          <Select
            value={type}
            onValueChange={(value) =>
              setValue('type', value as any, { shouldValidate: true })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tipe institusi" />
            </SelectTrigger>
            <SelectContent>
              {INSTITUTION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>

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
          <p className="text-xs text-muted-foreground">Opsional</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            Alamat Lengkap <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="address"
            placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
            rows={3}
            disabled={isLoading}
            {...register('address')}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">
              Kota/Kabupaten <span className="text-destructive">*</span>
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="Contoh: Bandung"
              disabled={isLoading}
              {...register('city')}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">
              Provinsi <span className="text-destructive">*</span>
            </Label>
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
