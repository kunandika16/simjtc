import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Edit, Mail, Phone, Globe, MapPin, FileText, User, MapPinned } from 'lucide-react'

export default async function EmployerProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: employer } = await supabase
    .from('employers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!employer) {
    redirect('/dashboard/employer')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Disetujui</Badge>
      case 'pending_approval':
        return <Badge variant="secondary">Menunggu Persetujuan</Badge>
      case 'rejected':
        return <Badge variant="destructive">Ditolak</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Profil Perusahaan</h1>
          <p className="text-muted-foreground">Informasi lengkap tentang perusahaan Anda</p>
        </div>
        <Link href="/dashboard/employer/profile/edit">
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profil
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Company Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                  {employer.logo_url ? (
                    <Image
                      src={employer.logo_url}
                      alt={employer.company_name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  ) : (
                    <Building2 className="h-10 w-10 text-primary" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-2xl">{employer.company_name}</CardTitle>
                  <CardDescription>{employer.industry || 'Industri tidak disebutkan'}</CardDescription>
                </div>
              </div>
              {getStatusBadge(employer.status)}
            </div>
          </CardHeader>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Perusahaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employer.website && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <a
                    href={employer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {employer.website}
                  </a>
                </div>
              </div>
            )}

            {employer.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Alamat</p>
                  <p className="text-sm text-muted-foreground">{employer.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {employer.city}, {employer.province}
                  </p>
                </div>
              </div>
            )}

            {employer.industry && (
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Industri</p>
                  <p className="text-sm text-muted-foreground">{employer.industry}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employer.nib && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">NIB (Nomor Induk Berusaha)</p>
                  <p className="text-sm text-muted-foreground">{employer.nib}</p>
                </div>
              </div>
            )}

            {employer.npwp && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">NPWP</p>
                  <p className="text-sm text-muted-foreground">{employer.npwp}</p>
                </div>
              </div>
            )}

            {!employer.nib && !employer.npwp && (
              <p className="text-sm text-muted-foreground">Tidak ada informasi legal yang ditambahkan</p>
            )}
          </CardContent>
        </Card>

        {/* PIC Information */}
        <Card>
          <CardHeader>
            <CardTitle>Person In Charge (PIC)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Nama</p>
                <p className="text-sm text-muted-foreground">{employer.pic_name}</p>
                {employer.pic_position && (
                  <p className="text-sm text-muted-foreground italic">{employer.pic_position}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{employer.pic_email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Telepon</p>
                <p className="text-sm text-muted-foreground">{employer.pic_phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recruitment Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferensi Rekrutmen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employer.recruitment_location && employer.recruitment_location.length > 0 && (
              <div className="flex items-start gap-3">
                <MapPinned className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Lokasi Penempatan</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {employer.recruitment_location.map((location: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {employer.notes && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Catatan</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{employer.notes}</p>
                </div>
              </div>
            )}

            {(!employer.recruitment_location || employer.recruitment_location.length === 0) &&
              !employer.notes && (
                <p className="text-sm text-muted-foreground">Tidak ada preferensi rekrutmen yang ditambahkan</p>
              )}
          </CardContent>
        </Card>

        {/* Status Information */}
        {employer.status === 'rejected' && employer.rejection_reason && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Alasan Penolakan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{employer.rejection_reason}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
