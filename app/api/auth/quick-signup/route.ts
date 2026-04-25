import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createServerClient as createSSRClient } from '@supabase/ssr'
import { setupGuideEmailHtml } from '@/lib/email/templates/setup-guide'
import { sendEmail } from '@/lib/email'

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

    // Note: organiser record is created automatically by a DB trigger on user creation.

    // Send setup guide email to new organiser (non-blocking)
    try {
      const firstName = data.user.user_metadata?.name?.split(' ')[0] ?? 'there'
      await sendEmail({
        to: email.toLowerCase(),
        subject: 'How to set up your World Cup sweepstake',
        html: setupGuideEmailHtml({ name: firstName }),
        template: 'setup-guide-signup',
      })
    } catch {
      // Don't block signup if email fails
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

    if (linkError || !linkData?.properties?.email_otp) {
      return NextResponse.json(
        { error: 'Failed to generate session token' },
        { status: 400 }
      )
    }

    // Verify OTP to establish session (sets session cookies via the client)
    const { error: sessionError } = await supabase.auth.verifyOtp({
      email: email.toLowerCase(),
      token: linkData.properties.email_otp,
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
