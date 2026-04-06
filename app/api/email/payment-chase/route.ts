import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { paymentChaseEmailHtml } from '@/lib/email/templates/payment-chase'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { participantId, sweepstakeId, sendToAll } = await req.json()
  if (!sweepstakeId) {
    return NextResponse.json({ error: 'Missing sweepstakeId' }, { status: 400 })
  }

  // Verify the organiser owns this sweepstake and fetch details
  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name, share_token, organiser_id, entry_fee')
    .eq('id', sweepstakeId)
    .single()

  if (!sweepstake || sweepstake.organiser_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Get organiser name
  const { data: organiser } = await supabase
    .from('organisers')
    .select('name')
    .eq('user_id', user.id)
    .single()

  const organiserName = organiser?.name ?? 'Your organiser'

  const emailArgs = {
    sweepstakeName: sweepstake.name,
    organiserName,
    entryFee: Number(sweepstake.entry_fee ?? 0),
    shareToken: sweepstake.share_token,
  }

  if (sendToAll) {
    // Send to all unpaid participants who have an email
    const { data: participants } = await supabase
      .from('participants')
      .select('id, name, email')
      .eq('sweepstake_id', sweepstakeId)
      .eq('paid', false)
      .not('email', 'is', null)

    if (!participants?.length) {
      return NextResponse.json({ ok: true, sent: 0, message: 'No unpaid participants with emails' })
    }

    const results = await Promise.allSettled(
      participants.map(p =>
        sendEmail({
          to: p.email!,
          subject: `Quick reminder — ${sweepstake.name} entry fee`,
          html: paymentChaseEmailHtml({ participantName: p.name, ...emailArgs }),
        })
      )
    )

    const sent = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length
    return NextResponse.json({ ok: true, sent, failed })
  }

  // Single participant
  if (!participantId) {
    return NextResponse.json({ error: 'Missing participantId' }, { status: 400 })
  }

  const { data: participant } = await supabase
    .from('participants')
    .select('id, name, email, paid')
    .eq('id', participantId)
    .eq('sweepstake_id', sweepstakeId)
    .single()

  if (!participant?.email) {
    return NextResponse.json({ error: 'Participant has no email' }, { status: 400 })
  }

  if (participant.paid) {
    return NextResponse.json({ error: 'Participant has already paid' }, { status: 400 })
  }

  await sendEmail({
    to: participant.email,
    subject: `Quick reminder — ${sweepstake.name} entry fee`,
    html: paymentChaseEmailHtml({ participantName: participant.name, ...emailArgs }),
  })

  return NextResponse.json({ ok: true, sent: 1 })
}
