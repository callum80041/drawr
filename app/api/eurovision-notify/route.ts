import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { email, name } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  const { error } = await supabase
    .from('eurovision_notify')
    .upsert(
      { email: email.trim().toLowerCase(), name: name?.trim() || null },
      { onConflict: 'email', ignoreDuplicates: true }
    )

  if (error) {
    console.error('eurovision_notify upsert error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
