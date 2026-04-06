'use client'

import { useState, useRef, useEffect } from 'react'
import { DemoDrawClient } from '@/components/participant/DemoDrawClient'

interface Participant {
  id: string
  name: string
  email: string | null
  paid: boolean
}

interface Assignment {
  participant_id: string
  team_id: number
  team_name: string
  team_flag: string | null
}

interface Team {
  id: number
  name: string
  flag: string | null
  group_name: string | null
}

interface Sweepstake {
  id: string
  name: string
  share_token: string
  status: string
  entry_fee: number
  prize_type: string | null
  payout_structure: string | null
  assignment_mode: string
  draw_completed_at: string | null
  tournament_name: string | null
  plan: string
}

interface Props {
  sweepstake: Sweepstake
  participants: Participant[]
  assignments: Assignment[]
  teams: Team[]
}

type Tab = 'overview' | 'participants' | 'draw' | 'settings'
type SaveStatus = 'idle' | 'saved' | 'reverting'

// ── Inline editable name ──────────────────────────────────────────────────────
function EditableName({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setDraft(value) }, [value])
  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  function commit() {
    setEditing(false)
    const trimmed = draft.trim()
    if (trimmed && trimmed !== value) onChange(trimmed)
    else setDraft(value)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false) } }}
        className="flex-1 text-sm font-medium text-pitch bg-lime/10 border border-lime rounded px-1.5 py-0.5 focus:outline-none min-w-0"
        maxLength={50}
      />
    )
  }

  return (
    <button onClick={() => setEditing(true)} className="flex-1 text-sm font-medium text-pitch text-left truncate group flex items-center gap-1.5 min-w-0" title="Click to edit">
      <span className="truncate">{value}</span>
      <svg className="shrink-0 opacity-0 group-hover:opacity-40 transition-opacity" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M8.5 1.5l2 2L3 11H1V9L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

// ── Shell ─────────────────────────────────────────────────────────────────────
export function DemoOrganiserShell({ sweepstake, participants: originalParticipants, assignments, teams }: Props) {
  const [tab,        setTab]        = useState<Tab>('overview')
  const [participants, setParticipants] = useState<Participant[]>(originalParticipants)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [isDirty,    setIsDirty]    = useState(false)
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const participantTeams = new Map<string, Assignment[]>()
  for (const a of assignments) {
    if (!participantTeams.has(a.participant_id)) participantTeams.set(a.participant_id, [])
    participantTeams.get(a.participant_id)!.push(a)
  }

  const paidCount  = participants.filter(p => p.paid).length
  const totalPool  = participants.reduce((s, p) => s + (p.paid ? sweepstake.entry_fee : 0), 0)
  const drawnCount = new Set(assignments.map(a => a.participant_id)).size

  function updateName(id: string, name: string) { setParticipants(prev => prev.map(p => p.id === id ? { ...p, name } : p)); setIsDirty(true) }
  function togglePaid(id: string)                { setParticipants(prev => prev.map(p => p.id === id ? { ...p, paid: !p.paid } : p)); setIsDirty(true) }
  function markAllPaid()                          { setParticipants(prev => prev.map(p => ({ ...p, paid: true }))); setIsDirty(true) }

  function handleSave() {
    setSaveStatus('saved')
    setIsDirty(false)
    revertTimerRef.current = setTimeout(() => {
      setSaveStatus('reverting')
      setTimeout(() => { setParticipants(originalParticipants); setSaveStatus('idle') }, 600)
    }, 3000)
  }

  useEffect(() => () => { if (revertTimerRef.current) clearTimeout(revertTimerRef.current) }, [])

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview',     label: 'Overview' },
    { id: 'participants', label: 'Participants' },
    { id: 'draw',         label: 'Draw' },
    { id: 'settings',     label: 'Settings' },
  ]

  const shareUrl = `playdrawr.co.uk/s/${sweepstake.share_token}`

  return (
    <div className="space-y-5">
      {/* Demo notice */}
      <div className="bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm">
        <strong className="text-pitch">Organiser dashboard (demo)</strong>
        <span className="text-pitch/60"> — this is the real dashboard organisers use. Try editing names and toggling payments — changes revert automatically.</span>
      </div>

      {/* Dashboard-style header */}
      <div className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
        <div className="px-5 pt-5 pb-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-mid mb-1">My sweepstakes › <span className="text-pitch">{sweepstake.name}</span></p>
              <h2 className="font-heading text-xl font-bold text-pitch tracking-tight">{sweepstake.name}</h2>
            </div>
            <span className={`mt-1 text-xs font-medium px-2.5 py-1 rounded-full ${
              sweepstake.status === 'active'   ? 'bg-lime/30 text-pitch' :
              sweepstake.status === 'complete' ? 'bg-gold/20 text-pitch' :
              'bg-light text-mid'
            }`}>
              {sweepstake.status}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.id ? 'border-grass text-pitch' : 'border-transparent text-mid hover:text-pitch'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Participants',    value: participants.length },
              { label: 'Paid',           value: paidCount },
              { label: 'Teams assigned', value: drawnCount },
              { label: 'Entry fee',      value: sweepstake.entry_fee > 0 ? `£${Number(sweepstake.entry_fee).toFixed(2)}` : '—' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-[#E5EDEA]">
                <p className="text-2xl font-heading font-bold text-pitch">{s.value}</p>
                <p className="text-xs text-mid mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Share link */}
          <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
            <h3 className="font-heading font-bold text-pitch tracking-tight mb-1">Participant link</h3>
            <p className="text-sm text-mid mb-3">Share this with your participants — no login needed.</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-light rounded-lg px-3 py-2 text-sm text-pitch font-mono truncate">
                {shareUrl}
              </code>
              <span className="shrink-0 bg-lime/30 text-pitch text-xs font-medium px-3 py-2 rounded-lg">
                Copy →
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
            <h3 className="font-heading font-bold text-pitch tracking-tight mb-3">Details</h3>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {[
                { label: 'Tournament',       value: sweepstake.tournament_name ?? '—' },
                { label: 'Assignment mode',  value: sweepstake.assignment_mode },
                { label: 'Prize type',       value: sweepstake.prize_type ?? '—' },
                { label: 'Payout',           value: sweepstake.payout_structure === 'top_3' ? 'Top 3' : 'Winner only' },
              ].map(d => (
                <div key={d.label}>
                  <dt className="text-xs text-mid uppercase tracking-wide mb-0.5">{d.label}</dt>
                  <dd className="text-pitch capitalize">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Prize pool */}
          {sweepstake.entry_fee > 0 && (
            <div className="bg-white rounded-xl border border-[#E5EDEA] p-5 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-pitch tracking-tight">Prize pool</h3>
                <p className="text-sm text-mid mt-0.5">{paidCount} of {participants.length} paid</p>
              </div>
              <span className="font-heading text-3xl font-bold text-pitch">£{totalPool.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {/* ── PARTICIPANTS ── */}
      {tab === 'participants' && (
        <div className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E5EDEA] flex items-center justify-between gap-3">
            <h3 className="font-heading font-bold text-pitch shrink-0">
              Participants
              <span className="ml-2 text-sm font-normal text-mid font-body">{participants.length}/48</span>
            </h3>
            <div className="flex items-center gap-3 ml-auto">
              {saveStatus === 'saved' && (
                <span className="text-xs text-grass font-medium">✓ Saved! (reverting in 3s… this is a demo 😄)</span>
              )}
              {saveStatus === 'reverting' && (
                <span className="text-xs text-mid italic">Reverting…</span>
              )}
              {paidCount < participants.length && (
                <button onClick={markAllPaid} className="text-xs text-grass font-medium hover:underline shrink-0">Mark all paid</button>
              )}
              {isDirty && saveStatus === 'idle' && (
                <button onClick={handleSave} className="text-xs bg-lime text-pitch font-medium px-3 py-1.5 rounded-lg hover:bg-[#b8e03d] transition-colors shrink-0">
                  Save changes
                </button>
              )}
            </div>
          </div>
          <ul className="divide-y divide-[#E5EDEA]/60">
            {participants.map(p => {
              const myTeams = participantTeams.get(p.id) ?? []
              return (
                <li key={p.id} className={`flex items-center gap-3 px-5 py-3 transition-opacity ${saveStatus === 'reverting' ? 'opacity-40' : ''}`}>
                  <button onClick={() => togglePaid(p.id)} title={p.paid ? 'Mark unpaid' : 'Mark paid'}
                    className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${p.paid ? 'bg-grass hover:bg-red-400' : 'bg-[#D1D9D5] hover:bg-grass'}`} />
                  <EditableName value={p.name} onChange={name => updateName(p.id, name)} />
                  <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
                    {myTeams.map(a => (
                      <span key={a.team_id} className="text-sm" title={a.team_name}>{a.team_flag ?? '🏳️'}</span>
                    ))}
                    {myTeams.length === 0 && <span className="text-xs text-mid italic">No team</span>}
                  </div>
                  <button onClick={() => togglePaid(p.id)}
                    className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                      p.paid ? 'bg-lime/30 text-pitch hover:bg-red-100 hover:text-red-600' : 'bg-light text-mid hover:bg-lime/20 hover:text-pitch'
                    }`}>
                    {p.paid ? 'Paid' : 'Unpaid'}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* ── DRAW ── */}
      {tab === 'draw' && (
        <DemoDrawClient
          participants={originalParticipants}
          teams={teams}
          assignments={assignments}
          drawCompletedAt={sweepstake.draw_completed_at}
        />
      )}

      {/* ── SETTINGS ── */}
      {tab === 'settings' && (
        <div className="max-w-lg space-y-5">
          <div className="bg-white rounded-xl border border-[#E5EDEA] p-5 space-y-4">
            <h3 className="font-heading font-bold text-pitch tracking-tight">Sweepstake settings</h3>

            <div>
              <label className="block text-sm font-medium text-pitch mb-1.5">Name</label>
              <input type="text" defaultValue={sweepstake.name} readOnly
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch bg-light text-sm cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-pitch mb-1.5">Entry fee</label>
              <input type="text" defaultValue={`£${Number(sweepstake.entry_fee).toFixed(2)}`} readOnly
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch bg-light text-sm cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-pitch mb-1.5">Prize type</label>
              <input type="text" defaultValue={sweepstake.prize_type ?? 'money'} readOnly
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch bg-light text-sm cursor-not-allowed capitalize" />
            </div>
            <div>
              <label className="block text-sm font-medium text-pitch mb-1.5">Payout structure</label>
              <input type="text" defaultValue={sweepstake.payout_structure === 'top_3' ? 'Top 3' : 'Winner only'} readOnly
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch bg-light text-sm cursor-not-allowed" />
            </div>

            <p className="text-xs text-mid bg-light rounded-lg px-3 py-2">
              Settings are read-only in the demo. Create your own sweepstake to customise everything.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
