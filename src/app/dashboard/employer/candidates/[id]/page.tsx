import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCandidateDetail } from '@/actions/candidate.actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
} from 'lucide-react'

interface CandidateDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CandidateDetailPage({
  params,
}: CandidateDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'employer') {
    redirect('/dashboard')
  }

  // Get candidate details
  const result = await getCandidateDetail(id)

  if (!result.success || !result.data) {
    redirect('/dashboard/employer')
  }

  const { profile: candidateProfile, candidateProfile: details, experiences } = result.data

  return (
    <div className="container mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/employer">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {candidateProfile?.full_name || 'Kandidat'}
          </h1>
          <p className="text-muted-foreground mt-1">Detail Profil Kandidat</p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {details?.nik && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      NIK
                    </p>
                    <p className="text-sm">{details.nik}</p>
                  </div>
                )}
                {details?.gender && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Jenis Kelamin
                    </p>
                    <p className="text-sm capitalize">{details.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                  </div>
                )}
                {details?.birth_place && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tempat Lahir
                    </p>
                    <p className="text-sm">{details.birth_place}</p>
                  </div>
                )}
                {details?.birth_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tanggal Lahir
                    </p>
                    <p className="text-sm">
                      {new Date(details.birth_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
              {details?.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Alamat
                  </p>
                  <p className="text-sm">{details.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          {details && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Pendidikan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">
                    {details.education_level?.toUpperCase() || 'N/A'} - {details.major || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {details.institution || 'N/A'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {details.graduation_year && (
                      <span>Lulus: {details.graduation_year}</span>
                    )}
                    {details.gpa && <span>IPK: {details.gpa}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {details?.skills && details.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Keahlian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {details.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Pengalaman Kerja
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {experiences.map((exp: any) => (
                  <div key={exp.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{exp.position}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.company_name || exp.company}
                        </p>
                      </div>
                      {exp.is_current && (
                        <Badge variant="outline">Saat Ini</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(exp.start_date).toLocaleDateString('id-ID', {
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        -{' '}
                        {exp.is_current
                          ? 'Sekarang'
                          : exp.end_date
                          ? new Date(exp.end_date).toLocaleDateString('id-ID', {
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidateProfile?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Telepon</p>
                    <p className="text-sm text-muted-foreground">
                      {candidateProfile.phone}
                    </p>
                  </div>
                </div>
              )}

              {details?.phone && candidateProfile?.phone !== details.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Telepon Alternatif</p>
                    <p className="text-sm text-muted-foreground">
                      {details.phone}
                    </p>
                  </div>
                </div>
              )}

              {(candidateProfile?.city || candidateProfile?.province) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Lokasi</p>
                    <p className="text-sm text-muted-foreground">
                      {[candidateProfile?.city, candidateProfile?.province]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          {(details?.ktp_url || details?.diploma_url || details?.cv_url) && (
            <Card>
              <CardHeader>
                <CardTitle>Dokumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {details.ktp_url && (
                  <a
                    href={details.ktp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline"
                  >
                    Lihat KTP
                  </a>
                )}
                {details.diploma_url && (
                  <a
                    href={details.diploma_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline"
                  >
                    Lihat Ijazah
                  </a>
                )}
                {details.cv_url && (
                  <a
                    href={details.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline"
                  >
                    Download CV
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
