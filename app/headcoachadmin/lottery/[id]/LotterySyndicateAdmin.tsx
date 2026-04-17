'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Syndicate {
  id: string
  name: string
  entry_fee_pence: number
  status: string
  current_pot_cycle: number
  start_date: string
}

interface Member {
  id: string
  name: string
  email: string | null
  number1: number
  number2: number
  number3: number
  number4: number
  number5: number
  number6: number
  view_token: string
  joined_at: string
  left_at: string | null
}

interface Payment {
  id: string
  member_id: string
  week_date: string
  paid: boolean
  collected_by: string | null
  notes: string | null
}

interface Draw {
  id: string
  draw_date: string
  ball1: number
  ball2: number
  ball3: number
  ball4: number
  ball5: number
  ball6: number
  bonus_ball: number | null
  pot_cycle: number
}

interface Winner {
  id: string
  member_id: string
  draw_date: string
  pot_cycle: number
  amount_pence: number
  notes: string | null
  paid_out: boolean
  syndicate_members: { name: string } | null
}

interface Props {
  syndicate: Syndicate
  members: Member[]
  payments: Payment[]
  draws: Draw[]
  winners: Winner[]
  appUrl: string
}

type Tab = 'leaderboard' | 'members' | 'payments' | 'draws' | 'winners'

// ── Helpers ───────────────────────────────────────────────────────────────────

function memberNumbers(m: Member): number[] {
  return [m.number1, m.number2, m.number3, m.number4, m.number5, m.number6]
}

function computeNeeds(numbers: number[], draws: Draw[], cycle: number): number {
  const drawn = new Set<number>()
  for (const d of draws) {
    if (d.pot_cycle !== cycle) continue
    drawn.add(d.ball1); drawn.add(d.ball2); drawn.add(d.ball3)
    drawn.add(d.ball4); drawn.add(d.ball5); drawn.add(d.ball6)
  }
  return numbers.filter(n => !drawn.has(n)).length
}

function drawnInCycle(draws: Draw[], cycle: number): Set<number> {
  const drawn = new Set<number>()
  for (const d of draws) {
    if (d.pot_cycle !== cycle) continue
    drawn.add(d.ball1); drawn.add(d.ball2); drawn.add(d.ball3)
    drawn.add(d.ball4); drawn.add(d.ball5); drawn.add(d.ball6)
  }
  return drawn
}

