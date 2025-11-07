'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Plus,
  Trash2,
  Loader2,
  X,
  Image as ImageIcon,
} from 'lucide-react'
import {
  candidatePersonalDataSchema,
  candidateEducationSchema,
  candidateSkillsSchema,
  type CandidatePersonalDataInput,
  type CandidateEducationInput,
  type CandidateSkillsInput,
  type CandidateExperienceInput,
} from '@/lib/validations/candidate'
import {
  saveCandidatePersonalData,
  saveCandidateEducation,
  saveCandidateSkills,
  updateAvatarUrl,
  updateCvUrl,
  updateKtpUrl,
  updateDiplomaUrl,
  updateCertificateUrls,
  saveCandidateCertificate,
  deleteCandidateCertificate,
  getCandidateCertificates,
} from '@/actions/candidate.actions'
import { uploadAvatar, uploadDocument } from '@/lib/supabase/storage'
import { FileUpload } from '@/components/ui/file-upload'
import { createClient } from '@/lib/supabase/client'
import { Instagram, Facebook, Linkedin, Twitter } from 'lucide-react'
import { ImageCropper } from '@/components/ui/image-cropper'

interface ProfileEditFormProps {
  candidateProfile: any
  experiences: any[]
  profile: any
  initialTab?: string
}

export function ProfileEditForm({ candidateProfile, experiences, profile, initialTab = 'personal' }: ProfileEditFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="personal" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Data Pribadi
        </TabsTrigger>
        <TabsTrigger value="education" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Pendidikan
        </TabsTrigger>
        <TabsTrigger value="experience" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Pengalaman
        </TabsTrigger>
        <TabsTrigger value="skills" className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          Skills & Sertifikat
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Foto & Dokumen
        </TabsTrigger>
      </TabsList>

      {/* Personal Data Form */}
      <TabsContent value="personal">
        <PersonalDataForm
          candidateProfile={candidateProfile}
          onSuccess={() => setActiveTab('education')}
        />
      </TabsContent>

      {/* Education Form */}
      <TabsContent value="education">
        <EducationForm
          candidateProfile={candidateProfile}
          onSuccess={() => setActiveTab('experience')}
        />
      </TabsContent>

      {/* Experience Form */}
      <TabsContent value="experience">
        <ExperienceForm
          initialExperiences={experiences}
          onSuccess={() => setActiveTab('skills')}
        />
      </TabsContent>

      {/* Skills Form */}
      <TabsContent value="skills">
        <SkillsForm candidateProfile={candidateProfile} />
      </TabsContent>

      {/* Documents Form */}
      <TabsContent value="documents">
        <DocumentsForm
          profile={profile}
          candidateProfile={candidateProfile}
        />
      </TabsContent>
    </Tabs>
  )
}

