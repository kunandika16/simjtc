'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { sendPasswordResetEmail } from '@/actions/auth.actions'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth'

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)

    try {
      const result = await sendPasswordResetEmail(data.email)

      if (result.success) {
        toast.success(result.message)
        setEmailSent(true)
      } else {
        toast.error(result.error || 'Terjadi kesalahan saat mengirim email')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengirim email')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <p className="text-sm text-green-700 dark:text-green-400">
            Email reset password telah dikirim! Silakan cek inbox Anda dan ikuti instruksi
            untuk mereset password.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Tidak menerima email? Periksa folder spam atau coba kirim ulang dalam beberapa menit.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="nama@email.com"
          autoComplete="email"
          disabled={isLoading}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Mengirim...' : 'Kirim Link Reset Password'}
      </Button>
    </form>
  )
}
