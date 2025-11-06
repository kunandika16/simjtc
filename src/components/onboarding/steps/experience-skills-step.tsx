'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X, Briefcase } from 'lucide-react'
import { toast } from 'sonner'
import { saveCandidateSkills } from '@/actions/candidate.actions'
import {
  candidateSkillsSchema,
  type CandidateSkillsInput,
} from '@/lib/validations/candidate'

interface ExperienceSkillsStepProps {
  onComplete: () => void
  profileData: any
}

export function ExperienceSkillsStep({
  onComplete,
  profileData,
}: ExperienceSkillsStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CandidateSkillsInput>({
    resolver: zodResolver(candidateSkillsSchema),
    defaultValues: {
      skills: profileData?.profile?.skills || [],
      experiences: profileData?.experiences || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  })

  const skills = watch('skills')

  const addSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = skills || []
      if (!currentSkills.includes(skillInput.trim())) {
        setValue('skills', [...currentSkills, skillInput.trim()], {
          shouldValidate: true,
        })
        setSkillInput('')
      } else {
        toast.error('Skill sudah ditambahkan')
      }
    }
  }

  const removeSkill = (index: number) => {
    const currentSkills = skills || []
    setValue(
      'skills',
      currentSkills.filter((_, i) => i !== index),
      { shouldValidate: true }
    )
  }

  const addExperience = () => {
    append({
      company_name: '',
      position: '',
      start_date: '',
      end_date: null,
      is_current: false,
      description: null,
    })
  }

  const onSubmit = async (data: CandidateSkillsInput) => {
    setIsLoading(true)

    try {
      const result = await saveCandidateSkills(data)

      if (result.success) {
        toast.success('Skills dan pengalaman berhasil disimpan')
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
        <h2 className="text-2xl font-semibold">Pengalaman & Skill</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tambahkan skill dan pengalaman kerja Anda
        </p>
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="skill">
            Skills <span className="text-destructive">*</span>
          </Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="skill"
              type="text"
              placeholder="Masukkan skill (contoh: Microsoft Office, Photoshop)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill()
                }
              }}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addSkill}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errors.skills && (
            <p className="mt-1 text-sm text-destructive">
              {errors.skills.message}
            </p>
          )}
        </div>

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
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

      {/* Experiences Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Pengalaman Kerja</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExperience}
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pengalaman
          </Button>
        </div>

        {fields.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Briefcase className="mb-2 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Belum ada pengalaman kerja. Klik tombol di atas untuk menambahkan.
              </p>
            </CardContent>
          </Card>
        )}

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Pengalaman Kerja {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.company_name`}>
                    Nama Perusahaan <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`experiences.${index}.company_name`}
                    type="text"
                    placeholder="PT. Contoh"
                    disabled={isLoading}
                    {...register(`experiences.${index}.company_name`)}
                  />
                  {errors.experiences?.[index]?.company_name && (
                    <p className="text-sm text-destructive">
                      {errors.experiences[index]?.company_name?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.position`}>
                    Posisi <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`experiences.${index}.position`}
                    type="text"
                    placeholder="Staff Admin"
                    disabled={isLoading}
                    {...register(`experiences.${index}.position`)}
                  />
                  {errors.experiences?.[index]?.position && (
                    <p className="text-sm text-destructive">
                      {errors.experiences[index]?.position?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.start_date`}>
                    Tanggal Mulai <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`experiences.${index}.start_date`}
                    type="date"
                    disabled={isLoading}
                    {...register(`experiences.${index}.start_date`)}
                  />
                  {errors.experiences?.[index]?.start_date && (
                    <p className="text-sm text-destructive">
                      {errors.experiences[index]?.start_date?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.end_date`}>
                    Tanggal Selesai
                  </Label>
                  <Input
                    id={`experiences.${index}.end_date`}
                    type="date"
                    disabled={isLoading || watch(`experiences.${index}.is_current`)}
                    {...register(`experiences.${index}.end_date`)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`experiences.${index}.is_current`}
                  checked={watch(`experiences.${index}.is_current`)}
                  onCheckedChange={(checked) =>
                    setValue(`experiences.${index}.is_current`, checked as boolean)
                  }
                />
                <label
                  htmlFor={`experiences.${index}.is_current`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Saya masih bekerja di sini
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`experiences.${index}.description`}>
                  Deskripsi Pekerjaan
                </Label>
                <Textarea
                  id={`experiences.${index}.description`}
                  placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."
                  rows={3}
                  disabled={isLoading}
                  {...register(`experiences.${index}.description`)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan & Lanjut'}
        </Button>
      </div>
    </form>
  )
}
