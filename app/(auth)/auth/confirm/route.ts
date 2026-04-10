import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type       = searchParams.get('type') as EmailOtpType | null
  const next       = searchParams.get('next') ?? '/dashboard'

  if (token_hash && type) {
    // Build redirect response FIRST so session cookies can be written onto it
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
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const metaName = user.user_metadata?.name as string | undefined
        try {
          const { createServiceClient } = await import('@/lib/supabase/server')
          const service = await createServiceClient()
          await service
            .from('organisers')
            .update({
              last_login_at: new Date().toISOString(),
              ...(metaName ? { name: metaName } : {}),
            })
            .eq('user_id', user.id)
        } catch {
          // Non-critical
        }
      }
      return response
    }
  }

  return NextResponse.redirect(`${origin}/login?error=link_expired`)
}
