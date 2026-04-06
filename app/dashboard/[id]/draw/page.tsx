import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DrawClient } from '@/components/dashboard/DrawClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function DrawPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch sweepstake (layout already validated ownership)
  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, assignment_mode, draw_completed_at, tournament_id, status')
    .eq('id', id)
    .single()

  if (!sweepstake) notFound()

  const tournamentId = sweepstake.tournament_id ?? 1

  // Fetch participants, teams, existing assignments in parallel
  const [participantsRes, teamsRes, assignmentsRes] = await Promise.all([
    supabase
      .from('participants')
      .select('id, name')
      .eq('sweepstake_id', id)
      .order('created_at'),
    supabase
      .from('teams')
      .select('id, name, flag, logo_url, group_name')
      .eq('tournament_id', tournamentId)
      .order('name'),
    supabase
      .from('assignments')
      .select('id, participant_id, team_id, team_name, team_flag')
      .eq('sweepstake_id', id),
  ])

  return (
    <DrawClient
      sweepstakeId={id}
      assignmentMode={sweepstake.assignment_mode}
      drawCompletedAt={sweepstake.draw_completed_at}
      participants={participantsRes.data ?? []}
      teams={teamsRes.data ?? []}
      initialAssignments={assignmentsRes.data ?? []}
    />
  )
}
