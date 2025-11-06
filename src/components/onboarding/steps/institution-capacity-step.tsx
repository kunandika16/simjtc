'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { saveInstitutionCapacity } from '@/actions/institution.actions'

const schema = z.object({
  capacity_per_month: z.number().min(1).optional(),
  facilities: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof schema>

interface InstitutionCapacityStepProps {
  onComplete: () => void
  institutionData: any
}

const COMMON_FACILITIES = [
  'Ruang Kelas',
  'Lab Komputer',
  'Asrama',
  'Kantin',
  'Mushola',
  'Parkir',
  'WiFi',
]

const COMMON_SPECIALTIES = [
  'Bahasa Jepang',
  'Digital Marketing',
  'Programming',
  'Desain Grafis',
  'Accounting',
  'Hospitality',
  'Manufacturing',
]

export function InstitutionCapacityStep({
  onComplete,
  institutionData,
}: InstitutionCapacityStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [facilityInput, setFacilityInput] = useState('')
  const [specialtyInput, setSpecialtyInput] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      capacity_per_month: institutionData?.institution?.capacity_per_month || 0,
      facilities: institutionData?.institution?.facilities || [],
      specialties: institutionData?.institution?.specialties || [],
    },
  })

  const facilities = watch('facilities')
  const specialties = watch('specialties')

  const addFacility = (facility: string) => {
    const currentFacilities = facilities || []
    if (!currentFacilities.includes(facility.trim())) {
      setValue('facilities', [...currentFacilities, facility.trim()])
      setFacilityInput('')
    } else {
      toast.error('Fasilitas sudah ditambahkan')
    }
  }

  const removeFacility = (index: number) => {
    const currentFacilities = facilities || []
    setValue(
      'facilities',
      currentFacilities.filter((_, i) => i !== index)
    )
  }

  const addSpecialty = (specialty: string) => {
    const currentSpecialties = specialties || []
    if (!currentSpecialties.includes(specialty.trim())) {
      setValue('specialties', [...currentSpecialties, specialty.trim()])
      setSpecialtyInput('')
    } else {
      toast.error('Keahlian sudah ditambahkan')
    }
  }

  const removeSpecialty = (index: number) => {
    const currentSpecialties = specialties || []
    setValue(
      'specialties',
      currentSpecialties.filter((_, i) => i !== index)
    )
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const result = await saveInstitutionCapacity(data)

      if (result.success) {
        toast.success('Data kapasitas berhasil disimpan')
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
        <h2 className="text-2xl font-semibold">Kapasitas & Fasilitas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Informasi kapasitas dan fasilitas yang tersedia
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="capacity_per_month">Kapasitas per Bulan</Label>
          <Input
            id="capacity_per_month"
            type="number"
            placeholder="Jumlah peserta yang dapat diterima per bulan"
            min={0}
            disabled={isLoading}
            {...register('capacity_per_month', { valueAsNumber: true })}
          />
          <p className="text-xs text-muted-foreground">
            Opsional. Berapa banyak peserta yang dapat diterima per bulan?
          </p>
        </div>

        <div className="space-y-2">
          <Label>Fasilitas</Label>
          <div className="mb-2 flex flex-wrap gap-2">
            {COMMON_FACILITIES.map((facility) => (
              <Button
                key={facility}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addFacility(facility)}
                disabled={isLoading || facilities?.includes(facility)}
              >
                <Plus className="mr-1 h-3 w-3" />
                {facility}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Fasilitas lainnya..."
              value={facilityInput}
              onChange={(e) => setFacilityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (facilityInput.trim()) addFacility(facilityInput)
                }
              }}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (facilityInput.trim()) addFacility(facilityInput)
              }}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {facilities && facilities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {facilities.map((facility, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {facility}
                  <button
                    type="button"
                    onClick={() => removeFacility(index)}
                    className="ml-1 hover:text-destructive"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Keahlian yang Ditawarkan</Label>
          <div className="mb-2 flex flex-wrap gap-2">
            {COMMON_SPECIALTIES.map((specialty) => (
              <Button
                key={specialty}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSpecialty(specialty)}
                disabled={isLoading || specialties?.includes(specialty)}
              >
                <Plus className="mr-1 h-3 w-3" />
                {specialty}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Keahlian lainnya..."
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (specialtyInput.trim()) addSpecialty(specialtyInput)
                }
              }}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (specialtyInput.trim()) addSpecialty(specialtyInput)
              }}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {specialties && specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {specialty}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(index)}
                    className="ml-1 hover:text-destructive"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
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
