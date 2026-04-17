import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ memberToken: string }> }

function Ball({ n, matched }: { n: number; matched: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
      matched
        ? 'bg-yellow-400 text-gray-950 shadow-lg shadow-yellow-400/30'
        : 'bg-gray-800 text-gray-300 border border-gray-700'
    }`}>
      {n}
    </span>
  )
}

export default async function ParticipantPage({ params }: Props) {
  const { memberToken } = await params
  const supabase = await createServiceClient()

  const { data: member } = await supabase
    .from('syndicate_members')
    .select('*, syndicates(*)')
    .eq('view_token', memberToken)
    .single()

  if (!member || !member.syndicates) notFound()

  const syndicate = member.syndicates as {
    id: string; name: string; entry_fee_pence: number; current_pot_cycle: number
  }

  const [
    { data: allMembers },
    { data: draws },
    { data: payments },
    { data: winners },
    { data: allPayments },
  ] = await Promise.all([
    supabase.from('syndicate_members').select('id, name, number1, number2, number3, number4, number5, number6, left_at').eq('syndicate_id', syndicate.id).is('left_at', null).order('name'),
    supabase.from('lottery_draws').select('*').eq('syndicate_id', syndicate.id).order('draw_date', { ascending: false }),
    supabase.from('syndicate_payments').select('week_date, paid').eq('member_id', member.id).order('week_date', { ascending: false }),
    supabase.from('syndicate_winners').select('*, syndicate_members(name)').eq('syndicate_id', syndicate.id).order('created_at', { ascending: false }),
    supabase.from('syndicate_payments').select('week_date, paid').eq('syndicate_id', syndicate.id),
  ])

  const cycle = syndicate.current_pot_cycle

  // All balls drawn in current cycle
  const drawnBalls = new Set<number>()
  for (const d of (draws ?? [])) {
    if (d.pot_cycle !== cycle) continue
    drawnBalls.add(d.ball1); drawnBalls.add(d.ball2); drawnBalls.add(d.ball3)
    drawnBalls.add(d.ball4); drawnBalls.add(d.ball5); drawnBalls.add(d.ball6)
  }

  // Pot = paid weeks from first draw of current cycle up to latest draw (advance payments reserved)
  const cycleDraws = (draws ?? []).filter(d => d.pot_cycle === cycle).sort((a, b) => a.draw_date.localeCompare(b.draw_date))
  const cycleStart = cycleDraws[0]?.draw_date ?? null
  const latestDraw = cycleDraws[cycleDraws.length - 1]?.draw_date ?? null
  const potPence = (cycleStart && latestDraw && allPayments)
    ? allPayments.filter(p => p.paid && p.week_date >= cycleStart && p.week_date <= latestDraw).length * syndicate.entry_fee_pence
    : 0

  const myNumbers = [member.number1, member.number2, member.number3, member.number4, member.number5, member.number6]
  const myNeeds = myNumbers.filter(n => !drawnBalls.has(n)).length

  // Leaderboard
  type RankedMember = { id: string; name: string; needs: number; numbers: number[] }
  const leaderboard: RankedMember[] = (allMembers ?? [])
    .map(m => {
      const nums = [m.number1, m.number2, m.number3, m.number4, m.number5, m.number6]
      const needs = nums.filter(n => !drawnBalls.has(n)).length
      return { id: m.id, name: m.name, needs, numbers: nums }
    })
    .sort((a, b) => a.needs - b.needs)

  const myPaidWeeks  = (payments ?? []).filter(p => p.paid).length
  const myTotalWeeks = (payments ?? []).length

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">{syndicate.name}</p>
          <h1 className="font-heading text-3xl font-bold">{member.name}</h1>
          {potPence > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5">
              <span className="text-yellow-300 text-sm font-semibold">🏆 Jackpot: £{(potPence / 100).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* My numbers */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-4">Your numbers</p>
          <div className="flex gap-2 justify-center flex-wrap mb-4">
            {myNumbers.map(n => <Ball key={n} n={n} matched={drawnBalls.has(n)} />)}
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="font-heading text-4xl font-bold">{myNeeds}</p>
              <p className="text-xs text-gray-500 mt-0.5">still needed</p>
            </div>
            <div className="text-center">
              <p className="font-heading text-4xl font-bold">{6 - myNeeds}</p>
              <p className="text-xs text-gray-500 mt-0.5">matched</p>
            </div>
          </div>
          {myNeeds === 0 && (
            <div className="mt-4 text-center bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3">
              <p className="text-yellow-300 font-semibold">All 6 matched — you've won! 🎉</p>
            </div>
          )}
          {drawnBalls.size > 0 && (
            <p className="text-xs text-gray-600 text-center mt-3">
              Drawn so far: {[...drawnBalls].sort((a, b) => a - b).join(', ')}
            </p>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-4">Leaderboard — cycle {cycle}</p>
          <div className="space-y-2">
            {leaderboard.map((m, i) => (
              <div
                key={m.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  m.id === member.id ? 'bg-gray-800 border border-gray-600' : ''
                }`}
              >
                <span className="text-gray-500 text-sm w-5 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${m.id === member.id ? 'text-white' : 'text-gray-300'}`}>
                    {m.name} {m.id === member.id && <span className="text-xs text-gray-500">(you)</span>}
                  </p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {m.numbers.map(n => (
                      <span
                        key={n}
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                          drawnBalls.has(n) ? 'bg-yellow-400 text-gray-950' : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-heading text-lg font-bold">{m.needs}</p>
                  <p className="text-xs text-gray-500">needs</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent draws */}
        {(draws ?? []).filter(d => d.pot_cycle === cycle).length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-4">Recent draws</p>
            <div className="space-y-3">
              {(draws ?? []).filter(d => d.pot_cycle === cycle).slice(0, 8).map(d => (
                <div key={d.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-400 shrink-0">{d.draw_date}</span>
                  <div className="flex gap-1 flex-wrap">
                    {[d.ball1,d.ball2,d.ball3,d.ball4,d.ball5,d.ball6].map((n, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          myNumbers.includes(n) ? 'bg-yellow-400 text-gray-950' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {n}
                      </span>
                    ))}
                    {d.bonus_ball && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-orange-700 text-white ml-0.5">{d.bonus_ball}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment status */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-4">Your payments</p>
          {myTotalWeeks === 0 ? (
            <p className="text-sm text-gray-400">No payment records yet.</p>
          ) : (
            <>
              <p className="text-sm text-gray-300 mb-3">
                <span className="font-semibold text-white">{myPaidWeeks}</span> of {myTotalWeeks} weeks paid
              </p>
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                {(payments ?? []).slice(0, 24).map(p => (
                  <div key={p.week_date} className="flex items-center gap-2 text-xs">
                    <span className={p.paid ? 'text-green-400' : 'text-red-400'}>{p.paid ? '✓' : '✗'}</span>
                    <span className="text-gray-400">{p.week_date}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Past winners */}
        {(winners ?? []).length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-4">Past winners</p>
            <div className="space-y-2">
              {(winners ?? []).map(w => (
                <div key={w.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{(w.syndicate_members as { name: string } | null)?.name ?? '–'}</span>
                  <span className="text-gray-400">{w.draw_date} · £{(w.amount_pence / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-700 pb-4">playdrawr</p>
      </div>
    </div>
  )
}
