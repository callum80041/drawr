import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { waitlistId, sweepstakeId } = await req.json()
  if (!waitlistId || !sweepstakeId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data: organiser } = await supabase
    .from('organisers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!organiser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Verify organiser owns this sweepstake
  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id')
    .eq('id', sweepstakeId)
    .eq('organiser_id', organiser.id)
    .single()

  if (!sweepstake) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const service = await createServiceClient()
  await service.from('waitlist').delete().eq('id', waitlistId).eq('sweepstake_id', sweepstakeId)

  return NextResponse.json({ ok: true })
}