function Ball({ n, matched }: { n: number; matched: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
      matched ? 'bg-yellow-400 text-gray-950' : 'bg-gray-700 text-gray-200'
    }`}>
      {n}
    </span>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function LotterySyndicateAdmin({ syndicate, members: initialMembers, payments: initialPayments, draws: initialDraws, winners: initialWinners, appUrl }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('leaderboard')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'leaderboard', label: 'Leaderboard' },
    { key: 'members',     label: 'Members' },
    { key: 'payments',    label: 'Payments' },
    { key: 'draws',       label: 'Draws' },
    { key: 'winners',     label: 'Winners' },
  ]

  function refresh() { router.refresh() }

  const activeMembers = initialMembers.filter(m => !m.left_at)

  // Pot value: paid payments for current cycle draws' date range
  // Simplified: total paid entries × entry fee (all time)
  const totalPaid = initialPayments.filter(p => p.paid).length
  const potPence  = totalPaid * syndicate.entry_fee_pence

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <Link href="/headcoachadmin/lottery" className="text-gray-400 hover:text-white text-sm">← Syndicates</Link>
        </div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">{syndicate.name}</h1>
            <p className="text-gray-400 text-sm mt-1">
              £{(syndicate.entry_fee_pence / 100).toFixed(2)}/week · Cycle {syndicate.current_pot_cycle} · {activeMembers.length} active members
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total paid in</p>
            <p className="font-heading text-2xl font-bold text-yellow-400">£{(potPence / 100).toFixed(2)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-800 mb-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium transition ${
                tab === t.key
                  ? 'text-white border-b-2 border-lime-400 -mb-px'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'leaderboard' && (
          <LeaderboardTab members={activeMembers} draws={initialDraws} cycle={syndicate.current_pot_cycle} />
        )}
        {tab === 'members' && (
          <MembersTab syndicateId={syndicate.id} members={initialMembers} appUrl={appUrl} onSave={refresh} />
        )}
        {tab === 'payments' && (
          <PaymentsTab syndicateId={syndicate.id} members={activeMembers} payments={initialPayments} entryFeePence={syndicate.entry_fee_pence} onSave={refresh} />
        )}
        {tab === 'draws' && (
          <DrawsTab syndicateId={syndicate.id} draws={initialDraws} members={activeMembers} cycle={syndicate.current_pot_cycle} onSave={refresh} />
        )}
        {tab === 'winners' && (
          <WinnersTab syndicateId={syndicate.id} winners={initialWinners} members={activeMembers} entryFeePence={syndicate.entry_fee_pence} totalPaid={totalPaid} onSave={refresh} />
        )}
      </div>
    </div>
  )
}

// ── Leaderboard tab ────────────────────────────────────────────────────────────

function LeaderboardTab({ members, draws, cycle }: { members: Member[]; draws: Draw[]; cycle: number }) {
  const drawn = drawnInCycle(draws, cycle)

  const ranked = [...members]
    .map(m => ({ member: m, needs: computeNeeds(memberNumbers(m), draws, cycle) }))
    .sort((a, b) => a.needs - b.needs)

  return (
    <div className="space-y-2">
      {ranked.length === 0 && <p className="text-gray-400 text-sm">No members yet.</p>}
      {ranked.map(({ member: m, needs }, i) => {
        const nums = memberNumbers(m)
        return (
          <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
            <span className="text-gray-500 text-sm w-6 shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{m.name}</p>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {nums.map(n => <Ball key={n} n={n} matched={drawn.has(n)} />)}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-heading text-xl font-bold">{needs}</p>
              <p className="text-xs text-gray-500">needs</p>
            </div>
          </div>
        )
      })}
      {draws.filter(d => d.pot_cycle === cycle).length > 0 && (
        <p className="text-xs text-gray-500 pt-2">
          Drawn so far this cycle: {[...drawn].sort((a, b) => a - b).join(', ')}
        </p>
      )}
    </div>
  )
}

// ── Members tab ────────────────────────────────────────────────────────────────

function MembersTab({ syndicateId, members, appUrl, onSave }: {
  syndicateId: string; members: Member[]; appUrl: string; onSave: () => void
}) {
  const [editing, setEditing] = useState<Member | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const emptyForm = { name: '', email: '', number1: '', number2: '', number3: '', number4: '', number5: '', number6: '' }
  const [form, setForm] = useState(emptyForm)

  function startAdd() { setForm(emptyForm); setEditing(null); setShowAdd(true); setError('') }
  function startEdit(m: Member) {
    setForm({ name: m.name, email: m.email ?? '', number1: String(m.number1), number2: String(m.number2), number3: String(m.number3), number4: String(m.number4), number5: String(m.number5), number6: String(m.number6) })
    setEditing(m)
    setShowAdd(true)
    setError('')
  }

  async function save() {
    setSaving(true); setError('')
    const payload = {
      ...(editing ? { id: editing.id } : {}),
      name:    form.name,
      email:   form.email || null,
      number1: parseInt(form.number1),
      number2: parseInt(form.number2),
      number3: parseInt(form.number3),
      number4: parseInt(form.number4),
      number5: parseInt(form.number5),
      number6: parseInt(form.number6),
    }
    const res = await fetch(`/api/lottery/syndicates/${syndicateId}/members`, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Error'); setSaving(false); return }
    setSaving(false); setShowAdd(false); setEditing(null); onSave()
  }

  async function markLeft(m: Member) {
    if (!confirm(`Mark ${m.name} as having left the syndicate?`)) return
    await fetch(`/api/lottery/syndicates/${syndicateId}/members`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...m, left_at: new Date().toISOString() }),
    })
    onSave()
  }

  async function remove(m: Member) {
    if (!confirm(`Permanently delete ${m.name}? This cannot be undone.`)) return
    await fetch(`/api/lottery/syndicates/${syndicateId}/members`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: m.id }),
    })
    onSave()
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${appUrl}/lottery/${token}`)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  const active = members.filter(m => !m.left_at)
  const former = members.filter(m => m.left_at)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{active.length} active members</p>
        <button onClick={startAdd} className="bg-lime-400 text-gray-950 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-lime-300 transition">
          + Add member
        </button>
      </div>

      {showAdd && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-sm">{editing ? 'Edit member' : 'Add member'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Email (optional)</label>
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" type="email" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Lottery numbers (1–59)</label>
            <div className="grid grid-cols-6 gap-2">
              {(['number1','number2','number3','number4','number5','number6'] as const).map((k, i) => (
                <input
                  key={k}
                  type="number" min="1" max="59"
                  value={form[k]}
                  onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  placeholder={String(i + 1)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-gray-500"
                />
              ))}
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="bg-lime-400 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-lime-300 disabled:opacity-50 transition">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 text-sm px-4 py-2 hover:text-white transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {active.map(m => (
          <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium">{m.name}</p>
                {m.email && <p className="text-xs text-gray-400 mt-0.5">{m.email}</p>}
                <div className="flex gap-1 mt-2 flex-wrap">
                  {memberNumbers(m).map(n => (
                    <span key={n} className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-gray-700 text-gray-200">{n}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => copyLink(m.view_token)} className="text-xs text-gray-400 hover:text-white px-2 py-1 border border-gray-700 rounded-lg transition">
                  {copied === m.view_token ? '✓ Copied' : 'Copy link'}
                </button>
                <button onClick={() => startEdit(m)} className="text-xs text-gray-400 hover:text-white px-2 py-1 border border-gray-700 rounded-lg transition">Edit</button>
                <button onClick={() => markLeft(m)} className="text-xs text-gray-400 hover:text-yellow-400 px-2 py-1 border border-gray-700 rounded-lg transition">Left</button>
                <button onClick={() => remove(m)} className="text-xs text-gray-400 hover:text-red-400 px-2 py-1 border border-gray-700 rounded-lg transition">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {former.length > 0 && (
        <details className="mt-4">
          <summary className="text-sm text-gray-500 cursor-pointer">Former members ({former.length})</summary>
          <div className="mt-2 space-y-2">
            {former.map(m => (
              <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 opacity-60">
                <p className="font-medium">{m.name} <span className="text-xs text-gray-500">left {m.left_at?.slice(0, 10)}</span></p>
                <div className="flex gap-1 mt-2">
                  {memberNumbers(m).map(n => (
                    <span key={n} className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-gray-700 text-gray-400">{n}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}

// ── Payments tab ───────────────────────────────────────────────────────────────

function PaymentsTab({ syndicateId, members, payments, entryFeePence, onSave }: {
  syndicateId: string; members: Member[]; payments: Payment[]; entryFeePence: number; onSave: () => void
}) {
  // Get all distinct week dates from existing payments, plus show upcoming 4 weeks
  const existingWeeks = [...new Set(payments.map(p => p.week_date))].sort((a, b) => b.localeCompare(a))
  const [selectedWeek, setSelectedWeek] = useState(existingWeeks[0] ?? nextWednesday())
  const [paidMap, setPaidMap] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [collectedBy, setCollectedBy] = useState('')
  const [weekLoaded, setWeekLoaded] = useState<string | null>(null)

  function nextWednesday(): string {
    const d = new Date()
    const day = d.getDay()
    const diff = (3 - day + 7) % 7 || 7
    d.setDate(d.getDate() + diff)
    return d.toISOString().slice(0, 10)
  }

  function loadWeek(week: string) {
    setSelectedWeek(week)
    const map: Record<string, boolean> = {}
    for (const m of members) {
      const p = payments.find(p => p.member_id === m.id && p.week_date === week)
      map[m.id] = p?.paid ?? false
    }
    setPaidMap(map)
    setWeekLoaded(week)
  }

  async function savePayments() {
    setSaving(true)
    const rows = members.map(m => ({ member_id: m.id, paid: paidMap[m.id] ?? false, collected_by: collectedBy || null }))
    await fetch(`/api/lottery/syndicates/${syndicateId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ week_date: selectedWeek, payments: rows }),
    })
    setSaving(false)
    onSave()
  }

  // Payment summary grid: last 8 weeks
  const recentWeeks = existingWeeks.slice(0, 8)
  const paymentByMemberWeek: Record<string, Record<string, boolean>> = {}
  for (const p of payments) {
    if (!paymentByMemberWeek[p.member_id]) paymentByMemberWeek[p.member_id] = {}
    paymentByMemberWeek[p.member_id][p.week_date] = p.paid
  }

  return (
    <div className="space-y-6">
      {/* Entry form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-sm">Record payments for week</h3>
        <div className="flex gap-3 items-end">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Week date</label>
            <input
              type="date"
              value={selectedWeek}
              onChange={e => setSelectedWeek(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Collected by (optional)</label>
            <input
              value={collectedBy}
              onChange={e => setCollectedBy(e.target.value)}
              placeholder="e.g. Rich"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>
          <button onClick={() => loadWeek(selectedWeek)} className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition">
            Load
          </button>
        </div>

        {weekLoaded === selectedWeek && (
          <div className="space-y-2">
            {members.map(m => (
              <label key={m.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paidMap[m.id] ?? false}
                  onChange={e => setPaidMap(prev => ({ ...prev, [m.id]: e.target.checked }))}
                  className="w-4 h-4 accent-lime-400"
                />
                <span className="text-sm">{m.name}</span>
                <span className="text-xs text-gray-500">
                  {paidMap[m.id] ? `£${(entryFeePence / 100).toFixed(2)} paid` : 'not paid'}
                </span>
              </label>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={savePayments} disabled={saving} className="bg-lime-400 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-lime-300 disabled:opacity-50 transition">
                {saving ? 'Saving…' : 'Save payments'}
              </button>
              <span className="text-xs text-gray-400">
                {Object.values(paidMap).filter(Boolean).length} / {members.length} paid
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Payment grid */}
      {recentWeeks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="text-sm w-full">
            <thead>
              <tr>
                <th className="text-left text-gray-400 font-medium py-2 pr-4 whitespace-nowrap">Member</th>
                {recentWeeks.map(w => (
                  <th key={w} className="text-center text-gray-400 font-medium py-2 px-2 whitespace-nowrap text-xs">{w.slice(5)}</th>
                ))}
                <th className="text-center text-gray-400 font-medium py-2 px-2 whitespace-nowrap">Total</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => {
                const memberPayments = paymentByMemberWeek[m.id] ?? {}
                const total = Object.values(memberPayments).filter(Boolean).length
                return (
                  <tr key={m.id} className="border-t border-gray-800">
                    <td className="py-2 pr-4 whitespace-nowrap font-medium">{m.name}</td>
                    {recentWeeks.map(w => (
                      <td key={w} className="text-center py-2 px-2">
                        {memberPayments[w] === true ? '✓' : memberPayments[w] === false ? '✗' : '–'}
                      </td>
                    ))}
                    <td className="text-center py-2 px-2 font-semibold">{total}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Draws tab ──────────────────────────────────────────────────────────────────

function DrawsTab({ syndicateId, draws, members, cycle, onSave }: {
  syndicateId: string; draws: Draw[]; members: Member[]; cycle: number; onSave: () => void
}) {
  const emptyBalls = { ball1: '', ball2: '', ball3: '', ball4: '', ball5: '', ball6: '', bonus_ball: '' }
  const [form, setForm] = useState({ draw_date: new Date().toISOString().slice(0, 10), ...emptyBalls })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [winnerAlert, setWinnerAlert] = useState<string | null>(null)

  async function addDraw(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setWinnerAlert(null)

    const res = await fetch(`/api/lottery/syndicates/${syndicateId}/draws`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        draw_date:  form.draw_date,
        ball1:      parseInt(form.ball1),
        ball2:      parseInt(form.ball2),
        ball3:      parseInt(form.ball3),
        ball4:      parseInt(form.ball4),
        ball5:      parseInt(form.ball5),
        ball6:      parseInt(form.ball6),
        bonus_ball: form.bonus_ball ? parseInt(form.bonus_ball) : null,
      }),
    })

    if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Error'); setSaving(false); return }

    const newDraw: Draw = await res.json()
    // Check if anyone now has 0 needs
    const allDraws = [newDraw, ...draws]
    const winners = members.filter(m => computeNeeds(memberNumbers(m), allDraws, cycle) === 0)
    if (winners.length > 0) {
      setWinnerAlert(`🎉 Winner${winners.length > 1 ? 's' : ''}! ${winners.map(w => w.name).join(', ')} — record the win in the Winners tab.`)
    }

    setForm({ draw_date: form.draw_date, ...emptyBalls })
    setSaving(false)
    onSave()
  }

  async function deleteDraw(id: string) {
    if (!confirm('Delete this draw?')) return
    await fetch(`/api/lottery/syndicates/${syndicateId}/draws`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    onSave()
  }

  return (
    <div className="space-y-6">
      {winnerAlert && (
        <div className="bg-yellow-900/60 border border-yellow-600 rounded-xl p-4 text-yellow-200 text-sm font-medium">
          {winnerAlert}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-4">Add draw result</h3>
        <form onSubmit={addDraw} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Draw date</label>
            <input type="date" value={form.draw_date} onChange={e => setForm(f => ({ ...f, draw_date: e.target.value }))} required className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Main balls (1–59)</label>
            <div className="grid grid-cols-6 gap-2">
              {(['ball1','ball2','ball3','ball4','ball5','ball6'] as const).map((k, i) => (
                <input key={k} type="number" min="1" max="59" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={String(i+1)} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-gray-500" />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Bonus ball (optional)</label>
            <input type="number" min="1" max="59" value={form.bonus_ball} onChange={e => setForm(f => ({ ...f, bonus_ball: e.target.value }))} placeholder="Bonus" className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-gray-500" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={saving} className="bg-lime-400 text-gray-950 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-lime-300 disabled:opacity-50 transition">
            {saving ? 'Saving…' : 'Add draw'}
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {draws.length === 0 && <p className="text-gray-400 text-sm">No draws recorded yet.</p>}
        {draws.map(d => (
          <div key={d.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{d.draw_date} <span className="text-gray-500 text-xs ml-2">Cycle {d.pot_cycle}</span></p>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {[d.ball1,d.ball2,d.ball3,d.ball4,d.ball5,d.ball6].map((n, i) => (
                  <span key={i} className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-blue-800 text-white">{n}</span>
                ))}
                {d.bonus_ball && (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-orange-700 text-white ml-1">{d.bonus_ball}</span>
                )}
              </div>
            </div>
            <button onClick={() => deleteDraw(d.id)} className="text-xs text-gray-500 hover:text-red-400 transition shrink-0">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Winners tab ────────────────────────────────────────────────────────────────

function WinnersTab({ syndicateId, winners, members, entryFeePence, totalPaid, onSave }: {
  syndicateId: string; winners: Winner[]; members: Member[]; entryFeePence: number; totalPaid: number; onSave: () => void
}) {
  const [form, setForm] = useState({ member_id: '', draw_date: new Date().toISOString().slice(0, 10), amount_pence: String(totalPaid * entryFeePence), notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function recordWinner(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')

    const res = await fetch(`/api/lottery/syndicates/${syndicateId}/winners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        member_id:    form.member_id,
        draw_date:    form.draw_date,
        amount_pence: parseInt(form.amount_pence),
        notes:        form.notes || null,
      }),
    })

    if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Error'); setSaving(false); return }
    setSaving(false)
    setForm({ member_id: '', draw_date: new Date().toISOString().slice(0, 10), amount_pence: '0', notes: '' })
    onSave()
  }

  async function togglePaidOut(w: Winner) {
    await fetch(`/api/lottery/syndicates/${syndicateId}/winners`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: w.id, paid_out: !w.paid_out }),
    })
    onSave()
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-4">Record winner</h3>
        <form onSubmit={recordWinner} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Winner</label>
            <select value={form.member_id} onChange={e => setForm(f => ({ ...f, member_id: e.target.value }))} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500">
              <option value="">Select member…</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Draw date</label>
              <input type="date" value={form.draw_date} onChange={e => setForm(f => ({ ...f, draw_date: e.target.value }))} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Amount (pence)</label>
              <input type="number" min="0" value={form.amount_pence} onChange={e => setForm(f => ({ ...f, amount_pence: e.target.value }))} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Notes (optional)</label>
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="e.g. Winnings sent to winner" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={saving} className="bg-lime-400 text-gray-950 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-lime-300 disabled:opacity-50 transition">
            {saving ? 'Saving…' : 'Record win & start new cycle'}
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {winners.length === 0 && <p className="text-gray-400 text-sm">No winners recorded yet.</p>}
        {winners.map(w => (
          <div key={w.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{w.syndicate_members?.name ?? '–'}</p>
              <p className="text-sm text-gray-400">{w.draw_date} · £{(w.amount_pence / 100).toFixed(2)} · Cycle {w.pot_cycle}</p>
              {w.notes && <p className="text-xs text-gray-500 mt-0.5">{w.notes}</p>}
            </div>
            <button
              onClick={() => togglePaidOut(w)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                w.paid_out
                  ? 'border-green-700 text-green-400 hover:bg-green-900/30'
                  : 'border-gray-600 text-gray-400 hover:text-white'
              }`}
            >
              {w.paid_out ? '✓ Paid out' : 'Mark paid out'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
