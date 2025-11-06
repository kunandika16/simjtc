import { Metadata } from 'next'
import Link from 'next/link'
import { RoleSelection } from '@/components/auth/role-selection'

export const metadata: Metadata = {
  title: 'Bergabung',
  description: 'Pilih peran Anda untuk bergabung dengan SIM P2TK Jawa Barat',
}

type SearchParams = Promise<{ oauth?: string }>

export default async function JoinPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const isOAuth = params.oauth === 'true'

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {isOAuth ? 'Pilih Peran Anda' : 'Bergabung dengan SIM P2TK Jawa Barat'}
          </h1>
          <p className="text-muted-foreground">
            {isOAuth
              ? 'Untuk melanjutkan, silakan pilih peran Anda'
              : 'Pilih peran Anda untuk memulai'}
          </p>
        </div>

        <RoleSelection isOAuth={isOAuth} />

        {!isOAuth && (
          <div className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
              Masuk di sini
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
