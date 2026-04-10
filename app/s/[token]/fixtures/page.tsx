import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { FixtureList } from '@/components/participant/FixtureList'

interface Props {
  params: Promise<{ token: string }>
}

export const revalidate = 300 // refresh every 5 minutes

export default async function FixturesPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, tournament_id, sweepstake_type')
    .eq('share_token', token)
    .single()

  if (!sweepstake) notFound()
  if (sweepstake.sweepstake_type === 'eurovision') notFound()

  const [matchesRes, assignmentsRes] = await Promise.all([
    supabase
      .from('matches')
      .select(`
        id, round, kickoff, status, venue, venue_city,
        home_team_id, home_team_name, home_score,
        away_team_id, away_team_name, away_score
      `)
      .eq('tournament_id', sweepstake.tournament_id ?? 1)
      .order('kickoff', { ascending: true }),
    supabase
      .from('assignments')
      .select('team_id, participants(name)')
      .eq('sweepstake_id', sweepstake.id),
  ])

  const matches = matchesRes.data ?? []

  // team_id → participant name (Supabase returns joined row as array or object)
  const teamParticipant: Record<number, string> = {}
  for (const a of assignmentsRes.data ?? []) {
    const raw = a.participants as unknown
    const participant = Array.isArray(raw) ? (raw[0] as { name: string } | undefined) : (raw as { name: string } | null)
    if (participant?.name) teamParticipant[a.team_id] = participant.name
  }

  // Fetch team flags and logos
  const teamIds = [...new Set([
    ...matches.map(m => m.home_team_id).filter(Boolean),
    ...matches.map(m => m.away_team_id).filter(Boolean),
  ])] as number[]

  const { data: teams } = teamIds.length > 0
    ? await supabase.from('teams').select('id, flag, logo_url').in('id', teamIds)
    : { data: [] }

  const teamMap = Object.fromEntries((teams ?? []).map(t => [t.id, t]))

  const enriched = matches.map(m => ({
    ...m,
    home_flag:        m.home_team_id ? teamMap[m.home_team_id]?.flag ?? null : null,
    home_logo:        m.home_team_id ? teamMap[m.home_team_id]?.logo_url ?? null : null,
    away_flag:        m.away_team_id ? teamMap[m.away_team_id]?.flag ?? null : null,
    away_logo:        m.away_team_id ? teamMap[m.away_team_id]?.logo_url ?? null : null,
    home_participant: m.home_team_id ? (teamParticipant[m.home_team_id] ?? null) : null,
    away_participant: m.away_team_id ? (teamParticipant[m.away_team_id] ?? null) : null,
  }))

  return <FixtureList matches={enriched} />
}
