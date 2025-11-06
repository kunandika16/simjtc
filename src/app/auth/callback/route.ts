import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const type = searchParams.get('type') // email confirmation or OAuth

  if (code) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, onboarding_completed, role')
        .eq('id', data.user.id)
        .single()

      // If no profile, create one from user_metadata (email signup) or redirect to role selection (OAuth)
      if (!profile) {
        const userRole = data.user.user_metadata?.role
        const userFullName = data.user.user_metadata?.full_name

        // If we have role in metadata, this is from email signup - create profile
        if (userRole && userFullName) {
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              role: userRole,
              full_name: userFullName,
              onboarding_completed: false,
            })

          if (createError) {
            console.error('Profile creation error:', createError)
            return NextResponse.redirect(`${origin}/auth/error`)
          }

          // For email confirmation, sign out and redirect to confirmed page
          // User will need to sign in again to access their account
          await supabase.auth.signOut()
          return NextResponse.redirect(`${origin}/auth/confirmed`)
        } else {
          // No role in metadata, this is OAuth signup - redirect to role selection
          return NextResponse.redirect(`${origin}/join?oauth=true`)
        }
      }

      // If profile exists but onboarding not completed, redirect to onboarding
      if (!profile.onboarding_completed) {
        return NextResponse.redirect(
          `${origin}/onboarding/${profile.role}`
        )
      }

      // Otherwise redirect to dashboard or custom next URL
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
