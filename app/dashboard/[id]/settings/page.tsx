import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsClient } from './SettingsClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SettingsPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: organiser } = await supabase
    .from('organisers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!organiser) redirect('/dashboard')

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name, status, entry_fee, assignment_mode, prize_type, payout_structure, image_url')
    .eq('id', id)
    .eq('organiser_id', organiser.id)
    .single()

  if (!sweepstake) notFound()

  const { count: assignmentCount } = await supabase
    .from('assignments')
    .select('*', { count: 'exact', head: true })
    .eq('sweepstake_id', id)

  return (
    <SettingsClient
      sweepstakeId={id}
      initialName={sweepstake.name}
      initialEntryFee={Number(sweepstake.entry_fee ?? 0)}
      initialMode={sweepstake.assignment_mode ?? 'random'}
      initialPrizeType={sweepstake.prize_type ?? 'money'}
      initialPayoutStructure={sweepstake.payout_structure ?? 'winner'}
      initialImageUrl={sweepstake.image_url ?? null}
      drawDone={(assignmentCount ?? 0) > 0}
      status={sweepstake.status}
    />
  )
}
