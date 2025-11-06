import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { RegisterForm } from '@/components/auth/register-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROLE_LABELS } from '@/lib/constants'
import type { UserRole } from '@/types/database.types'

export const metadata: Metadata = {
  title: 'Daftar',
  description: 'Buat akun baru',
}

type SearchParams = Promise<{ role?: string }>

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const role = params.role as UserRole

  // Validate role
  if (!role || !['candidate', 'institution', 'employer'].includes(role)) {
    redirect('/join')
  }

  const roleLabel = ROLE_LABELS[role]

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Daftar sebagai {roleLabel}</CardTitle>
          <CardDescription>
            Buat akun untuk bergabung dengan SIM P2TK Jawa Barat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm role={role} />

          <div className="mt-4 text-center text-sm">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
              Masuk di sini
            </Link>
          </div>

          <div className="mt-2 text-center text-sm">
            <Link href="/join" className="text-muted-foreground underline-offset-4 hover:underline">
              ← Pilih peran lain
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
