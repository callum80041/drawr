import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSweepstakePro } from '@/lib/utils/pro'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('is_pro, pro_expires_at')
    .eq('share_token', token)
    .single()

  if (!sweepstake) {
    return NextResponse.json({ error: 'Sweepstake not found' }, { status: 404 })
  }

  return NextResponse.json({
    isPro: isSweepstakePro(sweepstake),
  })
}
