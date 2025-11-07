'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Image from 'next/image'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateEmployerProfile, uploadCompanyLogo, deleteCompanyLogo } from '@/actions/employer.actions'
import { Building2, Loader2, Upload, X } from 'lucide-react'

const profileSchema = z.object({
  company_name: z.string().min(2, 'Nama perusahaan minimal 2 karakter'),
  industry: z.string().optional(),
  website: z.string().url('URL tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  nib: z.string().optional(),
  npwp: z.string().optional(),
  pic_name: z.string().min(2, 'Nama PIC minimal 2 karakter'),
  pic_email: z.string().email('Email tidak valid'),
  pic_phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  pic_position: z.string().optional(),
  recruitment_location: z.string().optional(),
  notes: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface EmployerProfileEditFormProps {
  employer: any
}

export function EmployerProfileEditForm({ employer }: EmployerProfileEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(employer.logo_url)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      company_name: employer.company_name,
      industry: employer.industry || '',
      website: employer.website || '',
      address: employer.address || '',
      city: employer.city || '',
      province: employer.province || '',
      nib: employer.nib || '',
      npwp: employer.npwp || '',
      pic_name: employer.pic_name,
      pic_email: employer.pic_email,
      pic_phone: employer.pic_phone,
      pic_position: employer.pic_position || '',
      recruitment_location: employer.recruitment_location?.join(', ') || '',
      notes: employer.notes || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      const locations = data.recruitment_location
        ? data.recruitment_location.split(',').map((loc) => loc.trim()).filter(Boolean)
        : []

      const result = await updateEmployerProfile({
        ...data,
        recruitment_location: locations,
      })

      if (result.success) {
        toast.success('Profil berhasil diperbarui')
        router.push('/dashboard/employer/profile')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal memperbarui profil')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const result = await uploadCompanyLogo(formData)

      if (result.success && result.data?.url) {
        setLogoUrl(result.data.url)
        toast.success('Logo berhasil diupload')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal mengupload logo')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengupload logo')
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleDeleteLogo = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus logo?')) return

    setIsUploadingLogo(true)
    try {
      const result = await deleteCompanyLogo()

      if (result.success) {
        setLogoUrl(null)
        toast.success('Logo berhasil dihapus')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal menghapus logo')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsUploadingLogo(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Logo Perusahaan</CardTitle>
          <CardDescription>Upload logo perusahaan Anda (maks. 2MB, JPG/PNG/WebP)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <Image src={logoUrl} alt="Company Logo" width={96} height={96} className="object-cover" />
              ) : (
                <Building2 className="h-12 w-12 text-primary" />
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={isUploadingLogo} asChild>
                <label className="cursor-pointer">
                  {isUploadingLogo ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {logoUrl ? 'Ganti Logo' : 'Upload Logo'}
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleLogoUpload}
                    disabled={isUploadingLogo}
                  />
                </label>
              </Button>
              {logoUrl && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={handleDeleteLogo}
                  disabled={isUploadingLogo}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Perusahaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company_name">
              Nama Perusahaan <span className="text-destructive">*</span>
            </Label>
            <Input id="company_name" {...register('company_name')} />
            {errors.company_name && (
              <p className="text-sm text-destructive mt-1">{errors.company_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="industry">Industri</Label>
            <Input id="industry" {...register('industry')} placeholder="Contoh: Teknologi, Manufaktur" />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" {...register('website')} placeholder="https://example.com" />
            {errors.website && <p className="text-sm text-destructive mt-1">{errors.website.message}</p>}
          </div>

          <div>
            <Label htmlFor="address">Alamat</Label>
            <Textarea id="address" {...register('address')} placeholder="Alamat lengkap perusahaan" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Kota/Kabupaten</Label>
              <Input id="city" {...register('city')} />
            </div>
            <div>
              <Label htmlFor="province">Provinsi</Label>
              <Input id="province" {...register('province')} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Legal</CardTitle>
          <CardDescription>Opsional - untuk verifikasi perusahaan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nib">NIB (Nomor Induk Berusaha)</Label>
            <Input id="nib" {...register('nib')} placeholder="1234567890123" />
          </div>

          <div>
            <Label htmlFor="npwp">NPWP</Label>
            <Input id="npwp" {...register('npwp')} placeholder="12.345.678.9-012.345" />
          </div>
        </CardContent>
      </Card>

      {/* PIC Information */}
      <Card>
        <CardHeader>
          <CardTitle>Person In Charge (PIC)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pic_name">
              Nama PIC <span className="text-destructive">*</span>
            </Label>
            <Input id="pic_name" {...register('pic_name')} />
            {errors.pic_name && <p className="text-sm text-destructive mt-1">{errors.pic_name.message}</p>}
          </div>

          <div>
            <Label htmlFor="pic_position">Posisi</Label>
            <Input id="pic_position" {...register('pic_position')} placeholder="Contoh: HR Manager" />
          </div>

          <div>
            <Label htmlFor="pic_email">
              Email PIC <span className="text-destructive">*</span>
            </Label>
            <Input id="pic_email" type="email" {...register('pic_email')} />
            {errors.pic_email && <p className="text-sm text-destructive mt-1">{errors.pic_email.message}</p>}
          </div>

          <div>
            <Label htmlFor="pic_phone">
              Telepon PIC <span className="text-destructive">*</span>
            </Label>
            <Input id="pic_phone" {...register('pic_phone')} placeholder="08123456789" />
            {errors.pic_phone && <p className="text-sm text-destructive mt-1">{errors.pic_phone.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Recruitment Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferensi Rekrutmen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="recruitment_location">Lokasi Penempatan</Label>
            <Input
              id="recruitment_location"
              {...register('recruitment_location')}
              placeholder="Jakarta, Bandung, Surabaya (pisahkan dengan koma)"
            />
            <p className="text-xs text-muted-foreground mt-1">Pisahkan lokasi dengan koma</p>
          </div>

          <div>
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Informasi tambahan tentang perusahaan atau preferensi rekrutmen"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Perubahan'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Batal
        </Button>
      </div>
    </form>
  )
}
