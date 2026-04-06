import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { token, name, email, website } = await req.json()

  // Honeypot — bots fill this in, humans don't
  if (website) {
    // Silently pretend it worked
    return NextResponse.json({ ok: true, participant: { id: 'x', name, email }, sweepstake: { name: '', entryFee: 0 } })
  }

  if (!token || !name?.trim()) {
    return NextResponse.json({ error: 'Missing token or name' }, { status: 400 })
  }

  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email is required to verify your entry.' }, { status: 400 })
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
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

  // Check for duplicate email in this sweepstake
  const { count: dupeCount } = await supabase
    .from('participants')
    .select('*', { count: 'exact', head: true })
    .eq('sweepstake_id', sweepstake.id)
    .eq('email', email.trim().toLowerCase())

  if ((dupeCount ?? 0) > 0) {
    return NextResponse.json({ error: 'That email address has already been used to join this sweepstake.' }, { status: 400 })
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
      email: email.trim().toLowerCase(),
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
