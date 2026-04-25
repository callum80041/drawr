import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

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

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