// Personal Data Form Component
function PersonalDataForm({
  candidateProfile,
  onSuccess,
}: {
  candidateProfile: any
  onSuccess: () => void
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CandidatePersonalDataInput>({
    resolver: zodResolver(candidatePersonalDataSchema),
    defaultValues: {
      nik: candidateProfile?.nik || '',
      full_name: candidateProfile?.full_name || '',
      birth_place: candidateProfile?.birth_place || '',
      birth_date: candidateProfile?.birth_date || '',
      gender: candidateProfile?.gender || 'male',
      address: candidateProfile?.address || '',
      phone: candidateProfile?.phone || '',
    },
  })

  const onSubmit = async (data: CandidatePersonalDataInput) => {
    setIsLoading(true)
    try {
      const result = await saveCandidatePersonalData(data)
      if (result.success) {
        toast.success('Data pribadi berhasil disimpan')
        router.refresh()
        onSuccess()
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
    <Card>
      <CardHeader>
        <CardTitle>Data Pribadi</CardTitle>
        <CardDescription>Update informasi pribadi Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nik">NIK *</Label>
              <Input
                id="nik"
                placeholder="16 digit NIK"
                {...form.register('nik')}
              />
              {form.formState.errors.nik && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.nik.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap *</Label>
              <Input
                id="full_name"
                placeholder="Nama sesuai KTP"
                {...form.register('full_name')}
              />
              {form.formState.errors.full_name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_place">Tempat Lahir *</Label>
              <Input
                id="birth_place"
                placeholder="Kota kelahiran"
                {...form.register('birth_place')}
              />
              {form.formState.errors.birth_place && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.birth_place.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Tanggal Lahir *</Label>
              <Input
                id="birth_date"
                type="date"
                {...form.register('birth_date')}
              />
              {form.formState.errors.birth_date && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.birth_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin *</Label>
              <Select
                value={form.watch('gender')}
                onValueChange={(value) => form.setValue('gender', value as 'male' | 'female')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.gender && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.gender.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon *</Label>
              <Input
                id="phone"
                placeholder="08xxxxxxxxxx"
                {...form.register('phone')}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Textarea
                id="address"
                placeholder="Alamat sesuai KTP"
                rows={3}
                {...form.register('address')}
              />
              {form.formState.errors.address && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan & Lanjut
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Education Form Component
function EducationForm({
  candidateProfile,
  onSuccess,
}: {
  candidateProfile: any
  onSuccess: () => void
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CandidateEducationInput>({
    resolver: zodResolver(candidateEducationSchema),
    defaultValues: {
      education_level: candidateProfile?.education_level || 'sma',
      institution: candidateProfile?.institution || '',
      major: candidateProfile?.major || '',
      graduation_year: candidateProfile?.graduation_year || new Date().getFullYear(),
      gpa: candidateProfile?.gpa || null,
    },
  })

  const onSubmit = async (data: CandidateEducationInput) => {
    setIsLoading(true)
    try {
      const result = await saveCandidateEducation(data)
      if (result.success) {
        toast.success('Data pendidikan berhasil disimpan')
        router.refresh()
        onSuccess()
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
    <Card>
      <CardHeader>
        <CardTitle>Pendidikan</CardTitle>
        <CardDescription>Update informasi pendidikan terakhir Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="education_level">Jenjang Pendidikan *</Label>
              <Select
                value={form.watch('education_level')}
                onValueChange={(value) => form.setValue('education_level', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenjang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smp">SMP</SelectItem>
                  <SelectItem value="sma">SMA/SMK</SelectItem>
                  <SelectItem value="d1">D1</SelectItem>
                  <SelectItem value="d2">D2</SelectItem>
                  <SelectItem value="d3">D3</SelectItem>
                  <SelectItem value="d4">D4</SelectItem>
                  <SelectItem value="s1">S1</SelectItem>
                  <SelectItem value="s2">S2</SelectItem>
                  <SelectItem value="s3">S3</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.education_level && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.education_level.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Nama Institusi *</Label>
              <Input
                id="institution"
                placeholder="Nama sekolah/universitas"
                {...form.register('institution')}
              />
              {form.formState.errors.institution && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.institution.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="major">Jurusan *</Label>
              <Input
                id="major"
                placeholder="Program studi/jurusan"
                {...form.register('major')}
              />
              {form.formState.errors.major && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.major.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduation_year">Tahun Lulus *</Label>
              <Input
                id="graduation_year"
                type="number"
                placeholder="2024"
                {...form.register('graduation_year', { valueAsNumber: true })}
              />
              {form.formState.errors.graduation_year && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.graduation_year.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpa">IPK (Opsional)</Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                placeholder="3.50"
                {...form.register('gpa', { valueAsNumber: true })}
              />
              {form.formState.errors.gpa && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.gpa.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan & Lanjut
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Experience Form Component
function ExperienceForm({
  initialExperiences,
  onSuccess,
}: {
  initialExperiences: any[]
  onSuccess: () => void
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CandidateSkillsInput>({
    resolver: zodResolver(candidateSkillsSchema),
    defaultValues: {
      skills: [], // Will be set in Skills form
      experiences: initialExperiences.map(exp => ({
        company_name: exp.company_name,
        position: exp.position,
        start_date: exp.start_date,
        end_date: exp.end_date,
        is_current: exp.is_current,
        description: exp.description,
      })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'experiences',
  })

  const onSubmit = async (data: CandidateSkillsInput) => {
    setIsLoading(true)
    try {
      // Save with empty skills array (will be filled in next step)
      const result = await saveCandidateSkills({
        skills: [],
        experiences: data.experiences,
      })
      if (result.success) {
        toast.success('Pengalaman kerja berhasil disimpan')
        router.refresh()
        onSuccess()
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
    <Card>
      <CardHeader>
        <CardTitle>Pengalaman Kerja</CardTitle>
        <CardDescription>
          Tambahkan pengalaman kerja Anda (opsional, bisa dilewati)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Belum ada pengalaman kerja
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() =>
                  append({
                    company_name: '',
                    position: '',
                    start_date: '',
                    end_date: null,
                    is_current: false,
                    description: null,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pengalaman
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Pengalaman {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nama Perusahaan *</Label>
                      <Input
                        placeholder="PT Example"
                        {...form.register(`experiences.${index}.company_name`)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Posisi *</Label>
                      <Input
                        placeholder="Software Engineer"
                        {...form.register(`experiences.${index}.position`)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tanggal Mulai *</Label>
                      <Input
                        type="date"
                        {...form.register(`experiences.${index}.start_date`)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tanggal Selesai</Label>
                      <Input
                        type="date"
                        disabled={form.watch(`experiences.${index}.is_current`)}
                        {...form.register(`experiences.${index}.end_date`)}
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center space-x-2">
                      <Checkbox
                        id={`is_current_${index}`}
                        checked={form.watch(`experiences.${index}.is_current`)}
                        onCheckedChange={(checked) =>
                          form.setValue(`experiences.${index}.is_current`, checked as boolean)
                        }
                      />
                      <Label htmlFor={`is_current_${index}`} className="cursor-pointer">
                        Saya masih bekerja di sini
                      </Label>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label>Deskripsi Pekerjaan</Label>
                      <Textarea
                        placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."
                        rows={3}
                        {...form.register(`experiences.${index}.description`)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    company_name: '',
                    position: '',
                    start_date: '',
                    end_date: null,
                    is_current: false,
                    description: null,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pengalaman Lain
              </Button>
            </div>
          )}

          <Separator />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
            >
              Lewati
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan & Lanjut
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Skills Form Component
function SkillsForm({ candidateProfile }: { candidateProfile: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [skills, setSkills] = useState<string[]>(candidateProfile?.skills || [])
  const [certificates, setCertificates] = useState<any[]>([])
  const [userId, setUserId] = useState<string>('')

  // Social Media
  const [instagram, setInstagram] = useState(candidateProfile?.instagram_url || '')
  const [facebook, setFacebook] = useState(candidateProfile?.facebook_url || '')
  const [linkedin, setLinkedin] = useState(candidateProfile?.linkedin_url || '')
  const [twitter, setTwitter] = useState(candidateProfile?.twitter_url || '')

  // Certificate form
  const [showCertForm, setShowCertForm] = useState(false)
  const [certName, setCertName] = useState('')
  const [certDescription, setCertDescription] = useState('')
  const [certIssuer, setCertIssuer] = useState('')
  const [certFile, setCertFile] = useState<File | null>(null)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const result = await getCandidateCertificates()
        if (result.success && result.data) {
          setCertificates(result.data.certificates)
        }
      }
    }
    init()
  }, [])

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleAddCertificate = async () => {
    if (!certName.trim()) {
      toast.error('Nama sertifikat wajib diisi')
      return
    }

    setIsLoading(true)
    try {
      let fileUrl = null
      if (certFile && userId) {
        const uploadResult = await uploadDocument(certFile, userId, 'certificate')
        if (uploadResult.url) {
          fileUrl = uploadResult.url
        }
      }

      const result = await saveCandidateCertificate({
        name: certName,
        description: certDescription || null,
        issuer: certIssuer || null,
        file_url: fileUrl,
      })

      if (result.success) {
        toast.success('Sertifikat berhasil ditambahkan')
        // Refresh certificates
        const certResult = await getCandidateCertificates()
        if (certResult.success && certResult.data) {
          setCertificates(certResult.data.certificates)
        }
        // Reset form
        setCertName('')
        setCertDescription('')
        setCertIssuer('')
        setCertFile(null)
        setShowCertForm(false)
      } else {
        toast.error(result.error || 'Gagal menambahkan sertifikat')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm('Hapus sertifikat ini?')) return

    setIsLoading(true)
    try {
      const result = await deleteCandidateCertificate(id)
      if (result.success) {
        toast.success('Sertifikat berhasil dihapus')
        setCertificates(certificates.filter(c => c.id !== id))
      } else {
        toast.error(result.error || 'Gagal menghapus sertifikat')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async () => {
    if (skills.length === 0) {
      toast.error('Tambahkan minimal 1 skill')
      return
    }

    setIsLoading(true)
    try {
      const result = await saveCandidateSkills({
        skills,
        experiences: [],
        instagram_url: instagram || null,
        facebook_url: facebook || null,
        linkedin_url: linkedin,
        twitter_url: twitter || null,
      })
      if (result.success) {
        toast.success('Skills dan social media berhasil disimpan')
        router.push('/dashboard/candidate/profile')
        router.refresh()
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
    <Card>
      <CardHeader>
        <CardTitle>Skills, Sertifikat & Social Media</CardTitle>
        <CardDescription>
          Tambahkan skills, sertifikat, dan link social media Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Skills Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Masukkan skill (contoh: React, Node.js, Design)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill()
                }
              }}
            />
            <Button type="button" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Award className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Belum ada skills ditambahkan
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Certificates Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Sertifikat</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCertForm(!showCertForm)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Sertifikat
            </Button>
          </div>

          {showCertForm && (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="cert-name">Nama Sertifikat *</Label>
                <Input
                  id="cert-name"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  placeholder="Contoh: Google Cloud Professional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-issuer">Penerbit</Label>
                <Input
                  id="cert-issuer"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="Contoh: Google"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-desc">Deskripsi</Label>
                <Textarea
                  id="cert-desc"
                  value={certDescription}
                  onChange={(e) => setCertDescription(e.target.value)}
                  placeholder="Deskripsi singkat tentang sertifikat"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-file">File Sertifikat (opsional)</Label>
                <Input
                  id="cert-file"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleAddCertificate}
                  disabled={isLoading || !certName.trim()}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Simpan
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCertForm(false)
                    setCertName('')
                    setCertDescription('')
                    setCertIssuer('')
                    setCertFile(null)
                  }}
                >
                  Batal
                </Button>
              </div>
            </div>
          )}

          {certificates.length > 0 ? (
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{cert.name}</h4>
                      {cert.issuer && (
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      )}
                      {cert.description && (
                        <p className="text-sm mt-2">{cert.description}</p>
                      )}
                      {cert.file_url && (
                        <a
                          href={cert.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline mt-2 inline-block"
                        >
                          Lihat Sertifikat
                        </a>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCertificate(cert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Award className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Belum ada sertifikat ditambahkan
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Social Media Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Social Media (Opsional)</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedin">
                <Linkedin className="inline h-4 w-4 mr-2" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">
                <Instagram className="inline h-4 w-4 mr-2" />
                Instagram
              </Label>
              <Input
                id="instagram"
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">
                <Facebook className="inline h-4 w-4 mr-2" />
                Facebook
              </Label>
              <Input
                id="facebook"
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">
                <Twitter className="inline h-4 w-4 mr-2" />
                Twitter
              </Label>
              <Input
                id="twitter"
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/candidate/profile')}
          >
            Batal
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading || skills.length === 0}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Profil
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Documents Form Component
function DocumentsForm({
  profile,
  candidateProfile,
}: {
  profile: any
  candidateProfile: any
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string>('')

  // Image cropper states
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)

  // Get user ID on mount
  useEffect(() => {
    const getUserId = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUserId()
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Format file tidak valid. Gunakan JPG, PNG, atau WebP')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!userId) {
      toast.error('User not authenticated')
      return
    }

    setIsLoading(true)
    try {
      // Convert blob to file
      const croppedFile = new File([croppedBlob], 'avatar.jpg', {
        type: 'image/jpeg',
      })

      const result = await uploadAvatar(croppedFile, userId)
      if (result.url) {
        await updateAvatarUrl(result.url)
        toast.success('Foto profil berhasil diupload')
        setShowCropper(false)
        setImagePreview(null)

        // Force refresh and redirect to profile page to see changes
        router.refresh()
        router.push('/dashboard/candidate/profile')
      } else if (result.error) {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCvUpload = async (file: File) => {
    if (!userId) return { url: null, error: 'User not authenticated' }

    const result = await uploadDocument(file, userId, 'cv')
    if (result.url) {
      await updateCvUrl(result.url)
      router.refresh()
    }
    return result
  }

  const handleKtpUpload = async (file: File) => {
    if (!userId) return { url: null, error: 'User not authenticated' }

    const result = await uploadDocument(file, userId, 'ktp')
    if (result.url) {
      await updateKtpUrl(result.url)
      router.refresh()
    }
    return result
  }

  const handleDiplomaUpload = async (file: File) => {
    if (!userId) return { url: null, error: 'User not authenticated' }

    const result = await uploadDocument(file, userId, 'diploma')
    if (result.url) {
      await updateDiplomaUrl(result.url)
      router.refresh()
    }
    return result
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foto Profil & Dokumen</CardTitle>
        <CardDescription>
          Upload foto profil dan dokumen pendukung Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Photo Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Foto Profil</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Foto Profil</Label>
              {profile?.avatar_url && (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20 mb-3">
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Format: JPG, PNG, WebP. Maksimal 5MB. Foto akan di-crop otomatis.
              </p>
            </div>
          </div>
        </div>

        {/* Image Cropper Modal */}
        {showCropper && imagePreview && (
          <ImageCropper
            image={imagePreview}
            onCropComplete={handleCropComplete}
            onClose={() => {
              setShowCropper(false)
              setImagePreview(null)
            }}
            aspectRatio={1}
          />
        )}

        <Separator />

        {/* Documents Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Dokumen</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* CV Upload */}
            <div className="space-y-2">
              <Label>CV / Resume *</Label>
              {candidateProfile?.cv_url && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg mb-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <a
                    href={candidateProfile.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Lihat CV
                  </a>
                </div>
              )}
              <Input
                type="file"
                accept="application/pdf,image/jpeg,image/jpg,image/png"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setIsLoading(true)
                    const result = await handleCvUpload(file)
                    setIsLoading(false)
                    if (result.error) {
                      toast.error(result.error)
                    } else {
                      toast.success('CV berhasil diupload')
                    }
                  }
                }}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Format: PDF, JPG, PNG. Maksimal 10MB
              </p>
            </div>

            {/* KTP Upload */}
            <div className="space-y-2">
              <Label>KTP</Label>
              {candidateProfile?.ktp_url && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg mb-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <a
                    href={candidateProfile.ktp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Lihat KTP
                  </a>
                </div>
              )}
              <Input
                type="file"
                accept="application/pdf,image/jpeg,image/jpg,image/png"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setIsLoading(true)
                    const result = await handleKtpUpload(file)
                    setIsLoading(false)
                    if (result.error) {
                      toast.error(result.error)
                    } else {
                      toast.success('KTP berhasil diupload')
                    }
                  }
                }}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Format: PDF, JPG, PNG. Maksimal 10MB
              </p>
            </div>

            {/* Diploma Upload */}
            <div className="space-y-2">
              <Label>Ijazah</Label>
              {candidateProfile?.diploma_url && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg mb-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <a
                    href={candidateProfile.diploma_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Lihat Ijazah
                  </a>
                </div>
              )}
              <Input
                type="file"
                accept="application/pdf,image/jpeg,image/jpg,image/png"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setIsLoading(true)
                    const result = await handleDiplomaUpload(file)
                    setIsLoading(false)
                    if (result.error) {
                      toast.error(result.error)
                    } else {
                      toast.success('Ijazah berhasil diupload')
                    }
                  }
                }}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Format: PDF, JPG, PNG. Maksimal 10MB
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/candidate/profile')}
          >
            Kembali ke Profil
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
