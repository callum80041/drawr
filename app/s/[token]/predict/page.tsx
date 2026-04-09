import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PredictClient } from '@/components/participant/PredictClient'

interface Props {
  params: Promise<{ token: string }>
}

export default async function PredictPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, tournament_id')
    .eq('share_token', token)
    .single()

  if (!sweepstake) notFound()

  const tournamentId = sweepstake.tournament_id ?? 1

  const { data: teamsData } = await supabase
    .from('teams')
    .select('id, name, flag, group_name')
    .eq('tournament_id', tournamentId)
    .not('group_name', 'is', null)
    .order('group_name', { ascending: true })
    .order('name', { ascending: true })

  const teams = teamsData ?? []

  // Build groups map
  const groupMap = new Map<string, { id: number; name: string; flag: string | null }[]>()
  for (const t of teams) {
    const g = t.group_name as string
    if (!groupMap.has(g)) groupMap.set(g, [])
    groupMap.get(g)!.push({ id: t.id, name: t.name, flag: t.flag ?? null })
  }

  const groups = Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, teams]) => ({ name, teams }))

  return (
    <PredictClient
      sweepstakeId={sweepstake.id}
      groups={groups}
    />
  )
}
