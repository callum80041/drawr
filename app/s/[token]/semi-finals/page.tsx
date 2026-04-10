import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EUROVISION_SONGS } from '@/lib/eurovision-songs'

interface Props {
  params: Promise<{ token: string }>
}

const PINK   = '#F10F59'
const PURPLE = '#5A22A9'
const BG     = '#040241'

export default async function SemiFinalsPage({ params }: Props) {
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
      .not('semi_final', 'is', null)   // exclude auto-qualified
      .order('semi_final')
      .order('name'),
    supabase
      .from('eurovision_results')
      .select('team_id, qualified')
      .eq('sweepstake_id', sweepstake.id),
    supabase
      .from('assignments')
      .select('team_id, participants(name)')
      .eq('sweepstake_id', sweepstake.id),
  ])

  const countries  = countriesRes.data  ?? []
  const results    = resultsRes.data    ?? []
  const assignments = assignmentsRes.data ?? []

  const qualifiedSet = new Set(results.filter(r => r.qualified).map(r => r.team_id))
  const eliminatedSet = new Set(
    results.filter(r => !r.qualified && results.some(x => x.team_id === r.team_id)).map(r => r.team_id)
  )

  // team_id → participant name
  const teamParticipant: Record<number, string> = {}
  for (const a of assignments) {
    const raw = a.participants as unknown
    const p = Array.isArray(raw) ? (raw[0] as { name: string } | undefined) : (raw as { name: string } | null)
    if (p?.name) teamParticipant[a.team_id] = p.name
  }

  const semi1 = countries.filter(c => c.semi_final === 1)
  const semi2 = countries.filter(c => c.semi_final === 2)

  const anyResults = results.length > 0

  function SemiCard({ semi, countries: cs }: { semi: number; countries: typeof semi1 }) {
    const qualified  = cs.filter(c => qualifiedSet.has(c.id))
    const eliminated = cs.filter(c => {
      const hasResult = results.some(r => r.team_id === c.id)
      return hasResult && !qualifiedSet.has(c.id)
    })
    const pending    = cs.filter(c => !results.some(r => r.team_id === c.id))

    const DATES: Record<number, string> = { 1: 'Tuesday 12 May 2026', 2: 'Thursday 14 May 2026' }

    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(90,34,169,0.15)' }}>
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: BG }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: PINK }}>Semi-Final {semi}</p>
            <p className="text-white font-heading font-bold text-lg">Vienna, Austria</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{DATES[semi]}</p>
          </div>
          <div className="text-right">
            <p className="font-heading font-bold text-2xl" style={{ color: PINK }}>{cs.length}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>competing</p>
          </div>
        </div>

        {/* Qualified */}
        {qualified.length > 0 && (
          <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(90,34,169,0.1)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#16a34a' }}>✓ Qualified for Grand Final</p>
            <div className="space-y-2">
              {qualified.map(c => {
                const song = EUROVISION_SONGS[c.id]
                return (
                  <div key={c.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl shrink-0">{c.flag ?? '🏳️'}</span>
                      <div className="min-w-0">
                        <span className="font-medium text-sm" style={{ color: BG }}>{c.name}</span>
                        {song && (
                          <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 mt-0.5 group">
                            <svg width="10" height="10" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1DB954"/><path d="M17.9 10.9C14.7 9 9.35 8.8 6.3 9.75c-.5.15-1-.15-1.15-.6-.15-.5.15-1 .6-1.15 3.55-1.05 9.4-.85 13.1 1.35.45.25.6.85.35 1.3-.25.35-.85.5-1.3.25zm-.1 2.8c-.25.35-.7.5-1.05.25-2.7-1.65-6.8-2.15-9.95-1.15-.4.1-.85-.1-.95-.5-.1-.4.1-.85.5-.95 3.65-1.1 8.15-.55 11.25 1.35.3.15.45.65.2 1zm-1.2 2.75c-.2.3-.55.4-.85.2-2.35-1.45-5.3-1.75-8.8-.95-.35.1-.65-.15-.75-.45-.1-.35.15-.65.45-.75 3.8-.85 7.1-.5 9.7 1.1.35.15.4.55.25.85z" fill="white"/></svg>
                            <span className="text-xs group-hover:underline truncate" style={{ color: 'rgba(4,2,65,0.4)' }}>{song.title} · {song.artist}</span>
                          </a>
                        )}
                      </div>
                    </div>
                    {teamParticipant[c.id] && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ background: 'rgba(90,34,169,0.1)', color: PURPLE }}>
                        {teamParticipant[c.id]}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Eliminated */}
        {eliminated.length > 0 && (
          <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(90,34,169,0.1)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>✗ Eliminated</p>
            <div className="space-y-2">
              {eliminated.map(c => (
                <div key={c.id} className="flex items-center justify-between gap-3 opacity-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xl grayscale">{c.flag ?? '🏳️'}</span>
                    <span className="font-medium text-sm line-through" style={{ color: BG }}>{c.name}</span>
                  </div>
                  {teamParticipant[c.id] && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f3f4f6', color: '#9ca3af' }}>
                      {teamParticipant[c.id]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <div className="px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(4,2,65,0.4)' }}>Yet to compete</p>
            <div className="space-y-2">
              {pending.map(c => {
                const song = EUROVISION_SONGS[c.id]
                return (
                  <div key={c.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl shrink-0">{c.flag ?? '🏳️'}</span>
                      <div className="min-w-0">
                        <span className="text-sm" style={{ color: 'rgba(4,2,65,0.6)' }}>{c.name}</span>
                        {song && (
                          <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 mt-0.5 group">
                            <svg width="10" height="10" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1DB954"/><path d="M17.9 10.9C14.7 9 9.35 8.8 6.3 9.75c-.5.15-1-.15-1.15-.6-.15-.5.15-1 .6-1.15 3.55-1.05 9.4-.85 13.1 1.35.45.25.6.85.35 1.3-.25.35-.85.5-1.3.25zm-.1 2.8c-.25.35-.7.5-1.05.25-2.7-1.65-6.8-2.15-9.95-1.15-.4.1-.85-.1-.95-.5-.1-.4.1-.85.5-.95 3.65-1.1 8.15-.55 11.25 1.35.3.15.45.65.2 1zm-1.2 2.75c-.2.3-.55.4-.85.2-2.35-1.45-5.3-1.75-8.8-.95-.35.1-.65-.15-.75-.45-.1-.35.15-.65.45-.75 3.8-.85 7.1-.5 9.7 1.1.35.15.4.55.25.85z" fill="white"/></svg>
                            <span className="text-xs group-hover:underline truncate" style={{ color: 'rgba(4,2,65,0.35)' }}>{song.title} · {song.artist}</span>
                          </a>
                        )}
                      </div>
                    </div>
                    {teamParticipant[c.id] && (
                      <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: 'rgba(90,34,169,0.08)', color: PURPLE }}>
                        {teamParticipant[c.id]}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {!anyResults && (
        <div className="rounded-xl px-4 py-3 text-sm text-center" style={{ background: 'rgba(90,34,169,0.08)', color: PURPLE, border: '1px solid rgba(90,34,169,0.15)' }}>
          Semi-final results will appear here once the shows are live. 🎤
        </div>
      )}

      {/* Auto-qualified reminder */}
      <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(241,15,89,0.07)', border: '1px solid rgba(241,15,89,0.15)' }}>
        <p className="font-semibold text-xs uppercase tracking-widest mb-1" style={{ color: PINK }}>Auto-qualified</p>
        <p style={{ color: BG, opacity: 0.7 }}>
          The Big 5 (UK, France, Germany, Spain, Italy) and host Austria skip the semi-finals and go straight to the Grand Final on Saturday 16 May 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SemiCard semi={1} countries={semi1} />
        <SemiCard semi={2} countries={semi2} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'rgba(4,2,65,0.5)' }}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#16a34a' }} />
          Through to Grand Final
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block bg-gray-300" />
          Eliminated
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: PURPLE, opacity: 0.3 }} />
          Yet to compete
        </span>
      </div>
    </div>
  )
}
