import { Metadata } from 'next'
import Link from 'next/link'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Lupa Password',
  description: 'Reset password akun Anda',
}

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Lupa Password?</CardTitle>
          <CardDescription>
            Masukkan email Anda dan kami akan mengirimkan link reset password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />

          <div className="mt-4 text-center text-sm">
            Ingat password Anda?{' '}
            <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
              Masuk di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
