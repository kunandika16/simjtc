import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-destructive">
            Terjadi Kesalahan
          </CardTitle>
          <CardDescription>
            Maaf, terjadi kesalahan saat proses autentikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Silakan coba login kembali atau hubungi administrator jika masalah berlanjut.
          </p>

          <div className="flex gap-2">
            <Button asChild className="w-full">
              <Link href="/auth/login">Kembali ke Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Beranda</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
