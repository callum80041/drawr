import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EurovisionResultsClient } from './EurovisionResultsClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ResultsPage({ params }: Props) {
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
    .select('id, name, sweepstake_type, tournament_id')
    .eq('id', id)
    .eq('organiser_id', organiser.id)
    .single()

  if (!sweepstake) notFound()
  if (sweepstake.sweepstake_type !== 'eurovision') notFound()

  // Fetch Eurovision countries for this sweepstake
  const { data: countries } = await supabase
    .from('teams')
    .select('id, name, flag, semi_final')
    .eq('tournament_id', sweepstake.tournament_id ?? 2)
    .order('semi_final', { ascending: true, nullsFirst: true })
    .order('name', { ascending: true })

  // Fetch existing results
  const { data: existing } = await supabase
    .from('eurovision_results')
    .select('team_id, qualified, final_position, grand_final_points')
    .eq('sweepstake_id', id)

  const existingMap = Object.fromEntries(
    (existing ?? []).map(r => [r.team_id, {
      qualified:          r.qualified,
      final_position:     r.final_position,
      grand_final_points: r.grand_final_points,
    }])
  )

  return (
    <EurovisionResultsClient
      sweepstakeId={id}
      countries={countries ?? []}
      existingMap={existingMap}
    />
  )
}
