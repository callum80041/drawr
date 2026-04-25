import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isSweepstakePro } from '@/lib/utils/pro'
import { sendEmail } from '@/lib/email'
import { waitlistPromotedEmailHtml } from '@/lib/email/templates/waitlist-promoted'

const FREE_PLAN_CAP = 48
const PRO_PLAN_CAP = 200

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

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name, share_token, entry_fee, plan, sweepstake_type, is_pro, pro_expires_at')
    .eq('id', sweepstakeId)
    .eq('organiser_id', organiser.id)
    .single()

  if (!sweepstake) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const service = await createServiceClient()

  // Fetch the waitlist entry
  const { data: entry } = await service
    .from('waitlist')
    .select('id, name, email')
    .eq('id', waitlistId)
    .eq('sweepstake_id', sweepstakeId)
    .single()

  if (!entry) return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 })

  // Guard: re-check capacity
  const cap = isSweepstakePro(sweepstake) ? PRO_PLAN_CAP : FREE_PLAN_CAP
  const { count } = await service
    .from('participants')
    .select('*', { count: 'exact', head: true })
    .eq('sweepstake_id', sweepstakeId)

  if ((count ?? 0) >= cap) {
    return NextResponse.json({ error: 'Sweepstake is full' }, { status: 400 })
  }

  // Insert into participants
  const { data: participant, error: insertError } = await service
    .from('participants')
    .insert({
      sweepstake_id: sweepstakeId,
      name: entry.name,
      email: entry.email,
      paid: false,
    })
    .select('id, name, email, paid')
    .single()

  if (insertError || !participant) {
    return NextResponse.json({ error: 'Failed to promote' }, { status: 500 })
  }

  // Delete from waitlist
  await service.from('waitlist').delete().eq('id', waitlistId)

  // Email notification (non-blocking)
  ;(async () => {
    try {
      await sendEmail({
        to: entry.email,
        subject: `You're in — ${sweepstake.name}`,
        html: waitlistPromotedEmailHtml({
          name: entry.name,
          sweepstakeName: sweepstake.name,
          shareToken: sweepstake.share_token,
          entryFee: Number(sweepstake.entry_fee ?? 0),
          isEurovision: sweepstake.sweepstake_type === 'eurovision',
        }),
      })
    } catch { /* best-effort */ }
  })()

  return NextResponse.json({ ok: true, participant })
}
