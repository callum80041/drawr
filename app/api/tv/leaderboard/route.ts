import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSweepstakePro } from '@/lib/utils/pro'
import { computeEurovisionPoints } from '@/lib/scoring'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, sweepstake_type, is_pro, pro_expires_at')
    .or(`share_token.eq.${token},custom_slug.eq.${token}`)
    .single()

  if (!sweepstake) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const isPro = isSweepstakePro(sweepstake)
  if (!isPro) {
    return NextResponse.json({ error: 'TV mode requires Pro' }, { status: 403 })
  }

  const isEurovision = sweepstake.sweepstake_type === 'eurovision'

  const { data: participants } = await supabase
    .from('participants')
    .select('id, name')
    .eq('sweepstake_id', sweepstake.id)
    .order('created_at', { ascending: true })

  const { data: assignments } = await supabase
    .from('assignments')
    .select('participant_id, team_id, team_name, team_flag')
    .eq('sweepstake_id', sweepstake.id)

  let euScoreByTeam: Record<number, { qualified: boolean; final_position: number | null }> = {}
  if (isEurovision) {
    const { data: euResults } = await supabase
      .from('eurovision_results')
      .select('team_id, qualified, final_position, grand_final_points')
      .eq('sweepstake_id', sweepstake.id)
    euScoreByTeam = Object.fromEntries(
      (euResults ?? []).map(r => [r.team_id, { qualified: r.qualified, final_position: r.final_position, grand_final_points: r.grand_final_points }])
    )
  }

  const { data: scores } = isEurovision
    ? { data: null }
    : await supabase
        .from('scores')
        .select('participant_id, points, rank')
        .eq('sweepstake_id', sweepstake.id)

  const teamsByParticipant = (assignments ?? []).reduce<
    Record<string, { team_id: number; team_name: string; team_flag: string | null }[]>
  >((acc, a) => {
    if (!acc[a.participant_id]) acc[a.participant_id] = []
    acc[a.participant_id].push({ team_id: a.team_id, team_name: a.team_name, team_flag: a.team_flag })
    return acc
  }, {})

  const scoreByParticipant = Object.fromEntries(
    (scores ?? []).map(s => [s.participant_id, s])
  )

  const ranked = (participants ?? [])
    .map(p => {
      let points = 0
      if (isEurovision) {
        const myTeams = teamsByParticipant[p.id] ?? []
        points = myTeams.reduce((sum, t) => {
          const result = euScoreByTeam[t.team_id]
          return sum + (result ? computeEurovisionPoints(result) : 0)
        }, 0)
      } else {
        points = scoreByParticipant[p.id]?.points ?? 0
      }
      return {
        id: p.id,
        name: p.name,
        teams: teamsByParticipant[p.id] ?? [],
        points,
        rank: scoreByParticipant[p.id]?.rank ?? null,
      }
    })
    .sort((a, b) => b.points - a.points)

  return NextResponse.json({ ranked })
}
