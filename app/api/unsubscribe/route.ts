import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const pid = req.nextUrl.searchParams.get('pid')
  const token = req.nextUrl.searchParams.get('token')

  if (!pid || !token) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  // Verify HMAC
  const secret = process.env.RESEND_API_KEY
  if (!secret) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  const expectedToken = crypto
    .createHmac('sha256', secret)
    .update(pid)
    .digest('hex')

  if (token !== expectedToken) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  }

  // Update participant
  const supabase = await createServiceClient()
  const { error } = await supabase
    .from('participants')
    .update({ notify_enabled: false })
    .eq('id', pid)

  if (error) {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, message: 'You have been unsubscribed from notifications' })
}
