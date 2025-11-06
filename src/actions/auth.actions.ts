'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { UserRole } from '@/types/database.types'

type ActionResponse<T = void> = {
  success: boolean
  message?: string
  data?: T
  error?: string
}

/**
 * Sign up with email and password
 */
export async function signUp(formData: {
  email: string
  password: string
  fullName: string
  role: UserRole
}): Promise<ActionResponse<{ userId: string }>> {
  try {
    const supabase = await createClient()

    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/login`,
        data: {
          full_name: formData.fullName,
          role: formData.role,
        },
      },
    })

    if (authError) {
      return {
        success: false,
        error: authError.message,
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Gagal membuat akun',
      }
    }

    // Note: Profile will be created in the callback handler after email confirmation
    // This is because RLS policies require authenticated user

    return {
      success: true,
      message: 'Registrasi berhasil! Silakan cek email untuk verifikasi.',
      data: { userId: authData.user.id },
    }
  } catch (error) {
    console.error('Signup error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat registrasi',
    }
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(formData: {
  email: string
  password: string
}): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      return {
        success: false,
        error: error.message === 'Invalid login credentials'
          ? 'Email atau password salah'
          : error.message,
      }
    }

    revalidatePath('/', 'layout')
    return {
      success: true,
      message: 'Login berhasil',
    }
  } catch (error) {
    console.error('Signin error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat login',
    }
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<ActionResponse<{ url: string }>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: { url: data.url },
    }
  } catch (error) {
    console.error('Google signin error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat login dengan Google',
    }
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    revalidatePath('/', 'layout')
    return {
      success: true,
      message: 'Logout berhasil',
    }
  } catch (error) {
    console.error('Signout error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat logout',
    }
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      ...user,
      profile,
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Email reset password telah dikirim. Silakan cek inbox Anda.',
    }
  } catch (error) {
    console.error('Password reset error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat mengirim email reset password',
    }
  }
}

/**
 * Update password
 */
export async function updatePassword(
  newPassword: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Password berhasil diubah',
    }
  } catch (error) {
    console.error('Update password error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat mengubah password',
    }
  }
}

/**
 * Set user role (called after OAuth login if no profile exists)
 */
export async function setUserRole(role: UserRole): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'User tidak ditemukan',
      }
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      return {
        success: false,
        error: 'Profile sudah ada',
      }
    }

    // Create profile
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        role,
        full_name: user.user_metadata.full_name || user.email?.split('@')[0] || '',
        onboarding_completed: false,
      })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    revalidatePath('/', 'layout')
    return {
      success: true,
      message: 'Role berhasil ditentukan',
    }
  } catch (error) {
    console.error('Set user role error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat menentukan role',
    }
  }
}

/**
 * Check if user has completed onboarding
 */
export async function checkOnboardingStatus(): Promise<{
  completed: boolean
  role: UserRole | null
}> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { completed: false, role: null }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed, role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return { completed: false, role: null }
    }

    return {
      completed: profile.onboarding_completed,
      role: profile.role,
    }
  } catch (error) {
    console.error('Check onboarding status error:', error)
    return { completed: false, role: null }
  }
}
