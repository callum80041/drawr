import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ParticipantsClient } from './ParticipantsClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ParticipantsPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: organiser } = await supabase
    .from('organisers')
    .select('id, name, email')
    .eq('user_id', user.id)
    .single()

  if (!organiser) redirect('/dashboard')

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, plan, entry_fee, organiser_id')
    .eq('id', id)
    .single()

  if (!sweepstake || sweepstake.organiser_id !== organiser.id) notFound()

  const [{ data: participants }, waitlistResult] = await Promise.all([
    supabase
      .from('participants')
      .select('id, name, email, paid')
      .eq('sweepstake_id', id)
      .order('created_at', { ascending: true }),
    supabase
      .from('waitlist')
      .select('id, name, email, created_at')
      .eq('sweepstake_id', id)
      .order('created_at', { ascending: true }),
  ])
  // waitlist table may not exist yet if migration hasn't been run
  const waitlist = waitlistResult.error ? [] : (waitlistResult.data ?? [])

  return (
    <ParticipantsClient
      sweepstakeId={id}
      plan={sweepstake.plan}
      entryFee={Number(sweepstake.entry_fee)}
      initialParticipants={participants ?? []}
      initialWaitlist={waitlist ?? []}
      organiserName={organiser?.name ?? ''}
      organiserEmail={organiser?.email ?? ''}
    />
  )
}
