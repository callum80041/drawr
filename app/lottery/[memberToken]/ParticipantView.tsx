'use client'

import { useState } from 'react'

interface Draw { id: string; draw_date: string; ball1: number; ball2: number; ball3: number; ball4: number; ball5: number; ball6: number; bonus_ball: number | null; pot_cycle: number }
interface Props {
  memberToken: string
  member: { id: string; name: string }
  syndicateName: string
  stripeEnabled: boolean
  myNumbers: number[]
  myNeeds: number
  eligible: boolean
  potPence: number
  drawnBalls: number[]
  cycleDraws: Draw[]
  leaderboard: { id: string; name: string; needs: number; numbers: number[] }[]
  myPayments: { week_date: string; paid: boolean; payment_method: string }[]
  winners: { draw_date: string; amount_pence: number; name: string }[]
  entryFeePence: number
}

function Ball({ n, matched }: { n: number; matched: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
      matched ? 'bg-yellow-400 text-gray-950 shadow-lg shadow-yellow-400/30' : 'bg-gray-800 text-gray-300 border border-gray-700'
    }`}>{n}</span>
  )
}

// Next N Wednesdays from today
function nextWednesdays(n: number): string[] {
  const dates: string[] = []
  const d = new Date()
  const daysUntil = (3 - d.getDay() + 7) % 7 || 7
  d.setDate(d.getDate() + daysUntil)
  for (let i = 0; i < n; i++) {
    dates.push(d.toISOString().slice(0, 10))
    d.setDate(d.getDate() + 7)
  }
  return dates
}

function formatDate(iso: string): string {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function ParticipantView({
  memberToken, member, syndicateName, stripeEnabled,
  myNumbers, myNeeds, eligible, potPence, drawnBalls,
  cycleDraws, leaderboard, myPayments, winners, entryFeePence,
}: Props) {
  const drawn = new Set(drawnBalls)
  const myPaidSet = new Set(myPayments.filter(p => p.paid).map(p => p.week_date))
  const cycleWeeks = cycleDraws.map(d => d.draw_date)
  const upcoming = nextWednesdays(8).filter(w => !myPaidSet.has(w))
  const [paying, setPaying] = useState<string | null>(null)
  const [payError, setPayError] = useState('')

  async function pay(weekDate: string) {
    setPaying(weekDate); setPayError('')
    const res = await fetch('/api/lottery/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberToken, weekDate }),
    })
    const data = await res.json()
    if (data.url) { window.location.href = data.url; return }
    setPayError(data.error ?? 'Something went wrong')
    setPaying(null)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm">{syndicateName}</p>
          <h1 className="font-heading text-3xl font-bold">{member.name}</h1>
          {potPence > 0 && (
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5">
              <span className="text-yellow-300 text-sm font-semibold">🏆 Jackpot: £{(potPence / 100).toFixed(2)}</span>
            </div>
          )}
          {cycleDraws.length > 0 && (
            <p className={`text-xs ${eligible ? 'text-green-400' : 'text-red-400'}`}>
              {eligible ? '✓ You are eligible to win' : '✗ Not eligible — missed a draw payment'}
            </p>
          )}
        </div>

        {/* My numbers */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-4">Your numbers</p>
          <div className="flex gap-2 justify-center flex-wrap mb-5">
            {myNumbers.map(n => <Ball key={n} n={n} matched={drawn.has(n)} />)}
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="font-heading text-4xl font-bold">{myNeeds}</p>
              <p className="text-xs text-gray-500 mt-0.5">still needed</p>
            </div>
            <div className="text-center">
              <p className="font-heading text-4xl font-bold">{6 - myNeeds}</p>
              <p className="text-xs text-gray-500 mt-0.5">matched</p>
            </div>
          </div>
          {myNeeds === 0 && eligible && (
            <div className="mt-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3 text-center">
              <p className="text-yellow-300 font-semibold">All 6 matched — you've won! 🎉</p>
            </div>
          )}
          {drawn.size > 0 && (
            <p className="text-xs text-gray-600 text-center mt-3">Drawn: {[...drawn].sort((a, b) => a - b).join(', ')}</p>
          )}
        </div>

        {/* Payments */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-4">Payments</p>

          {/* Cycle weeks */}
          {cycleWeeks.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">This cycle</p>
              <div className="space-y-1.5">
                {cycleWeeks.map(w => {
                  const paid = myPaidSet.has(w)
                  const p = myPayments.find(p => p.week_date === w)
                  return (
                    <div key={w} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${paid ? 'text-green-400' : 'text-red-400'}`}>{paid ? '✓' : '✗'}</span>
                        <span className="text-sm text-gray-300">{formatDate(w)}</span>
                        {p?.payment_method === 'stripe' && <span className="text-xs text-indigo-400">Stripe</span>}
                      </div>
                      {!paid && stripeEnabled && (
                        <button
                          onClick={() => pay(w)}
                          disabled={paying === w}
                          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg transition disabled:opacity-50"
                        >
                          {paying === w ? '…' : `Pay £${(entryFeePence / 100).toFixed(2)}`}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Upcoming weeks */}
          {stripeEnabled && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Upcoming — pay in advance</p>
              <div className="space-y-1.5">
                {upcoming.slice(0, 8).map(w => (
                  <div key={w} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{formatDate(w)}</span>
                    <button
                      onClick={() => pay(w)}
                      disabled={paying === w}
                      className="text-xs bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white px-3 py-1 rounded-lg transition disabled:opacity-50"
                    >
                      {paying === w ? '…' : `Pay £${(entryFeePence / 100).toFixed(2)}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {payError && <p className="text-red-400 text-xs mt-3">{payError}</p>}
          {!stripeEnabled && cycleWeeks.length === 0 && (
            <p className="text-sm text-gray-400">No payment records yet.</p>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-4">Leaderboard</p>
          <div className="space-y-2">
            {leaderboard.map((m, i) => (
              <div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl ${m.id === member.id ? 'bg-gray-800 border border-gray-600' : ''}`}>
                <span className="text-gray-500 text-sm w-5 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${m.id === member.id ? 'text-white' : 'text-gray-300'}`}>
                    {m.name} {m.id === member.id && <span className="text-xs text-gray-500">(you)</span>}
                  </p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {m.numbers.map(n => (
                      <span key={n} className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${drawn.has(n) ? 'bg-yellow-400 text-gray-950' : 'bg-gray-700 text-gray-400'}`}>{n}</span>
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
        {cycleDraws.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-4">Draw results</p>
            <div className="space-y-3">
              {[...cycleDraws].reverse().map(d => (
                <div key={d.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-400 shrink-0">{formatDate(d.draw_date)}</span>
                  <div className="flex gap-1 flex-wrap">
                    {[d.ball1,d.ball2,d.ball3,d.ball4,d.ball5,d.ball6].map((n, i) => (
                      <span key={i} className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${myNumbers.includes(n) ? 'bg-yellow-400 text-gray-950' : 'bg-gray-700 text-gray-300'}`}>{n}</span>
                    ))}
                    {d.bonus_ball && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-orange-700 text-white ml-0.5">{d.bonus_ball}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past winners */}
        {winners.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-4">Past winners</p>
            <div className="space-y-2">
              {winners.map((w, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{w.name}</span>
                  <span className="text-gray-400">{formatDate(w.draw_date)} · £{(w.amount_pence / 100).toFixed(2)}</span>
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
