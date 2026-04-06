import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { token, name, email } = await req.json()

  if (!token || !name?.trim()) {
    return NextResponse.json({ error: 'Missing token or name' }, { status: 400 })
  }

  const supabase = await createClient()

  // Look up sweepstake by share token
  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name, status, entry_fee, plan')
    .eq('share_token', token)
    .single()

  if (!sweepstake) {
    return NextResponse.json({ error: 'Sweepstake not found' }, { status: 404 })
  }

  if (sweepstake.status === 'complete') {
    return NextResponse.json({ error: 'This sweepstake is complete — no new entries.' }, { status: 400 })
  }

  // Free plan cap
  if (sweepstake.plan === 'free') {
    const { count } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('sweepstake_id', sweepstake.id)

    if ((count ?? 0) >= 48) {
      return NextResponse.json({ error: 'This sweepstake is full.' }, { status: 400 })
    }
  }

  const { data: participant, error: insertError } = await supabase
    .from('participants')
    .insert({
      sweepstake_id: sweepstake.id,
      name: name.trim(),
      email: email?.trim() || null,
      paid: false,
    })
    .select('id, name, email')
    .single()

  if (insertError || !participant) {
    return NextResponse.json({ error: 'Failed to join. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    participant,
    sweepstake: {
      name: sweepstake.name,
      entryFee: Number(sweepstake.entry_fee ?? 0),
    },
  })
}
