import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 300

interface Props {
  params: Promise<{ token: string }>
}

interface TeamStanding {
  id: number
  name: string
  flag: string | null
  p: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  pts: number
}

const FINISHED = ['FT', 'AET', 'PEN']

export default async function GroupsPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, tournament_id')
    .eq('share_token', token)
    .single()

  if (!sweepstake) notFound()

  const tournamentId = sweepstake.tournament_id ?? 1

  const [teamsRes, matchesRes] = await Promise.all([
    supabase
      .from('teams')
      .select('id, name, flag, group_name')
      .eq('tournament_id', tournamentId)
      .not('group_name', 'is', null)
      .order('name'),
    supabase
      .from('matches')
      .select('id, round, status, home_team_id, away_team_id, home_score, away_score, kickoff')
      .eq('tournament_id', tournamentId)
      .like('round', 'Group%')
      .order('kickoff'),
  ])

  const teams   = teamsRes.data  ?? []
  const matches = matchesRes.data ?? []

  if (teams.length === 0) {
    return (
      <div className="text-center py-16 text-mid">
        <p className="text-4xl mb-3">📊</p>
        <p className="font-medium text-pitch">Group data not available yet.</p>
      </div>
    )
  }

  // Build standings
  const standings = new Map<number, TeamStanding>()
  for (const t of teams) {
    standings.set(t.id, { id: t.id, name: t.name, flag: t.flag, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 })
  }

  for (const m of matches) {
    if (!FINISHED.includes(m.status ?? '') || m.home_score === null || m.away_score === null) continue
    if (!m.home_team_id || !m.away_team_id) continue

    const home = standings.get(m.home_team_id)
    const away = standings.get(m.away_team_id)
    if (!home || !away) continue

    home.p++; away.p++
    home.gf += m.home_score; home.ga += m.away_score
    away.gf += m.away_score; away.ga += m.home_score

    if (m.home_score > m.away_score) {
      home.w++; home.pts += 3; away.l++
    } else if (m.home_score < m.away_score) {
      away.w++; away.pts += 3; home.l++
    } else {
      home.d++; home.pts++; away.d++; away.pts++
    }
  }

  // Group teams
  const groups = new Map<string, TeamStanding[]>()
  for (const t of teams) {
    const gname = t.group_name ?? 'Unknown'
    if (!groups.has(gname)) groups.set(gname, [])
    const s = standings.get(t.id)
    if (s) groups.get(gname)!.push(s)
  }

  const sortedGroups = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
  for (const [, ts] of sortedGroups) {
    ts.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts
      const bgd = b.gf - b.ga, agd = a.gf - a.ga
      if (bgd !== agd) return bgd - agd
      return b.gf - a.gf
    })
  }

  const anyPlayed = matches.some(m => FINISHED.includes(m.status ?? ''))

  return (
    <div className="space-y-6">
      {!anyPlayed && (
        <div className="bg-light rounded-xl border border-[#E5EDEA] px-4 py-3 text-sm text-mid text-center">
          The group stage hasn&apos;t kicked off yet — standings will appear here once matches are played.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedGroups.map(([groupName, teamStandings]) => {
          const groupMatches = matches.filter(m => m.round?.startsWith(groupName))
          const playedCount  = groupMatches.filter(m => FINISHED.includes(m.status ?? '')).length

          return (
            <div key={groupName} className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5EDEA]">
                <h3 className="font-heading font-bold text-pitch text-sm">{groupName}</h3>
                <span className="text-xs text-mid">{playedCount}/{groupMatches.length} played</span>
              </div>

              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#E5EDEA]">
                    <th className="text-left px-4 py-2 text-mid font-medium w-full">Team</th>
                    <th className="px-2 py-2 text-mid font-medium text-center w-6">P</th>
                    <th className="px-2 py-2 text-mid font-medium text-center w-6">W</th>
                    <th className="px-2 py-2 text-mid font-medium text-center w-6">D</th>
                    <th className="px-2 py-2 text-mid font-medium text-center w-6">L</th>
                    <th className="px-2 py-2 text-mid font-medium text-center w-8">GD</th>
                    <th className="px-3 py-2 text-mid font-medium text-center w-8">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {teamStandings.map((t, i) => (
                    <tr key={t.id} className={`border-b border-[#E5EDEA]/50 last:border-0 ${i < 2 ? 'bg-lime/5' : ''}`}>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-1 h-4 rounded-full shrink-0 ${i < 2 ? 'bg-lime' : 'bg-transparent'}`} />
                          <span className="text-base leading-none">{t.flag ?? '🏳️'}</span>
                          <span className="font-medium text-pitch truncate">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-center text-mid">{t.p}</td>
                      <td className="px-2 py-2.5 text-center text-mid">{t.w}</td>
                      <td className="px-2 py-2.5 text-center text-mid">{t.d}</td>
                      <td className="px-2 py-2.5 text-center text-mid">{t.l}</td>
                      <td className="px-2 py-2.5 text-center text-mid">
                        {t.gf - t.ga > 0 ? `+${t.gf - t.ga}` : t.gf - t.ga}
                      </td>
                      <td className="px-3 py-2.5 text-center font-heading font-bold text-pitch">{t.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-4 py-2 flex items-center gap-1.5 text-[10px] text-mid border-t border-[#E5EDEA]">
                <span className="w-1 h-3 rounded-full bg-lime" />
                <span>Qualifies for Round of 32</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
