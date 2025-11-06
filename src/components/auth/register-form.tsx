'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { signUp, signInWithGoogle } from '@/actions/auth.actions'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import type { UserRole } from '@/types/database.types'
import Link from 'next/link'

interface RegisterFormProps {
  role: UserRole
}

export function RegisterForm({ role }: RegisterFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role,
    },
  })

  const onSubmit = async (data: RegisterInput) => {
    if (!agreedToTerms) {
      toast.error('Anda harus menyetujui syarat dan ketentuan')
      return
    }

    setIsLoading(true)

    try {
      const result = await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: data.role,
      })

      if (result.success) {
        toast.success(result.message)
        // Redirect to onboarding
        router.push(`/onboarding/${role}`)
      } else {
        toast.error(result.error || 'Terjadi kesalahan saat mendaftar')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mendaftar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    if (!agreedToTerms) {
      toast.error('Anda harus menyetujui syarat dan ketentuan')
      return
    }

    setIsGoogleLoading(true)

    try {
      const result = await signInWithGoogle()

      if (result.success && result.data?.url) {
        // Store intended role in sessionStorage for OAuth callback
        sessionStorage.setItem('intended_role', role)
        window.location.href = result.data.url
      } else {
        const errorMessage = result.error || 'Terjadi kesalahan saat mendaftar dengan Google'

        // Check if Google provider is not enabled
        if (errorMessage.includes('provider') || errorMessage.includes('not enabled')) {
          toast.error('Google OAuth belum diaktifkan. Silakan daftar dengan email/password.')
        } else {
          toast.error(errorMessage)
        }
        setIsGoogleLoading(false)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mendaftar dengan Google')
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('role')} value={role} />

        <div className="space-y-2">
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Nama lengkap Anda"
            autoComplete="name"
            disabled={isLoading}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isLoading}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Minimal 8 karakter
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isLoading}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Saya menyetujui{' '}
            <Link href="/terms" className="text-primary hover:underline">
              syarat dan ketentuan
            </Link>{' '}
            serta{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              kebijakan privasi
            </Link>
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !agreedToTerms}>
          {isLoading ? 'Memproses...' : 'Daftar'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Atau daftar dengan
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignUp}
        disabled={isGoogleLoading || !agreedToTerms}
      >
        <svg
          className="mr-2 h-4 w-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          />
        </svg>
        {isGoogleLoading ? 'Memproses...' : 'Daftar dengan Google'}
      </Button>
    </div>
  )
}
