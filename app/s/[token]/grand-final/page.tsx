import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { computeEurovisionPoints } from '@/lib/scoring'

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
      .select('team_id, qualified, final_position')
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
    .map(c => ({
      ...c,
      final_position: resultMap[c.id]?.final_position ?? null,
      pts: computeEurovisionPoints(resultMap[c.id] ?? { qualified: true, final_position: null }),
    }))
    .sort((a, b) => {
      if (a.final_position === null && b.final_position === null) return 0
      if (a.final_position === null) return 1
      if (b.final_position === null) return -1
      return a.final_position - b.final_position
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
                  {pos && (
                    <div className="text-right shrink-0 ml-2">
                      <span className="font-heading font-bold text-sm" style={{ color: isWinner ? PINK : BG }}>
                        {c.pts}
                      </span>
                      <span className="text-xs ml-0.5" style={{ color: 'rgba(4,2,65,0.4)' }}>pts</span>
                    </div>
                  )}
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
      <div className="rounded-xl px-4 py-4 text-sm space-y-2" style={{ background: BG }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PINK }}>Points guide</p>
        {[
          { label: 'Reaches Grand Final', pts: 10 },
          { label: '4th–10th place',      pts: 10, extra: '+10' },
          { label: '2nd or 3rd place',    pts: 20, extra: '+20' },
          { label: '🏆 Winner',           pts: 50, extra: '+50' },
        ].map(row => (
          <div key={row.label} className="flex justify-between">
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>{row.label}</span>
            <span className="font-heading font-bold" style={{ color: row.extra === '+50' ? PINK : LIME }}>
              {row.extra ?? `${row.pts} pts`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
