import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Briefcase, Clock } from 'lucide-react'

export default async function CandidateJobsPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Cari Lowongan</h1>
        <p className="mt-2 text-muted-foreground">
          Temukan pekerjaan yang sesuai dengan keahlian Anda
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Fitur Pencarian Lowongan
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
                <span>Search bar dengan filter lokasi, kategori, dan tipe pekerjaan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Job cards dengan informasi lengkap perusahaan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Sort berdasarkan tanggal posting, gaji, dan relevansi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Quick apply untuk lowongan yang tersedia</span>
              </li>
            </ul>
            <div className="pt-4">
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Mock Jobs */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="opacity-50">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Frontend Developer</h3>
                  <p className="text-sm text-muted-foreground">PT Tech Indonesia</p>
                </div>
                <Badge variant="outline">Full Time</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Bandung
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  2-3 tahun
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  2 hari lalu
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                Mencari frontend developer berpengalaman dengan React dan TypeScript...
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Staff Administrasi</h3>
                  <p className="text-sm text-muted-foreground">CV Maju Jaya</p>
                </div>
                <Badge variant="outline">Full Time</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Jakarta
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  Fresh Graduate
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  5 hari lalu
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                Dibutuhkan staff administrasi untuk menangani dokumen dan data entry...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
