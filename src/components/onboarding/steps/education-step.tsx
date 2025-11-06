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
import { toast } from 'sonner'
import { saveCandidateEducation } from '@/actions/candidate.actions'
import {
  candidateEducationSchema,
  type CandidateEducationInput,
} from '@/lib/validations/candidate'

interface EducationStepProps {
  onComplete: () => void
  profileData: any
}

const EDUCATION_LEVELS = [
  { value: 'smp', label: 'SMP / Sederajat' },
  { value: 'sma', label: 'SMA / Sederajat' },
  { value: 'smk', label: 'SMK' },
  { value: 'd1', label: 'D1' },
  { value: 'd2', label: 'D2' },
  { value: 'd3', label: 'D3' },
  { value: 'd4', label: 'D4' },
  { value: 's1', label: 'S1' },
  { value: 's2', label: 'S2' },
  { value: 's3', label: 'S3' },
]

export function EducationStep({ onComplete, profileData }: EducationStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CandidateEducationInput>({
    resolver: zodResolver(candidateEducationSchema),
    defaultValues: {
      education_level: profileData?.profile?.education_level || undefined,
      institution: profileData?.profile?.institution || '',
      major: profileData?.profile?.major || '',
      graduation_year: profileData?.profile?.graduation_year || new Date().getFullYear(),
      gpa: profileData?.profile?.gpa || null,
    },
  })

  const educationLevel = watch('education_level')

  const onSubmit = async (data: CandidateEducationInput) => {
    setIsLoading(true)

    try {
      const result = await saveCandidateEducation(data)

      if (result.success) {
        toast.success('Data pendidikan berhasil disimpan')
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
        <h2 className="text-2xl font-semibold">Pendidikan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Isi data pendidikan terakhir Anda
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="education_level">
            Jenjang Pendidikan <span className="text-destructive">*</span>
          </Label>
          <Select
            value={educationLevel}
            onValueChange={(value) =>
              setValue('education_level', value as any, {
                shouldValidate: true,
              })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenjang pendidikan" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.education_level && (
            <p className="text-sm text-destructive">
              {errors.education_level.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution">
            Nama Institusi <span className="text-destructive">*</span>
          </Label>
          <Input
            id="institution"
            type="text"
            placeholder="Nama sekolah/universitas"
            disabled={isLoading}
            {...register('institution')}
          />
          {errors.institution && (
            <p className="text-sm text-destructive">
              {errors.institution.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="major">
            Jurusan <span className="text-destructive">*</span>
          </Label>
          <Input
            id="major"
            type="text"
            placeholder="Nama jurusan/program studi"
            disabled={isLoading}
            {...register('major')}
          />
          {errors.major && (
            <p className="text-sm text-destructive">{errors.major.message}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="graduation_year">
              Tahun Lulus <span className="text-destructive">*</span>
            </Label>
            <Input
              id="graduation_year"
              type="number"
              placeholder="2024"
              min={1950}
              max={new Date().getFullYear() + 5}
              disabled={isLoading}
              {...register('graduation_year', { valueAsNumber: true })}
            />
            {errors.graduation_year && (
              <p className="text-sm text-destructive">
                {errors.graduation_year.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpa">IPK / Nilai Rata-rata</Label>
            <Input
              id="gpa"
              type="number"
              step="0.01"
              placeholder="3.50"
              min={0}
              max={4}
              disabled={isLoading}
              {...register('gpa', {
                valueAsNumber: true,
                setValueAs: (v) => (v === '' ? null : parseFloat(v)),
              })}
            />
            {errors.gpa && (
              <p className="text-sm text-destructive">{errors.gpa.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Opsional. Skala 0.00 - 4.00
            </p>
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
