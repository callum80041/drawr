import { notFound } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { PredictClient } from '@/components/participant/PredictClient'

interface Props {
  params: Promise<{ token: string }>
}

export default async function PredictPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()
  const service = await createServiceClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, tournament_id, sweepstake_type')
    .eq('share_token', token)
    .single()

  if (!sweepstake) notFound()

  // Predict is World Cup only
  if (sweepstake.sweepstake_type === 'eurovision') notFound()

  const tournamentId = sweepstake.tournament_id ?? 1

  // If the user is logged in, try to auto-match them as a participant
  const { data: { user } } = await supabase.auth.getUser()

  let initialParticipant: { id: string; name: string } | null = null
  let initialPicks: Record<string, { teamId: number; teamName: string; teamFlag: string }> = {}

  if (user?.email) {
    const { data: participant } = await service
      .from('participants')
      .select('id, name')
      .eq('sweepstake_id', sweepstake.id)
      .ilike('email', user.email)
      .single()

    if (participant) {
      initialParticipant = { id: participant.id, name: participant.name }

      // Fetch any existing predictions
      const { data: existing } = await service
        .from('group_predictions')
        .select('group_name, predicted_team_id, predicted_team_name, predicted_team_flag')
        .eq('sweepstake_id', sweepstake.id)
        .eq('participant_id', participant.id)

      for (const p of existing ?? []) {
        initialPicks[p.group_name] = {
          teamId: p.predicted_team_id,
          teamName: p.predicted_team_name,
          teamFlag: p.predicted_team_flag ?? '',
        }
      }
    }
  }

  const { data: teamsData } = await supabase
    .from('teams')
    .select('id, name, flag, group_name')
    .eq('tournament_id', tournamentId)
    .not('group_name', 'is', null)
    .order('group_name', { ascending: true })
    .order('name', { ascending: true })

  const teams = teamsData ?? []

  // Build groups array sorted A–L
  const groupMap = new Map<string, { id: number; name: string; flag: string | null }[]>()
  for (const t of teams) {
    const g = t.group_name as string
    if (!groupMap.has(g)) groupMap.set(g, [])
    groupMap.get(g)!.push({ id: t.id, name: t.name, flag: t.flag ?? null })
  }

  const groups = Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, grpTeams]) => ({ name, teams: grpTeams }))

  return (
    <PredictClient
      sweepstakeId={sweepstake.id}
      groups={groups}
      initialParticipant={initialParticipant}
      initialPicks={initialPicks}
    />
  )
}
