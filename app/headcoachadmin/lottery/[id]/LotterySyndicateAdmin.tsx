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
  stripe_account_id: string | null
  stripe_onboarding_complete: boolean
}

interface Member {
  id: string
  name: string
  email: string | null
  number1: number; number2: number; number3: number
  number4: number; number5: number; number6: number
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
  payment_method: string
}

interface Draw {
  id: string
  draw_date: string
  ball1: number; ball2: number; ball3: number
  ball4: number; ball5: number; ball6: number
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

function drawnInCycle(draws: Draw[], cycle: number): Set<number> {
  const s = new Set<number>()
  for (const d of draws) {
    if (d.pot_cycle !== cycle) continue
    s.add(d.ball1); s.add(d.ball2); s.add(d.ball3)
    s.add(d.ball4); s.add(d.ball5); s.add(d.ball6)
  }
  return s
}

function cycleDraws(draws: Draw[], cycle: number): Draw[] {
  return draws.filter(d => d.pot_cycle === cycle).sort((a, b) => a.draw_date.localeCompare(b.draw_date))
}

function cycleLabel(draws: Draw[], cycle: number): string {
  const first = cycleDraws(draws, cycle)[0]
  if (!first) return 'New cycle'
  return `Started ${formatDate(first.draw_date)}`
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00Z')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Is a member eligible? Must have paid for every draw week in the current cycle.
function isEligible(memberId: string, cyclDraws: Draw[], payments: Payment[]): boolean {
  if (cyclDraws.length === 0) return false
  const paidWeeks = new Set(payments.filter(p => p.member_id === memberId && p.paid).map(p => p.week_date))
  return cyclDraws.every(d => paidWeeks.has(d.draw_date))
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

function Ball({ n, matched }: { n: number; matched: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
      matched ? 'bg-yellow-400 text-gray-950' : 'bg-gray-700 text-gray-200'
    }`}>{n}</span>
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
    { key: 'winners',     label: 'History' },
  ]

  function refresh() { router.refresh() }

  const activeMembers = initialMembers.filter(m => !m.left_at)
  const cycle = syndicate.current_pot_cycle
  const cDraws = cycleDraws(initialDraws, cycle)
  const cycleStart = cDraws[0]?.draw_date ?? null
  const latestDraw  = cDraws[cDraws.length - 1]?.draw_date ?? null
  const drawn = drawnInCycle(initialDraws, cycle)

  const potPence = (cycleStart && latestDraw)
    ? initialPayments.filter(p => p.paid && p.week_date >= cycleStart && p.week_date <= latestDraw).length * syndicate.entry_fee_pence
    : 0
  const reservedPence = latestDraw
    ? initialPayments.filter(p => p.paid && p.week_date > latestDraw).length * syndicate.entry_fee_pence
    : 0

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <Link href="/headcoachadmin/lottery" className="text-gray-400 hover:text-white text-sm">← Syndicates</Link>
        </div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-heading text-2xl font-bold">{syndicate.name}</h1>
            <p className="text-gray-400 text-sm mt-1">
              £{(syndicate.entry_fee_pence / 100).toFixed(2)}/week · {cycleLabel(initialDraws, cycle)} · {activeMembers.length} members
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Jackpot</p>
            <p className="font-heading text-2xl font-bold text-yellow-400">£{(potPence / 100).toFixed(2)}</p>
            {reservedPence > 0 && <p className="text-xs text-gray-500 mt-0.5">+£{(reservedPence / 100).toFixed(2)} reserved</p>}
          </div>
        </div>

        {/* Stripe Connect status */}
        <StripeConnectBanner syndicateId={syndicate.id} connected={syndicate.stripe_onboarding_complete} hasAccount={!!syndicate.stripe_account_id} onRefresh={refresh} />

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-800 mb-6 mt-4">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 text-sm font-medium transition ${
              tab === t.key ? 'text-white border-b-2 border-lime-400 -mb-px' : 'text-gray-400 hover:text-white'
            }`}>{t.label}</button>
          ))}
        </div>

        {tab === 'leaderboard' && (
          <LeaderboardTab
            members={activeMembers} draws={initialDraws} payments={initialPayments}
            cycle={cycle} drawn={drawn} cDraws={cDraws} syndicateId={syndicate.id}
            potPence={potPence} onConfirmWinner={refresh}
          />
        )}
        {tab === 'members' && (
          <MembersTab syndicateId={syndicate.id} members={initialMembers} appUrl={appUrl} onSave={refresh} />
        )}
        {tab === 'payments' && (
          <PaymentsTab syndicateId={syndicate.id} members={activeMembers} payments={initialPayments} draws={cDraws} entryFeePence={syndicate.entry_fee_pence} onSave={refresh} />
        )}
        {tab === 'draws' && (
          <DrawsTab syndicateId={syndicate.id} draws={initialDraws} members={activeMembers} cycle={cycle} onSave={refresh} />
        )}
        {tab === 'winners' && (
          <WinnersTab winners={initialWinners} draws={initialDraws} />
        )}
      </div>
    </div>
  )
}

