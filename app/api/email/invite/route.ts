import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { inviteEmailHtml } from '@/lib/email/templates/invite'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { participantId, sweepstakeId } = await req.json()
  if (!participantId || !sweepstakeId) {
    return NextResponse.json({ error: 'Missing participantId or sweepstakeId' }, { status: 400 })
  }

  // Verify the organiser owns this sweepstake
  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name, share_token, organiser_id')
    .eq('id', sweepstakeId)
    .single()

  if (!sweepstake || sweepstake.organiser_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Get participant
  const { data: participant } = await supabase
    .from('participants')
    .select('id, name, email')
    .eq('id', participantId)
    .eq('sweepstake_id', sweepstakeId)
    .single()

  if (!participant?.email) {
    return NextResponse.json({ error: 'Participant has no email' }, { status: 400 })
  }

  await sendEmail({
    to: participant.email,
    subject: `You've been added to ${sweepstake.name}`,
    html: inviteEmailHtml({
      participantName: participant.name,
      sweepstakeName: sweepstake.name,
      shareToken: sweepstake.share_token,
    }),
  })

  return NextResponse.json({ ok: true })
}
