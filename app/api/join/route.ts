import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { participantJoinedEmailHtml } from '@/lib/email/templates/participant-joined'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

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

  // Use anon client for public reads, service client for the privileged insert
  const supabase = await createClient()
  const service = await createServiceClient()

  // Look up sweepstake by share token (public_read RLS allows this)
  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name, status, entry_fee, plan, organiser_id')
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

  // Free plan cap — if full, add to waitlist instead of blocking
  if (sweepstake.plan === 'free') {
    const { count } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('sweepstake_id', sweepstake.id)

    if ((count ?? 0) >= 48) {
      // Check not already on waitlist
      const { count: wCount } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('sweepstake_id', sweepstake.id)
        .eq('email', email.trim().toLowerCase())

      if ((wCount ?? 0) > 0) {
        return NextResponse.json({ error: 'You\'re already on the reserve list for this sweepstake.' }, { status: 400 })
      }

      const { data: waitlistEntry, error: wErr } = await service
        .from('waitlist')
        .insert({
          sweepstake_id: sweepstake.id,
          name: name.trim(),
          email: email.trim().toLowerCase(),
        })
        .select('id, name, email')
        .single()

      if (wErr || !waitlistEntry) {
        return NextResponse.json({ error: 'Failed to join reserve list. Please try again.' }, { status: 500 })
      }

      return NextResponse.json({
        ok: true,
        waitlisted: true,
        participant: { name: waitlistEntry.name },
        sweepstake: { name: sweepstake.name, entryFee: Number(sweepstake.entry_fee ?? 0) },
      })
    }
  }

  // INSERT via service client — anon role has no INSERT policy on participants
  const { data: participant, error: insertError } = await service
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

  // Fire organiser notification (non-blocking — don't fail the join if email errors)
  ;(async () => {
    try {
      // Get organiser email (RLS blocks anon client, service client bypasses it)
      const { data: organiser } = await service
        .from('organisers')
        .select('name, email')
        .eq('id', sweepstake.organiser_id)
        .single()

      if (!organiser?.email) return

      // Get fresh participant count
      const { count } = await service
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('sweepstake_id', sweepstake.id)

      await sendEmail({
        to: organiser.email,
        subject: `${participant.name} just joined ${sweepstake.name}`,
        html: participantJoinedEmailHtml({
          organiserName: organiser.name,
          participantName: participant.name,
          sweepstakeName: sweepstake.name,
          participantCount: count ?? 1,
          dashboardUrl: `${APP_URL}/dashboard/${sweepstake.id}/participants`,
        }),
      })
    } catch {
      // Best-effort — never block the join response
    }
  })()

  return NextResponse.json({
    ok: true,
    participant,
    sweepstake: {
      name: sweepstake.name,
      entryFee: Number(sweepstake.entry_fee ?? 0),
    },
  })
}
