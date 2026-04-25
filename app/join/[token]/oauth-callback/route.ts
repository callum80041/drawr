import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const provider = searchParams.get('provider')

  if (!code || !provider) {
    return NextResponse.redirect(`${origin}/join/${token}?error=oauth_failed`)
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {
          // Don't persist session for participants
        },
      },
    }
  )

  try {
    // Exchange code for session
    const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError || !data.user) {
      return NextResponse.redirect(`${origin}/join/${token}?error=oauth_failed`)
    }

    // Extract email and name from OAuth user
    const email = data.user.email || ''
    const name = data.user.user_metadata?.name || data.user.user_metadata?.full_name || ''

    // Sign out the user (participants don't need auth sessions)
    await supabase.auth.signOut()

    // Redirect back to join form with pre-filled data
    const params = new URLSearchParams({
      email,
      name,
      provider,
      signup_method: 'google',
    })

    return NextResponse.redirect(`${origin}/join/${token}?${params.toString()}`)
  } catch {
    return NextResponse.redirect(`${origin}/join/${token}?error=oauth_failed`)
  }
}
