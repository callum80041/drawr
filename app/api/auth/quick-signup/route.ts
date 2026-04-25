import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, createServerClient } from '@/lib/supabase/server'

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

    // Generate a recovery link to establish session
    const { data: linkData, error: linkError } = await service.auth.admin.generateLink({
      type: 'recovery',
      email: email.toLowerCase(),
    })

    if (linkError || !linkData?.properties?.recovery_token) {
      return NextResponse.json(
        { error: 'Failed to generate session' },
        { status: 400 }
      )
    }

    // Exchange recovery token for session
    const supabase = await createServerClient()
    const { data: sessionData, error: sessionError } = await supabase.auth.verifyOtp({
      email: email.toLowerCase(),
      token: linkData.properties.recovery_token,
      type: 'recovery',
    })

    if (sessionError || !sessionData.session) {
      return NextResponse.json(
        { error: 'Failed to establish session' },
        { status: 400 }
      )
    }

    // Set session cookies in response
    const response = NextResponse.json({ success: true })

    if (sessionData.session.access_token) {
      response.cookies.set('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL!.split('//')[1].split('.')[0] + '-auth-token', JSON.stringify({
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        expires_at: sessionData.session.expires_at,
        expires_in: sessionData.session.expires_in,
        token_type: sessionData.session.token_type,
        user: sessionData.user,
      }), {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
      })
    }

    return response
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