// ── Stripe Connect banner ──────────────────────────────────────────────────────

function StripeConnectBanner({ syndicateId, connected, hasAccount, onRefresh }: {
  syndicateId: string; connected: boolean; hasAccount: boolean; onRefresh: () => void
}) {
  const [loading, setLoading] = useState(false)

  async function connectStripe() {
    setLoading(true)
    const res = await fetch(`/api/lottery/syndicates/${syndicateId}/stripe-onboard`, { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(false)
  }

  if (connected) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 border border-green-800 rounded-lg px-3 py-2">
        <span>✓</span>
        <span>Stripe Connect active — members can pay online, funds go directly to you</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
      <div>
        <p className="text-sm font-medium">Connect Stripe to accept online payments</p>
        <p className="text-xs text-gray-400 mt-0.5">Funds go straight to your account — playdrawr never holds them</p>
      </div>
      <button
        onClick={connectStripe}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 transition shrink-0 ml-4"
      >
        {loading ? 'Redirecting…' : hasAccount ? 'Continue setup' : 'Connect Stripe'}
      </button>
    </div>
  )
}

// ── Leaderboard tab ─────────────────────────────────────────────────────────────

function LeaderboardTab({ members, draws, payments, cycle, drawn, cDraws, syndicateId, potPence, onConfirmWinner }: {
  members: Member[]; draws: Draw[]; payments: Payment[]; cycle: number; drawn: Set<number>
  cDraws: Draw[]; syndicateId: string; potPence: number; onConfirmWinner: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [confirmMemberId, setConfirmMemberId] = useState('')
  const [confirmDate, setConfirmDate] = useState(cDraws[cDraws.length - 1]?.draw_date ?? new Date().toISOString().slice(0, 10))
  const [confirmNotes, setConfirmNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const ranked = [...members]
    .map(m => ({
      member: m,
      needs:     memberNumbers(m).filter(n => !drawn.has(n)).length,
      eligible:  isEligible(m.id, cDraws, payments),
    }))
    .sort((a, b) => a.needs - b.needs)

  const winners = ranked.filter(r => r.needs === 0 && r.eligible)

  async function confirmWinner(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const res = await fetch(`/api/lottery/syndicates/${syndicateId}/winners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_id: confirmMemberId, draw_date: confirmDate, amount_pence: potPence, notes: confirmNotes || null }),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Error'); setSaving(false); return }
    setSaving(false); setConfirming(false); onConfirmWinner()
  }

  return (
    <div className="space-y-4">
      {/* Winner alert */}
      {winners.length > 0 && !confirming && (
        <div className="bg-yellow-900/40 border border-yellow-600 rounded-xl p-4">
          <p className="font-semibold text-yellow-300 mb-2">🎉 {winners.map(w => w.member.name).join(', ')} {winners.length > 1 ? 'have' : 'has'} all 6 numbers matched!</p>
          <button
            onClick={() => { setConfirming(true); setConfirmMemberId(winners[0].member.id) }}
            className="bg-yellow-400 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
          >
            Confirm winner &amp; start new cycle
          </button>
        </div>
      )}

      {/* Confirm winner form */}
      {confirming && (
        <div className="bg-gray-900 border border-yellow-600 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-yellow-300">Confirm winner</h3>
          <form onSubmit={confirmWinner} className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Winner</label>
              <select value={confirmMemberId} onChange={e => setConfirmMemberId(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                <option value="">Select…</option>
                {ranked.filter(r => r.eligible).map(r => (
                  <option key={r.member.id} value={r.member.id}>{r.member.name} ({r.needs} still needed)</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Draw date</label>
                <input type="date" value={confirmDate} onChange={e => setConfirmDate(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Pot (£)</label>
                <p className="text-sm font-semibold text-yellow-400 py-2">£{(potPence / 100).toFixed(2)}</p>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Notes (optional)</label>
              <input value={confirmNotes} onChange={e => setConfirmNotes(e.target.value)} placeholder="e.g. Paid via bank transfer" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="bg-yellow-400 text-gray-950 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition">
                {saving ? 'Saving…' : 'Confirm & start new cycle'}
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="text-gray-400 text-sm px-4 py-2 hover:text-white">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Manual confirm button (no auto-winner yet) */}
      {!confirming && winners.length === 0 && cDraws.length > 0 && (
        <div className="flex justify-end">
          <button onClick={() => setConfirming(true)} className="text-xs text-gray-500 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition">
            Confirm winner manually
          </button>
        </div>
      )}

      {/* Rankings */}
      <div className="space-y-2">
        {ranked.length === 0 && <p className="text-gray-400 text-sm">No members yet.</p>}
        {ranked.map(({ member: m, needs, eligible }, i) => {
          const nums = memberNumbers(m)
          return (
            <div key={m.id} className={`bg-gray-900 border rounded-xl p-4 flex items-center gap-4 ${eligible ? 'border-gray-800' : 'border-gray-800 opacity-60'}`}>
              <span className="text-gray-500 text-sm w-6 shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{m.name}</p>
                  {!eligible && cDraws.length > 0 && (
                    <span className="text-xs bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded">ineligible</span>
                  )}
                </div>
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
      </div>
      {[...drawn].length > 0 && (
        <p className="text-xs text-gray-600">Drawn this cycle: {[...drawn].sort((a, b) => a - b).join(', ')}</p>
      )}
    </div>
  )
}

// ── Members tab ─────────────────────────────────────────────────────────────────

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
    setEditing(m); setShowAdd(true); setError('')
  }

  async function save() {
    setSaving(true); setError('')
    const payload = {
      ...(editing ? { id: editing.id } : {}),
      name: form.name, email: form.email || null,
      number1: parseInt(form.number1), number2: parseInt(form.number2), number3: parseInt(form.number3),
      number4: parseInt(form.number4), number5: parseInt(form.number5), number6: parseInt(form.number6),
    }
    const res = await fetch(`/api/lottery/syndicates/${syndicateId}/members`, {
      method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Error'); setSaving(false); return }
    setSaving(false); setShowAdd(false); setEditing(null); onSave()
  }

  async function markLeft(m: Member) {
    if (!confirm(`Mark ${m.name} as having left?`)) return
    await fetch(`/api/lottery/syndicates/${syndicateId}/members`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...m, left_at: new Date().toISOString() }),
    })
    onSave()
  }

  async function remove(m: Member) {
    if (!confirm(`Permanently delete ${m.name}?`)) return
    await fetch(`/api/lottery/syndicates/${syndicateId}/members`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: m.id }),
    })
    onSave()
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${appUrl}/lottery/${token}`)
    setCopied(token); setTimeout(() => setCopied(null), 2000)
  }

  const active = members.filter(m => !m.left_at)
  const former = members.filter(m => m.left_at)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{active.length} active members</p>
        <button onClick={startAdd} className="bg-lime-400 text-gray-950 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-lime-300 transition">+ Add member</button>
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
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder="email@example.com" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Lottery numbers (1–59)</label>
            <div className="grid grid-cols-6 gap-2">
              {(['number1','number2','number3','number4','number5','number6'] as const).map((k, i) => (
                <input key={k} type="number" min="1" max="59" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={String(i + 1)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-gray-500" />
              ))}
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="bg-lime-400 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-lime-300 disabled:opacity-50 transition">{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 text-sm px-4 py-2 hover:text-white">Cancel</button>
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
                  {memberNumbers(m).map(n => <span key={n} className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-gray-700 text-gray-200">{n}</span>)}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => copyLink(m.view_token)} className="text-xs text-gray-400 hover:text-white px-2 py-1 border border-gray-700 rounded-lg transition">{copied === m.view_token ? '✓ Copied' : 'Copy link'}</button>
                <button onClick={() => startEdit(m)} className="text-xs text-gray-400 hover:text-white px-2 py-1 border border-gray-700 rounded-lg transition">Edit</button>
                <button onClick={() => markLeft(m)} className="text-xs text-gray-400 hover:text-yellow-400 px-2 py-1 border border-gray-700 rounded-lg transition">Left</button>
                <button onClick={() => remove(m)} className="text-xs text-gray-400 hover:text-red-400 px-2 py-1 border border-gray-700 rounded-lg transition">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {former.length > 0 && (
        <details className="mt-2">
          <summary className="text-sm text-gray-500 cursor-pointer">Former members ({former.length})</summary>
          <div className="mt-2 space-y-2">
            {former.map(m => (
              <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 opacity-60">
                <p className="font-medium">{m.name} <span className="text-xs text-gray-500">left {m.left_at?.slice(0, 10)}</span></p>
                <div className="flex gap-1 mt-2">{memberNumbers(m).map(n => <span key={n} className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-gray-700 text-gray-400">{n}</span>)}</div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}

// ── Payments tab ─────────────────────────────────────────────────────────────────
// Shows: cycle draw dates (paid/unpaid) + next 8 Wednesdays (upcoming)
// Admin can manually toggle any cell. Stripe payments are marked automatically via webhook.

function PaymentsTab({ syndicateId, members, payments, draws, entryFeePence, onSave }: {
  syndicateId: string; members: Member[]; payments: Payment[]; draws: Draw[]; entryFeePence: number; onSave: () => void
}) {
  const [toggling, setToggling] = useState<string | null>(null)

  // Weeks to show: all cycle draw dates + next 8 Wednesdays
  const cycleWeeks = draws.map(d => d.draw_date)
  const upcoming   = nextWednesdays(8).filter(w => !cycleWeeks.includes(w))
  const allWeeks   = [...new Set([...cycleWeeks, ...upcoming])].sort()

  // Payment lookup: member_id → week_date → Payment
  const lookup = useMemo(() => {
    const m: Record<string, Record<string, Payment>> = {}
    for (const p of payments) {
      if (!m[p.member_id]) m[p.member_id] = {}
      m[p.member_id][p.week_date] = p
    }
    return m
  }, [payments])

  async function toggle(memberId: string, weekDate: string, currentPaid: boolean) {
    const key = `${memberId}-${weekDate}`
    setToggling(key)
    await fetch(`/api/lottery/syndicates/${syndicateId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ week_date: weekDate, payments: [{ member_id: memberId, paid: !currentPaid }] }),
    })
    setToggling(null)
    onSave()
  }

  const isPast = (w: string) => w <= (new Date().toISOString().slice(0, 10))
  const isCycleWeek = (w: string) => cycleWeeks.includes(w)

  return (
    <div className="overflow-x-auto">
      <table className="text-xs w-full">
        <thead>
          <tr>
            <th className="text-left text-gray-400 font-medium py-2 pr-3 whitespace-nowrap sticky left-0 bg-gray-950">Member</th>
            {allWeeks.map(w => (
              <th key={w} className={`text-center font-medium py-2 px-1.5 whitespace-nowrap ${isCycleWeek(w) ? 'text-white' : 'text-gray-500'}`}>
                {w.slice(5)}{isCycleWeek(w) ? ' 🎱' : ''}
              </th>
            ))}
            <th className="text-center text-gray-400 font-medium py-2 px-2">Paid</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => {
            const mPayments = lookup[m.id] ?? {}
            const totalPaid = Object.values(mPayments).filter(p => p.paid).length
            return (
              <tr key={m.id} className="border-t border-gray-800/50">
                <td className="py-2 pr-3 whitespace-nowrap font-medium sticky left-0 bg-gray-950">{m.name}</td>
                {allWeeks.map(w => {
                  const p = mPayments[w]
                  const paid = p?.paid ?? false
                  const key = `${m.id}-${w}`
                  const isStripe = p?.payment_method === 'stripe'
                  const past = isPast(w)

                  return (
                    <td key={w} className="text-center py-1.5 px-1.5">
                      <button
                        onClick={() => !isStripe && toggle(m.id, w, paid)}
                        disabled={toggling === key || isStripe}
                        title={isStripe ? 'Paid via Stripe' : paid ? 'Mark unpaid' : 'Mark paid'}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                          paid
                            ? isStripe ? 'bg-indigo-600 text-white cursor-default' : 'bg-green-700 text-white hover:bg-red-700'
                            : past
                            ? 'bg-red-900/60 text-red-400 hover:bg-green-700 hover:text-white'
                            : 'bg-gray-800 text-gray-500 hover:bg-green-700 hover:text-white'
                        }`}
                      >
                        {toggling === key ? '…' : paid ? (isStripe ? '£' : '✓') : past ? '✗' : '–'}
                      </button>
                    </td>
                  )
                })}
                <td className="text-center py-2 px-2 font-semibold text-gray-300">{totalPaid}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-xs text-gray-600 mt-3">🎱 = draw week · £ = paid via Stripe · click to toggle manual payments</p>
    </div>
  )
}

// ── Draws tab ─────────────────────────────────────────────────────────────────

function DrawsTab({ syndicateId, draws, members, cycle, onSave }: {
  syndicateId: string; draws: Draw[]; members: Member[]; cycle: number; onSave: () => void
}) {
  const emptyBalls = { ball1: '', ball2: '', ball3: '', ball4: '', ball5: '', ball6: '', bonus_ball: '' }
  const [form, setForm] = useState({ draw_date: nextWednesdays(1)[0], ...emptyBalls })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [winnerAlert, setWinnerAlert] = useState<string | null>(null)

  const drawn = drawnInCycle(draws, cycle)
  const cDraws = cycleDraws(draws, cycle)

  async function addDraw(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setWinnerAlert(null)

    const res = await fetch(`/api/lottery/syndicates/${syndicateId}/draws`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        draw_date: form.draw_date,
        ball1: parseInt(form.ball1), ball2: parseInt(form.ball2), ball3: parseInt(form.ball3),
        ball4: parseInt(form.ball4), ball5: parseInt(form.ball5), ball6: parseInt(form.ball6),
        bonus_ball: form.bonus_ball ? parseInt(form.bonus_ball) : null,
      }),
    })

    if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Error'); setSaving(false); return }

    const newDraw: Draw = await res.json()
    const allDraws = [...draws, newDraw]
    const newDrawn = drawnInCycle(allDraws, cycle)
    const potentialWinners = members.filter(m => memberNumbers(m).every(n => newDrawn.has(n)))
    if (potentialWinners.length > 0) {
      setWinnerAlert(`🎉 Potential winner${potentialWinners.length > 1 ? 's' : ''}! ${potentialWinners.map(w => w.name).join(', ')} — go to Leaderboard to confirm.`)
    }

    setForm(f => ({ ...f, ...emptyBalls }))
    setSaving(false)
    onSave()
  }

  async function deleteDraw(id: string) {
    if (!confirm('Delete this draw?')) return
    await fetch(`/api/lottery/syndicates/${syndicateId}/draws`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
    })
    onSave()
  }

  return (
    <div className="space-y-6">
      {winnerAlert && (
        <div className="bg-yellow-900/60 border border-yellow-600 rounded-xl p-4 text-yellow-200 text-sm font-medium">{winnerAlert}</div>
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
        {cDraws.length === 0 && <p className="text-gray-400 text-sm">No draws this cycle yet.</p>}
        {[...cDraws].reverse().map(d => (
          <div key={d.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{formatDate(d.draw_date)}</p>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {[d.ball1,d.ball2,d.ball3,d.ball4,d.ball5,d.ball6].map((n, i) => (
                  <span key={i} className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-blue-800 text-white">{n}</span>
                ))}
                {d.bonus_ball && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-orange-700 text-white ml-1">{d.bonus_ball}</span>}
              </div>
            </div>
            <button onClick={() => deleteDraw(d.id)} className="text-xs text-gray-500 hover:text-red-400 transition shrink-0">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Winners history tab ────────────────────────────────────────────────────────

function WinnersTab({ winners, draws }: { winners: Winner[]; draws: Draw[] }) {
  if (winners.length === 0) {
    return <p className="text-gray-400 text-sm">No winners recorded yet.</p>
  }

  return (
    <div className="space-y-3">
      {winners.map(w => {
        const label = cycleLabel(draws, w.pot_cycle)
        return (
          <div key={w.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{w.syndicate_members?.name ?? '–'}</p>
                <p className="text-sm text-gray-400 mt-0.5">
                  {formatDate(w.draw_date)} · £{(w.amount_pence / 100).toFixed(2)} · {label}
                </p>
                {w.notes && <p className="text-xs text-gray-500 mt-1">{w.notes}</p>}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${w.paid_out ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                {w.paid_out ? 'Paid out' : 'Pending'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
