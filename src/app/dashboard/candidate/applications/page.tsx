import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, CheckCircle, Clock, Calendar } from 'lucide-react'

export default async function CandidateApplicationsPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Lamaran Saya</h1>
        <p className="mt-2 text-muted-foreground">
          Lacak status semua lamaran pekerjaan Anda
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Fitur Tracking Lamaran
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
                <span>Filter lamaran berdasarkan status (Menunggu, Interview, Diterima, Ditolak)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Timeline perubahan status untuk setiap lamaran</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Detail interview (tanggal, waktu, lokasi)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Catatan dari employer dan feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Withdraw application untuk lamaran yang masih baru</span>
              </li>
            </ul>
            <div className="pt-4">
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Mock Applications */}
      <div className="space-y-4">
        <Card className="opacity-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Frontend Developer</h3>
                  <Badge variant="default">Interview</Badge>
                </div>
                <p className="text-sm text-muted-foreground">PT Tech Indonesia</p>
                <p className="text-xs text-muted-foreground">
                  Melamar 5 hari yang lalu
                </p>
                <div className="flex items-center gap-2 text-xs text-primary mt-2">
                  <Calendar className="h-3 w-3" />
                  <span>Interview: 10 Nov 2025, 10:00 WIB</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Staff Administrasi</h3>
                  <Badge variant="secondary">Menunggu</Badge>
                </div>
                <p className="text-sm text-muted-foreground">CV Maju Jaya</p>
                <p className="text-xs text-muted-foreground">
                  Melamar 2 minggu yang lalu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
