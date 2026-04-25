import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Build the redirect response FIRST — so we can write session cookies onto it.
  // If we create the redirect after exchangeCodeForSession, the Set-Cookie headers
  // are lost and the middleware bounces the user straight back to /login.
  const response = NextResponse.redirect(`${origin}${next}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write to request (so subsequent reads in this handler work)
          // AND to the response (so the browser actually receives the session cookies)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Handle code exchange (from signup confirmation or password reset)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
    }
  }

  // At this point, session should be established (either from code exchange or magic link)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
  }

  const metaName = user.user_metadata?.name as string | undefined

  // Use service role here to bypass RLS — the user's own row may not be readable
  // via the anon/user client until the session is fully established
  try {
    const { createServiceClient } = await import('@/lib/supabase/server')
    const service = await createServiceClient()

    const { data: organiser } = await service
      .from('organisers')
      .select('last_login_at')
      .eq('user_id', user.id)
      .single()

    await service
      .from('organisers')
      .update({
        last_login_at: new Date().toISOString(),
        ...(metaName ? { name: metaName } : {}),
      })
      .eq('user_id', user.id)

    // First-ever login — send to name/password capture
    if (!organiser?.last_login_at) {
      response.headers.set('location', `${origin}/welcome`)
    }
  } catch {
    // Non-critical — don't block the redirect if this fails
  }

  return response
}
