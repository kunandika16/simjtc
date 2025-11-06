'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { saveEmployerPreferences } from '@/actions/employer.actions'

const schema = z.object({
  recruitment_location: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface EmployerPreferencesStepProps {
  onComplete: () => void
  employerData: any
}

const COMMON_LOCATIONS = [
  'Indonesia',
  'Jepang',
  'Singapura',
  'Malaysia',
  'Korea Selatan',
  'Taiwan',
  'Timur Tengah',
]

export function EmployerPreferencesStep({
  onComplete,
  employerData,
}: EmployerPreferencesStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [locationInput, setLocationInput] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      recruitment_location: employerData?.employer?.recruitment_location || [],
      notes: employerData?.employer?.notes || '',
    },
  })

  const locations = watch('recruitment_location')

  const addLocation = (location: string) => {
    const currentLocations = locations || []
    if (!currentLocations.includes(location.trim())) {
      setValue('recruitment_location', [...currentLocations, location.trim()])
      setLocationInput('')
    } else {
      toast.error('Lokasi sudah ditambahkan')
    }
  }

  const removeLocation = (index: number) => {
    const currentLocations = locations || []
    setValue(
      'recruitment_location',
      currentLocations.filter((_, i) => i !== index)
    )
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const result = await saveEmployerPreferences(data)

      if (result.success) {
        toast.success('Preferensi rekrutmen berhasil disimpan')
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
        <h2 className="text-2xl font-semibold">Preferensi Rekrutmen</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tentukan preferensi lokasi rekrutmen dan catatan tambahan
        </p>
      </div>

      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          Data perusahaan sudah lengkap! Pada langkah ini Anda bisa menambahkan
          preferensi rekrutmen (opsional).
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Lokasi Penempatan Kerja</Label>
          <p className="text-sm text-muted-foreground">
            Tentukan lokasi di mana kandidat akan ditempatkan
          </p>

          <div className="mb-2 flex flex-wrap gap-2">
            {COMMON_LOCATIONS.map((location) => (
              <Button
                key={location}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addLocation(location)}
                disabled={isLoading || locations?.includes(location)}
              >
                <Plus className="mr-1 h-3 w-3" />
                {location}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Lokasi lainnya..."
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (locationInput.trim()) addLocation(locationInput)
                }
              }}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (locationInput.trim()) addLocation(locationInput)
              }}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {locations && locations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {locations.map((location, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {location}
                  <button
                    type="button"
                    onClick={() => removeLocation(index)}
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
          <Label htmlFor="notes">Catatan Tambahan</Label>
          <Textarea
            id="notes"
            placeholder="Informasi tambahan tentang perusahaan, jenis kandidat yang dicari, dll."
            rows={4}
            disabled={isLoading}
            {...register('notes')}
          />
          <p className="text-xs text-muted-foreground">Opsional</p>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <h3 className="mb-2 font-medium">Langkah Selanjutnya</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Profil perusahaan akan direview oleh admin</li>
          <li>• Setelah disetujui, Anda dapat posting lowongan pekerjaan</li>
          <li>
            • Kandidat dapat melamar dan Anda dapat mengelola aplikasi mereka
          </li>
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
