import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Email Terverifikasi',
  description: 'Email Anda telah berhasil diverifikasi',
}

export default function EmailConfirmedPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Email Terverifikasi!</CardTitle>
          <CardDescription>
            Email Anda telah berhasil diverifikasi. Silakan login untuk melanjutkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/login">Login Sekarang</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
