import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { sweepstakeCreatedEmailHtml } from '@/lib/email/templates/sweepstake-created'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sweepstakeId } = await req.json()
  if (!sweepstakeId) return NextResponse.json({ error: 'Missing sweepstakeId' }, { status: 400 })

  // Fetch sweepstake + organiser (RLS ensures the user owns it)
  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name, share_token, organiser_id, sweepstake_type')
    .eq('id', sweepstakeId)
    .single()

  if (!sweepstake) return NextResponse.json({ error: 'Sweepstake not found' }, { status: 404 })

  const { data: organiser } = await supabase
    .from('organisers')
    .select('name, email')
    .eq('id', sweepstake.organiser_id)
    .single()

  if (!organiser?.email) return NextResponse.json({ error: 'Organiser email not found' }, { status: 400 })

  await sendEmail({
    to: organiser.email,
    subject: `Your sweepstake "${sweepstake.name}" is ready to share`,
    html: sweepstakeCreatedEmailHtml({
      organiserName: organiser.name,
      sweepstakeName: sweepstake.name,
      joinLink: `${APP_URL}/join/${sweepstake.share_token}`,
      leaderboardLink: `${APP_URL}/s/${sweepstake.share_token}`,
      isEurovision: sweepstake.sweepstake_type === 'eurovision',
    }),
  })

  return NextResponse.json({ ok: true })
}
