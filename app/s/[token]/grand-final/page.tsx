import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { computeEurovisionPoints, EUROVISION_SEMI_BONUS } from '@/lib/scoring'

interface Props {
  params: Promise<{ token: string }>
}

const PINK   = '#F10F59'
const PURPLE = '#5A22A9'
const BG     = '#040241'
const LIME   = '#C8F046'

const POSITION_MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function positionLabel(pos: number) {
  if (pos === 1) return '1st'
  if (pos === 2) return '2nd'
  if (pos === 3) return '3rd'
  return `${pos}th`
}

export default async function GrandFinalPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, tournament_id, sweepstake_type')
    .eq('share_token', token)
    .single()

  if (!sweepstake) notFound()
  if (sweepstake.sweepstake_type !== 'eurovision') notFound()

  const tournamentId = sweepstake.tournament_id ?? 2

  const [countriesRes, resultsRes, assignmentsRes] = await Promise.all([
    supabase
      .from('teams')
      .select('id, name, flag, semi_final')
      .eq('tournament_id', tournamentId)
      .order('name'),
    supabase
      .from('eurovision_results')
      .select('team_id, qualified, final_position, grand_final_points')
      .eq('sweepstake_id', sweepstake.id),
    supabase
      .from('assignments')
      .select('team_id, participants(name)')
      .eq('sweepstake_id', sweepstake.id),
  ])

  const countries  = countriesRes.data  ?? []
  const results    = resultsRes.data    ?? []
  const assignments = assignmentsRes.data ?? []

  const resultMap = Object.fromEntries(results.map(r => [r.team_id, r]))

  // team_id → participant name
  const teamParticipant: Record<number, string> = {}
  for (const a of assignments) {
    const raw = a.participants as unknown
    const p = Array.isArray(raw) ? (raw[0] as { name: string } | undefined) : (raw as { name: string } | null)
    if (p?.name) teamParticipant[a.team_id] = p.name
  }

  // Countries that qualified (auto + semi qualifiers)
  const qualifiedCountries = countries
    .filter(c => resultMap[c.id]?.qualified)
    .map(c => {
      const r = resultMap[c.id] ?? { qualified: true, final_position: null, grand_final_points: null }
      return {
        ...c,
        final_position:     r.final_position     ?? null,
        grand_final_points: r.grand_final_points ?? null,
        pts: computeEurovisionPoints(r),
      }
    })
    .sort((a, b) => {
      // Sort by final position if available, otherwise by points desc
      if (a.final_position !== null && b.final_position !== null) return a.final_position - b.final_position
      if (a.final_position === null && b.final_position === null) return b.pts - a.pts
      if (a.final_position === null) return 1
      return -1
    })

  // Auto-qualified countries not yet in results (no result row yet)
  const autoQualifiedCountries = countries.filter(c => c.semi_final === null && !resultMap[c.id])

  const finalStarted = qualifiedCountries.some(c => c.final_position !== null)
  const totalQualified = qualifiedCountries.length + autoQualifiedCountries.length

  return (
    <div className="space-y-5">

      {/* Header card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: BG }}>
        <div
          className="px-5 py-5 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${BG} 0%, rgba(90,34,169,0.8) 100%)` }}
        >
          {/* Background symbol */}
          <img
            src="/eurovision-symbol.svg"
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', width: 120, opacity: 0.08, filter: 'invert(1)' }}
          />
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: PINK }}>Grand Final</p>
          <p className="font-heading font-bold text-white text-xl mb-1">Vienna, Austria</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Saturday 16 May 2026</p>
          <div className="flex gap-6 mt-3">
            <div>
              <p className="font-heading font-bold text-2xl" style={{ color: PINK }}>{totalQualified || 26}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>countries</p>
            </div>
            <div>
              <p className="font-heading font-bold text-2xl text-white">1</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>winner</p>
            </div>
          </div>
        </div>
      </div>

      {!finalStarted && (
        <div className="rounded-xl px-4 py-3 text-sm text-center" style={{ background: 'rgba(90,34,169,0.08)', color: PURPLE, border: '1px solid rgba(90,34,169,0.15)' }}>
          Grand Final results will appear here once the show begins. 🎤
        </div>
      )}

      {/* Finalists — sorted by position */}
      {qualifiedCountries.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(90,34,169,0.15)' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(90,34,169,0.1)', background: 'rgba(90,34,169,0.04)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: PURPLE }}>Finalists</p>
          </div>
          <ul className="divide-y" style={{ borderColor: 'rgba(90,34,169,0.08)' }}>
            {qualifiedCountries.map((c, i) => {
              const pos = c.final_position
              const medal = pos ? POSITION_MEDALS[pos] : null
              const isWinner = pos === 1

              return (
                <li
                  key={c.id}
                  className="flex items-center gap-3 px-5 py-3"
                  style={isWinner ? { background: 'rgba(241,15,89,0.05)' } : undefined}
                >
                  {/* Position */}
                  <div className="w-10 text-center shrink-0">
                    {medal ? (
                      <span className="text-xl">{medal}</span>
                    ) : pos ? (
                      <span className="text-sm font-heading font-bold" style={{ color: PURPLE }}>{positionLabel(pos)}</span>
                    ) : (
                      <span className="text-xs" style={{ color: 'rgba(4,2,65,0.3)' }}>—</span>
                    )}
                  </div>

                  {/* Flag + name */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-2xl">{c.flag ?? '🏳️'}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: BG }}>{c.name}</p>
                      {c.semi_final === null && (
                        <p className="text-xs" style={{ color: 'rgba(4,2,65,0.4)' }}>Auto-qualified</p>
                      )}
                    </div>
                  </div>

                  {/* Participant */}
                  {teamParticipant[c.id] && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ background: 'rgba(90,34,169,0.1)', color: PURPLE }}>
                      {teamParticipant[c.id]}
                    </span>
                  )}

                  {/* Points */}
                  <div className="text-right shrink-0 ml-2 min-w-[60px]">
                    {c.grand_final_points != null ? (
                      <>
                        <div>
                          <span className="font-heading font-bold text-sm" style={{ color: isWinner ? PINK : BG }}>
                            {c.grand_final_points}
                          </span>
                          <span className="text-xs ml-0.5" style={{ color: 'rgba(4,2,65,0.35)' }}>🎤pts</span>
                        </div>
                        <div className="text-xs" style={{ color: isWinner ? PINK : PURPLE }}>
                          +{EUROVISION_SEMI_BONUS} = <strong>{c.pts}</strong>
                        </div>
                      </>
                    ) : pos ? (
                      <span className="text-xs" style={{ color: 'rgba(4,2,65,0.35)' }}>awaiting</span>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Auto-qualified countries not yet in results */}
      {autoQualifiedCountries.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(90,34,169,0.15)' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(90,34,169,0.1)', background: 'rgba(90,34,169,0.04)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: PURPLE }}>Auto-qualified — awaiting results</p>
          </div>
          <ul className="divide-y" style={{ borderColor: 'rgba(90,34,169,0.08)' }}>
            {autoQualifiedCountries.map(c => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-10 text-center shrink-0">
                  <span className="text-xs" style={{ color: 'rgba(4,2,65,0.3)' }}>—</span>
                </div>
                <span className="text-2xl">{c.flag ?? '🏳️'}</span>
                <p className="font-medium text-sm flex-1" style={{ color: BG }}>{c.name}</p>
                {teamParticipant[c.id] && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(90,34,169,0.1)', color: PURPLE }}>
                    {teamParticipant[c.id]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Scoring reminder */}
      <div className="rounded-xl px-4 py-4 text-sm space-y-3" style={{ background: BG }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: PINK }}>How scoring works</p>
        <div className="flex justify-between items-start">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Reaches Grand Final</span>
          <span className="font-heading font-bold" style={{ color: LIME }}>+{EUROVISION_SEMI_BONUS} pts</span>
        </div>
        <div className="flex justify-between items-start">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Grand Final score (jury + public)</span>
          <span className="font-heading font-bold" style={{ color: PINK }}>+ actual pts</span>
        </div>
        <p className="text-xs pt-1" style={{ color: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
          Your sweepstake score = qualification bonus + your country&apos;s real combined jury and televote points from the Grand Final. Just like the show — the drama is the same.
        </p>
      </div>
    </div>
  )
}
