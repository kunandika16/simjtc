import { z } from 'zod'

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Register Schema
export const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
    role: z.enum(['candidate', 'institution', 'employer'], {
      message: 'Pilih role terlebih dahulu',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>

// Phone OTP Schema
export const phoneOTPSchema = z.object({
  phone: z.string().regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid'),
})

export type PhoneOTPInput = z.infer<typeof phoneOTPSchema>

// Verify OTP Schema
export const verifyOTPSchema = z.object({
  phone: z.string(),
  otp: z.string().length(6, 'OTP harus 6 digit'),
})

export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
