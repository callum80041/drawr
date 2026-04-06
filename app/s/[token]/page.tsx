import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PointsGuide } from '@/components/participant/PointsGuide'

interface Props {
  params: Promise<{ token: string }>
}

export default async function LeaderboardPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, status')
    .eq('share_token', token)
    .single()

  if (!sweepstake) notFound()

  const { data: participants } = await supabase
    .from('participants')
    .select('id, name')
    .eq('sweepstake_id', sweepstake.id)
    .order('created_at', { ascending: true })

  const { data: assignments } = await supabase
    .from('assignments')
    .select('participant_id, team_id, team_name, team_flag')
    .eq('sweepstake_id', sweepstake.id)

  const { data: scores } = await supabase
    .from('scores')
    .select('participant_id, points, rank')
    .eq('sweepstake_id', sweepstake.id)

  const teamsByParticipant = (assignments ?? []).reduce<Record<string, { team_id: number; team_name: string; team_flag: string | null }[]>>(
    (acc, a) => {
      if (!acc[a.participant_id]) acc[a.participant_id] = []
      acc[a.participant_id].push({ team_id: a.team_id, team_name: a.team_name, team_flag: a.team_flag })
      return acc
    },
    {}
  )

  const scoreByParticipant = Object.fromEntries(
    (scores ?? []).map(s => [s.participant_id, s])
  )

  const ranked = (participants ?? [])
    .map(p => ({
      ...p,
      teams: teamsByParticipant[p.id] ?? [],
      points: scoreByParticipant[p.id]?.points ?? 0,
      rank: scoreByParticipant[p.id]?.rank ?? null,
    }))
    .sort((a, b) => b.points - a.points)

  if (ranked.length === 0) {
    return (
      <div className="text-center py-16 text-mid">
        <p className="text-4xl mb-3">🏆</p>
        <p className="font-medium text-pitch">The draw hasn&apos;t happened yet.</p>
        <p className="text-sm mt-1">Check back soon.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <PointsGuide />

      <div className="space-y-2">
      {ranked.map((p, i) => (
        <div
          key={p.id}
          className={`bg-white rounded-xl border px-4 py-3 flex items-center gap-3 ${
            i === 0 ? 'border-gold/40' : 'border-[#E5EDEA]'
          }`}
        >
          {/* Rank */}
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
            i === 0 ? 'bg-gold text-white' :
            i === 1 ? 'bg-[#C0C0C0] text-white' :
            i === 2 ? 'bg-[#CD7F32] text-white' :
            'bg-light text-mid'
          }`}>
            {i + 1}
          </span>

          {/* Name + teams */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-pitch text-sm">{p.name}</p>
            {p.teams.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {p.teams.map(t => (
                  <span key={t.team_id} className="inline-flex items-center gap-1 text-xs text-mid bg-light px-2 py-0.5 rounded-full">
                    {t.team_flag && <span>{t.team_flag}</span>}
                    {t.team_name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Points */}
          <span className="font-heading font-bold text-pitch text-lg shrink-0">
            {p.points} <span className="text-xs font-normal text-mid">pts</span>
          </span>
        </div>
      ))}
      </div>
    </div>
  )
}
