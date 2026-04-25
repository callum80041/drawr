import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createServerClient as createSSRClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const service = await createServiceClient()

    // Create user via service role (auto-confirmed, no password yet)
    const { data, error: createError } = await service.auth.admin.createUser({
      email: email.toLowerCase(),
      email_confirm: true,
      user_metadata: {},
    })

    if (createError || !data.user) {
      return NextResponse.json(
        { error: createError?.message || 'Failed to create user' },
        { status: 400 }
      )
    }

    // Create organiser record
    const { error: orgError } = await service
      .from('organisers')
      .insert({
        user_id: data.user.id,
        email: email.toLowerCase(),
        created_at: new Date().toISOString(),
      })

    if (orgError) {
      return NextResponse.json(
        { error: 'Failed to create organiser record' },
        { status: 400 }
      )
    }

    // Build response first to capture cookies
    const response = NextResponse.json({ success: true })

    // Create a Supabase client that will set cookies on the response
    const supabase = createSSRClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Generate recovery token and exchange for session
    const { data: linkData, error: linkError } = await service.auth.admin.generateLink({
      type: 'recovery',
      email: email.toLowerCase(),
    })

    if (linkError || !linkData?.properties?.recovery_token) {
      return NextResponse.json(
        { error: 'Failed to generate session token' },
        { status: 400 }
      )
    }

    // Verify OTP with recovery token (this will set session cookies via the client)
    const { error: sessionError } = await supabase.auth.verifyOtp({
      email: email.toLowerCase(),
      token: linkData.properties.recovery_token,
      type: 'recovery',
    })

    if (sessionError) {
      return NextResponse.json(
        { error: 'Failed to establish session' },
        { status: 400 }
      )
    }

    return response
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
