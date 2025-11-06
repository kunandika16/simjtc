import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { User, GraduationCap, Award, FileText, Edit } from 'lucide-react'

export default async function CandidateProfilePage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profil Saya</h1>
          <p className="mt-2 text-muted-foreground">
            Kelola informasi profil dan CV Anda
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/candidate/profile/edit">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profil
          </Link>
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Fitur Manajemen Profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Fitur ini sedang dalam tahap pengembangan dan akan segera hadir dengan:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>View profil lengkap dengan semua data dari onboarding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Edit data pribadi, pendidikan, dan pengalaman kerja</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Upload dan update CV, ijazah, sertifikat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Manage skills dan bahasa yang dikuasai</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Profile completeness indicator dengan tips</span>
              </li>
            </ul>
            <div className="pt-4">
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Data Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              NIK, nama lengkap, tempat/tanggal lahir, alamat, kontak
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Pendidikan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Jenjang, institusi, jurusan, tahun lulus, IPK
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              Keahlian & Pengalaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Skills, bahasa, riwayat pekerjaan
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Dokumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              CV, KTP, ijazah, sertifikat
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
