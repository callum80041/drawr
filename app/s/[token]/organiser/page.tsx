import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DemoOrganiserShell } from '@/components/participant/DemoOrganiserShell'

interface Props {
  params: Promise<{ token: string }>
}

export default async function DemoOrganiserPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name, share_token, status, entry_fee, prize_type, payout_structure, assignment_mode, draw_completed_at, tournament_name, plan')
    .eq('share_token', token)
    .single()

  if (!sweepstake) notFound()

  const [participantsRes, assignmentsRes, teamsRes] = await Promise.all([
    supabase
      .from('participants')
      .select('id, name, email, paid')
      .eq('sweepstake_id', sweepstake.id)
      .order('created_at'),
    supabase
      .from('assignments')
      .select('participant_id, team_id, team_name, team_flag')
      .eq('sweepstake_id', sweepstake.id),
    supabase
      .from('teams')
      .select('id, name, flag, group_name')
      .eq('tournament_id', 1)
      .order('name'),
  ])

  return (
    <DemoOrganiserShell
      sweepstake={sweepstake}
      participants={participantsRes.data ?? []}
      assignments={assignmentsRes.data ?? []}
      teams={teamsRes.data ?? []}
    />
  )
}
