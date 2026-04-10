import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PointsGuide } from '@/components/participant/PointsGuide'
import { EurovisionPointsGuide } from '@/components/participant/EurovisionPointsGuide'
import { computeEurovisionPoints } from '@/lib/scoring'

interface Props {
  params: Promise<{ token: string }>
}

export default async function LeaderboardPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, status, sweepstake_type')
    .eq('share_token', token)
    .single()

  if (!sweepstake) notFound()

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

  // ── Eurovision: score from eurovision_results ────────────────────────────
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

  // ── World Cup: use pre-computed scores table ─────────────────────────────
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
        ...p,
        teams: teamsByParticipant[p.id] ?? [],
        points,
        rank: scoreByParticipant[p.id]?.rank ?? null,
      }
    })
    .sort((a, b) => b.points - a.points)

  const BG_EV    = '#040241'
  const PINK_EV  = '#F10F59'
  const PURPLE_EV = '#5A22A9'

  if (ranked.length === 0) {
    return (
      <div className="text-center py-16" style={isEurovision ? { color: 'rgba(4,2,65,0.5)' } : { color: undefined }}>
        <p className="text-4xl mb-3">{isEurovision ? '🎤' : '🏆'}</p>
        <p className="font-medium" style={isEurovision ? { color: BG_EV } : { color: undefined }}>The draw hasn&apos;t happened yet.</p>
        <p className="text-sm mt-1">Check back soon.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {isEurovision ? <EurovisionPointsGuide /> : <PointsGuide />}

      <div className="space-y-2">
        {ranked.map((p, i) => {
          const euResults = isEurovision
            ? p.teams.map(t => euScoreByTeam[t.team_id] ?? null)
            : []

          const isFirst = i === 0

          return (
            <div
              key={p.id}
              className="rounded-xl px-4 py-3 flex items-center gap-3"
              style={isEurovision
                ? {
                    background: isFirst ? 'rgba(241,15,89,0.06)' : '#fff',
                    border: `1px solid ${isFirst ? 'rgba(241,15,89,0.25)' : 'rgba(90,34,169,0.12)'}`,
                  }
                : {
                    background: '#fff',
                    border: `1px solid ${isFirst ? 'rgba(218,165,32,0.4)' : '#E5EDEA'}`,
                  }
              }
            >
              {/* Rank */}
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={
                  i === 0 ? { background: isEurovision ? PINK_EV    : '#D4AF37', color: '#fff' } :
                  i === 1 ? { background: '#C0C0C0', color: '#fff' } :
                  i === 2 ? { background: '#CD7F32', color: '#fff' } :
                  isEurovision
                    ? { background: 'rgba(90,34,169,0.1)', color: PURPLE_EV }
                    : { background: '#F5F9F6', color: '#5A7265' }
                }
              >
                {i + 1}
              </span>

              {/* Name + countries/teams */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={isEurovision ? { color: BG_EV } : { color: '#1A2E22' }}>{p.name}</p>
                {p.teams.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {p.teams.map((t, ti) => {
                      const euResult = isEurovision ? euResults[ti] : null
                      const qualified = euResult?.qualified ?? false
                      const hasResult = euResult !== null && euResult !== undefined
                      const eliminated = isEurovision && hasResult && !qualified

                      return (
                        <span
                          key={t.team_id}
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                          style={
                            isEurovision
                              ? eliminated
                                ? { background: 'rgba(241,15,89,0.08)', color: '#9ca3af', textDecoration: 'line-through' }
                                : qualified
                                ? { background: 'rgba(90,34,169,0.12)', color: PURPLE_EV }
                                : { background: 'rgba(90,34,169,0.06)', color: 'rgba(4,2,65,0.5)' }
                              : eliminated
                                ? { background: '#FEF2F2', color: '#F87171', textDecoration: 'line-through' }
                                : qualified
                                ? { background: 'rgba(200,240,77,0.2)', color: '#1A2E22' }
                                : { background: '#F5F9F6', color: '#5A7265' }
                          }
                        >
                          {t.team_flag && <span>{t.team_flag}</span>}
                          {t.team_name}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Points */}
              <span className="font-heading font-bold text-lg shrink-0" style={isEurovision ? { color: isFirst ? PINK_EV : BG_EV } : { color: '#1A2E22' }}>
                {p.points} <span className="text-xs font-normal" style={isEurovision ? { color: 'rgba(4,2,65,0.4)' } : { color: '#5A7265' }}>pts</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
