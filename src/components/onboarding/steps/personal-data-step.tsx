'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { saveCandidatePersonalData } from '@/actions/candidate.actions'
import {
  candidatePersonalDataSchema,
  type CandidatePersonalDataInput,
} from '@/lib/validations/candidate'

interface PersonalDataStepProps {
  onComplete: () => void
  profileData: any
}

export function PersonalDataStep({
  onComplete,
  profileData,
}: PersonalDataStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CandidatePersonalDataInput>({
    resolver: zodResolver(candidatePersonalDataSchema),
    defaultValues: {
      nik: profileData?.profile?.nik || '',
      full_name: profileData?.profile?.full_name || '',
      birth_place: profileData?.profile?.birth_place || '',
      birth_date: profileData?.profile?.birth_date || '',
      gender: profileData?.profile?.gender || undefined,
      address: profileData?.profile?.address || '',
      phone: profileData?.profile?.phone || '',
    },
  })

  const gender = watch('gender')

  const onSubmit = async (data: CandidatePersonalDataInput) => {
    setIsLoading(true)

    try {
      const result = await saveCandidatePersonalData(data)

      if (result.success) {
        toast.success('Data pribadi berhasil disimpan')
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
        <h2 className="text-2xl font-semibold">Data Pribadi</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Lengkapi data pribadi Anda sesuai dengan KTP
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nik">
            NIK <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nik"
            type="text"
            placeholder="16 digit NIK"
            maxLength={16}
            disabled={isLoading}
            {...register('nik')}
          />
          {errors.nik && (
            <p className="text-sm text-destructive">{errors.nik.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name">
            Nama Lengkap <span className="text-destructive">*</span>
          </Label>
          <Input
            id="full_name"
            type="text"
            placeholder="Nama lengkap sesuai KTP"
            disabled={isLoading}
            {...register('full_name')}
          />
          {errors.full_name && (
            <p className="text-sm text-destructive">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="birth_place">
              Tempat Lahir <span className="text-destructive">*</span>
            </Label>
            <Input
              id="birth_place"
              type="text"
              placeholder="Kota/Kabupaten"
              disabled={isLoading}
              {...register('birth_place')}
            />
            {errors.birth_place && (
              <p className="text-sm text-destructive">
                {errors.birth_place.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_date">
              Tanggal Lahir <span className="text-destructive">*</span>
            </Label>
            <Input
              id="birth_date"
              type="date"
              disabled={isLoading}
              {...register('birth_date')}
            />
            {errors.birth_date && (
              <p className="text-sm text-destructive">
                {errors.birth_date.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">
            Jenis Kelamin <span className="text-destructive">*</span>
          </Label>
          <Select
            value={gender}
            onValueChange={(value) =>
              setValue('gender', value as 'male' | 'female', {
                shouldValidate: true,
              })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Laki-laki</SelectItem>
              <SelectItem value="female">Perempuan</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            Alamat Lengkap <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="address"
            placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Provinsi"
            rows={3}
            disabled={isLoading}
            {...register('address')}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Nomor Telepon <span className="text-destructive">*</span>
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
          <p className="text-xs text-muted-foreground">
            Format: 08xxxxxxxxxx atau +62xxxxxxxxxx
          </p>
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
