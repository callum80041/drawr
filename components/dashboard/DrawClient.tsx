'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ManualDraw } from '@/components/dashboard/ManualDraw'
import { WheelDraw } from '@/components/dashboard/WheelDraw'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

interface Team {
  id: number
  name: string
  flag: string | null
  logo_url: string | null
  group_name: string | null
}

interface Participant {
  id: string
  name: string
}

interface Assignment {
  id: string
  participant_id: string
  team_id: number
  team_name: string
  team_flag: string | null
}

interface Props {
  sweepstakeId: string
  sweepstakeName: string
  shareToken: string
  assignmentMode: string
  drawCompletedAt: string | null
  participants: Participant[]
  teams: Team[]
  initialAssignments: Assignment[]
}

type Phase = 'idle' | 'saving' | 'animating' | 'revealed' | 'confirm-redo' | 'wheel'
type DrawMode = 'auto' | 'manual' | 'wheel'

interface DrawItem {
  participant: Participant
  teams: Team[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function computeDraw(participants: Participant[], teams: Team[]): Map<string, Team[]> {
  const shuffledTeams = shuffle(teams)
  const result = new Map<string, Team[]>()
  participants.forEach(p => result.set(p.id, []))
  shuffledTeams.forEach((team, i) => {
    const p = participants[i % participants.length]
    result.get(p.id)!.push(team)
  })
  return result
}

function teamsPerParticipantLabel(n: number, total: number): string {
  const base = Math.floor(total / n)
  const extra = total % n
  if (extra === 0) return base === 1 ? '1 team each' : `${base} teams each`
  return `${base}–${base + 1} teams each`
}

// ── Big reveal card shown during animation ────────────────────────────────────
function RevealCard({ item, index, total }: { item: DrawItem; index: number; total: number }) {
  const primaryTeam = item.teams[0]
  const extraTeams  = item.teams.slice(1)

  return (
    <div
      key={index}
      className="bg-white rounded-2xl border-2 border-lime shadow-xl shadow-pitch/10 p-8 text-center max-w-xs mx-auto"
      style={{ animation: 'reveal-draw 0.35s ease both' }}
    >
      {/* Counter */}
      <p className="text-xs text-mid mb-5 tabular-nums">
        {index + 1} <span className="text-[#D1D9D5]">/</span> {total}
      </p>

      {/* Flag */}
      <div className="text-7xl mb-3 leading-none select-none">
        {primaryTeam.flag ?? '🏳️'}
      </div>

      {/* Team name */}
      <p className="font-heading text-2xl font-bold text-pitch leading-tight">
        {primaryTeam.name}
      </p>
      {primaryTeam.group_name && (
        <p className="text-xs text-mid mt-1">{primaryTeam.group_name}</p>
      )}

      {/* Extra teams (if participant got 2+) */}
      {extraTeams.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {extraTeams.map(t => (
            <span key={t.id} className="text-sm bg-light rounded-full px-2 py-0.5 text-pitch">
              {t.flag} {t.name}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <span className="flex-1 h-px bg-[#E5EDEA]" />
        <span className="text-[10px] uppercase tracking-widest text-mid">drawn by</span>
        <span className="flex-1 h-px bg-[#E5EDEA]" />
      </div>

      {/* Participant name */}
      <p className="font-heading text-xl font-bold text-grass tracking-tight">
        {item.participant.name}
      </p>
    </div>
  )
}

// ── Small card in growing grid ────────────────────────────────────────────────
function DrawnCard({ item }: { item: DrawItem }) {
  const primary = item.teams[0]
  return (
    <div
      className="bg-white rounded-xl border border-[#E5EDEA] p-3 space-y-1.5"
      style={{ animation: 'card-in 0.25s ease both' }}
    >
      <p className="font-heading font-bold text-pitch text-sm truncate leading-tight">
        {item.participant.name}
      </p>
      {item.teams.map(t => (
        <div key={t.id} className="flex items-center gap-1.5">
          <span className="text-base leading-none">{t.flag ?? '🏳️'}</span>
          <div>
            <p className="text-pitch text-xs font-medium leading-tight">{t.name}</p>
            {t.group_name && <p className="text-mid text-[10px]">{t.group_name}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

function ShareNativeButton({ shareToken }: { shareToken: string }) {
  const [canShare, setCanShare] = useState(false)
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])
  if (!canShare) return null
  return (
    <button
      onClick={() => navigator.share({
        title: 'World Cup 2026 Draw Results',
        text: 'Check out the draw results for our sweepstake!',
        url: `${APP_URL}/s/${shareToken}`,
      }).catch(() => {})}
      className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-white/20 transition-colors"
    >
      ↗ Share
    </button>
  )
}

export function DrawClient({
  sweepstakeId,
  sweepstakeName,
  shareToken,
  assignmentMode,
  drawCompletedAt,
  participants,
  teams,
  initialAssignments,
}: Props) {
  const supabase   = createClient()
  const [, startTransition] = useTransition()

  const buildMap = useCallback((assignments: Assignment[]) => {
    const map = new Map<string, Team[]>()
    participants.forEach(p => map.set(p.id, []))
    assignments.forEach(a => {
      const team = teams.find(t => t.id === a.team_id)
      if (team) map.get(a.participant_id)?.push(team)
    })
    return map
  }, [participants, teams])

  const [shareCopied,   setShareCopied]   = useState(false)
  const [phase,         setPhase]         = useState<Phase>(() =>
    drawCompletedAt && initialAssignments.length > 0 ? 'revealed' : 'idle'
  )
  const [assignmentMap, setAssignmentMap] = useState<Map<string, Team[]>>(() =>
    drawCompletedAt ? buildMap(initialAssignments) : new Map()
  )
  const [drawOrder,      setDrawOrder]      = useState<DrawItem[]>([])
  const [currentIdx,     setCurrentIdx]     = useState(0)
  const [drawMode,       setDrawMode]       = useState<DrawMode>('auto')
  const [error,          setError]          = useState('')
  const [lateJoinManual, setLateJoinManual] = useState(false)

  // Spread auto draw evenly over 24 seconds regardless of participant count
  const intervalMs = drawOrder.length > 0 ? Math.round(24000 / drawOrder.length) : 500

  // ── Advance animation ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'animating') return
    if (currentIdx >= drawOrder.length) {
      setPhase('revealed')
      return
    }
    if (drawMode === 'manual') return
    const timer = setTimeout(() => setCurrentIdx(i => i + 1), intervalMs)
    return () => clearTimeout(timer)
  }, [phase, currentIdx, drawOrder.length, intervalMs, drawMode])

  async function saveDrawToDb(map: Map<string, Team[]>) {
    const { error: delErr } = await supabase
      .from('assignments').delete().eq('sweepstake_id', sweepstakeId)
    if (delErr) throw delErr

    const rows: { sweepstake_id: string; participant_id: string; team_id: number; team_name: string; team_flag: string | null }[] = []
    for (const [participantId, ts] of map) {
      for (const team of ts) {
        rows.push({ sweepstake_id: sweepstakeId, participant_id: participantId, team_id: team.id, team_name: team.name, team_flag: team.flag })
      }
    }
    if (rows.length > 0) {
      const { error: insertErr } = await supabase.from('assignments').insert(rows)
      if (insertErr) throw insertErr
    }
    const { error: updateErr } = await supabase
      .from('sweepstakes')
      .update({ draw_completed_at: new Date().toISOString(), status: 'active' })
      .eq('id', sweepstakeId)
    if (updateErr) throw updateErr
  }

  function handleRunDraw(mode: DrawMode = 'auto') {
    if (participants.length === 0) return
    setDrawMode(mode)
    setError('')
    setPhase('saving')

    const map = computeDraw(participants, teams)

    startTransition(async () => {
      try {
        await saveDrawToDb(map)
        setAssignmentMap(map)

        if (mode === 'wheel') {
          // For wheel draw, go directly to wheel phase
          setPhase('wheel')
        } else {
          // For auto and manual, build draw order and go to animating phase
          const order: DrawItem[] = shuffle(participants).map(p => ({
            participant: p,
            teams: map.get(p.id) ?? [],
          }))
          setDrawOrder(order)
          setCurrentIdx(0)
          setPhase('animating')
        }

        // Fire-and-forget — don't block the animation on email delivery
        fetch('/api/email/draw-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sweepstakeId }),
        }).catch(() => { /* best-effort */ })
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Draw failed.')
        setPhase('idle')
      }
    })
  }

  function handleSkip() {
    setCurrentIdx(drawOrder.length)
    setPhase('revealed')
  }

  function handleRedoDraw()    { setPhase('confirm-redo') }
  function handleCancelRedo()  { setPhase('revealed') }
  function handleConfirmRedo() { setPhase('idle'); setAssignmentMap(new Map()); setDrawOrder([]) }

  // ── Late joiner handlers ──────────────────────────────────────────────────────

  function handleLateJoinManual() {
    setLateJoinManual(true)
  }

  function handleLateJoinRebalance() {
    // Take one extra team from participants who have 2+ teams, give to unassigned ones
    const unassigned = participants.filter(p => (assignmentMap.get(p.id) ?? []).length === 0)
    if (unassigned.length === 0) return
    setError('')

    const newMap = new Map<string, Team[]>()
    assignmentMap.forEach((ts, pid) => newMap.set(pid, [...ts]))

    for (const joiner of unassigned) {
      // Find whoever currently has the most teams (must be >1)
      let donorId: string | null = null
      let maxCount = 1
      newMap.forEach((ts, pid) => {
        if (ts.length > maxCount) { maxCount = ts.length; donorId = pid }
      })
      if (!donorId) break // Nobody has extras — can't rebalance further

      const donorTeams = [...newMap.get(donorId)!]
      const transferred = donorTeams.pop()!
      newMap.set(donorId, donorTeams)
      newMap.set(joiner.id, [transferred])
    }

    startTransition(async () => {
      try {
        await saveDrawToDb(newMap)
        setAssignmentMap(newMap)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to rebalance.')
      }
    })
  }

  function handleLateJoinFullRedraw() {
    setLateJoinManual(false)
    handleConfirmRedo() // Goes back to idle, organiser clicks "Run the Draw" again with animation
  }

  // ── Wheel draw ───────────────────────────────────────────────────────────────
  if (phase === 'wheel') {
    return (
      <WheelDraw
        sweepstakeName={sweepstakeName}
        participants={participants}
        teams={teams}
        assignmentMap={assignmentMap}
        onComplete={() => setPhase('revealed')}
        onSkip={handleSkip}
      />
    )
  }

  // ── Manual mode / late-join manual rearrange ─────────────────────────────────
  if (assignmentMode === 'manual' || lateJoinManual) {
    // Rebuild initialAssignments from current map so ManualDraw has latest state
    const currentAssignments: Assignment[] = []
    assignmentMap.forEach((ts, pid) => {
      ts.forEach(team => currentAssignments.push({
        id: '', participant_id: pid, team_id: team.id, team_name: team.name, team_flag: team.flag,
      }))
    })
    return (
      <ManualDraw
        sweepstakeId={sweepstakeId}
        participants={participants}
        teams={teams}
        initialAssignments={currentAssignments.length > 0 ? currentAssignments : initialAssignments}
        drawCompletedAt={drawCompletedAt}
      />
    )
  }

  // ── No participants ──────────────────────────────────────────────────────────
  if (participants.length === 0) {
    return (
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-10 text-center">
          <div className="text-4xl mb-3">👥</div>
          <h2 className="font-heading font-bold text-pitch text-lg mb-2">No participants yet</h2>
          <p className="text-mid text-sm">Add participants on the Participants tab before running the draw.</p>
        </div>
      </div>
    )
  }

  // ── Idle ─────────────────────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="max-w-lg">
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-8 text-center space-y-5">
          <div className="text-5xl">🎲</div>
          <div>
            <h2 className="font-heading font-bold text-pitch text-xl mb-1">Ready to draw</h2>
            <p className="text-mid text-sm">
              {participants.length} participant{participants.length !== 1 ? 's' : ''} · {teams.length} teams ·{' '}
              {teamsPerParticipantLabel(participants.length, teams.length)}
            </p>
          </div>
          <p className="text-mid text-sm leading-relaxed">
            Teams will be randomly shuffled and each participant drawn one by one.
          </p>
          {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div className="space-y-2">
            <button
              onClick={() => handleRunDraw('auto')}
              className="w-full bg-lime text-pitch font-heading font-bold text-lg py-3.5 rounded-xl hover:bg-[#b8e03d] transition-colors tracking-tight"
            >
              Auto draw →
            </button>
            <button
              onClick={() => handleRunDraw('wheel')}
              className="w-full bg-grass text-white font-heading font-bold text-lg py-3.5 rounded-xl hover:bg-[#0f5a38] transition-colors tracking-tight"
            >
              Wheel draw →
            </button>
            <button
              onClick={() => handleRunDraw('manual')}
              className="w-full bg-light text-pitch font-heading font-bold text-sm py-3 rounded-xl hover:bg-[#D1D9D5] transition-colors tracking-tight"
            >
              Draw manually (one at a time)
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Saving ───────────────────────────────────────────────────────────────────
  if (phase === 'saving') {
    return (
      <div className="max-w-lg">
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-12 text-center space-y-4">
          <div className="text-4xl animate-spin">🎱</div>
          <h2 className="font-heading font-bold text-pitch text-xl">Shuffling the hat…</h2>
        </div>
      </div>
    )
  }

  // ── Animating ────────────────────────────────────────────────────────────────
  if (phase === 'animating') {
    const currentItem = drawOrder[currentIdx]
    const drawnItems  = drawOrder.slice(0, currentIdx)

    return (
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">The draw is live</h2>
            <p className="text-mid text-sm mt-0.5">
              {currentIdx} of {drawOrder.length} drawn
            </p>
          </div>
          <div className="flex items-center gap-3">
            {drawMode === 'manual' ? (
              <button
                onClick={() => setCurrentIdx(i => i + 1)}
                className="text-sm font-heading font-bold text-pitch px-5 py-2 rounded-xl bg-lime hover:bg-[#b8e03d] transition-colors tracking-tight"
              >
                Draw next →
              </button>
            ) : null}
            <button
              onClick={handleSkip}
              className="text-xs text-mid hover:text-pitch transition-colors underline underline-offset-2"
            >
              Skip to end
            </button>
          </div>
        </div>

        {/* Big reveal card */}
        {currentItem && (
          <div className="flex justify-center py-2">
            <RevealCard key={currentIdx} item={currentItem} index={currentIdx} total={drawOrder.length} />
          </div>
        )}

        {/* Already drawn grid */}
        {drawnItems.length > 0 && (
          <div>
            <p className="text-xs font-medium text-mid uppercase tracking-wider mb-3">
              Already drawn ({drawnItems.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              {drawnItems.map(item => (
                <DrawnCard key={item.participant.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Confirm redo ─────────────────────────────────────────────────────────────
  if (phase === 'confirm-redo') {
    return (
      <div className="max-w-lg">
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-8 text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="font-heading font-bold text-pitch text-lg">Redo the draw?</h2>
          <p className="text-mid text-sm">This will clear all current team assignments.</p>
          <div className="flex gap-3">
            <button onClick={handleCancelRedo}  className="flex-1 bg-light text-pitch text-sm font-medium py-2.5 rounded-lg hover:bg-[#D1D9D5] transition-colors">Cancel</button>
            <button onClick={handleConfirmRedo} className="flex-1 bg-red-50 text-red-700 text-sm font-medium py-2.5 rounded-lg hover:bg-red-100 transition-colors">Yes, redo</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Revealed: full grid ───────────────────────────────────────────────────────
  const sortedParticipants = [...participants].sort((a, b) => a.name.localeCompare(b.name))
  const unassignedParticipants = participants.filter(p => (assignmentMap.get(p.id) ?? []).length === 0)
  const hasLateJoiners = unassignedParticipants.length > 0

  return (
    <div className="space-y-5">

      {/* Late joiners prompt */}
      {hasLateJoiners && (
        <div className="bg-white rounded-xl border-2 border-gold/50 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">🆕</span>
            <div>
              <h3 className="font-heading font-bold text-pitch">
                {unassignedParticipants.length} participant{unassignedParticipants.length !== 1 ? 's' : ''} joined after the draw
              </h3>
              <p className="text-mid text-sm mt-0.5">
                {unassignedParticipants.map(p => p.name).join(', ')}
              </p>
            </div>
          </div>

          <p className="text-sm text-pitch/70">How would you like to assign their teams?</p>

          {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleLateJoinManual}
              className="flex flex-col items-start gap-1.5 bg-light hover:bg-[#E5EDEA] border border-[#D1D9D5] rounded-xl p-4 text-left transition-colors group"
            >
              <span className="text-xl">🖱️</span>
              <span className="font-heading font-bold text-pitch text-sm">Manually move teams</span>
              <span className="text-xs text-mid leading-relaxed">Drag teams between participants yourself. Full control.</span>
            </button>

            <button
              onClick={handleLateJoinRebalance}
              className="flex flex-col items-start gap-1.5 bg-light hover:bg-[#E5EDEA] border border-[#D1D9D5] rounded-xl p-4 text-left transition-colors group"
            >
              <span className="text-xl">⚡</span>
              <span className="font-heading font-bold text-pitch text-sm">Strip extras &amp; rebalance</span>
              <span className="text-xs text-mid leading-relaxed">Takes one spare team from anyone with 2+ teams. No one loses their only team.</span>
            </button>

            <button
              onClick={handleLateJoinFullRedraw}
              className="flex flex-col items-start gap-1.5 bg-light hover:bg-[#E5EDEA] border border-[#D1D9D5] rounded-xl p-4 text-left transition-colors group"
            >
              <span className="text-xl">🔀</span>
              <span className="font-heading font-bold text-pitch text-sm">Full redraw for everyone</span>
              <span className="text-xs text-mid leading-relaxed">Scraps all assignments and runs a fresh draw with the full group.</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">Draw complete</h2>
          <p className="text-mid text-sm mt-0.5">
            {participants.length} participant{participants.length !== 1 ? 's' : ''} · {teams.length} teams assigned
          </p>
        </div>
        <button
          onClick={handleRedoDraw}
          className="text-sm text-mid hover:text-pitch transition-colors underline underline-offset-2"
        >
          Redo draw
        </button>
      </div>

      {/* Share your draw card */}
      <div className="bg-pitch rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-white text-sm tracking-tight mb-0.5">
            📱 Share your draw on socials
          </p>
          <p className="text-white/50 text-xs leading-relaxed">
            Download a branded 1080×1080 results card — perfect for WhatsApp, Instagram, or the group chat.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <a
            href={`${APP_URL}/api/og/draw/${shareToken}`}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-1.5 bg-lime text-pitch text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors"
          >
            ⬇ Download image
          </a>
          <button
            onClick={async () => {
              const url = `${APP_URL}/s/${shareToken}`
              await navigator.clipboard.writeText(url)
              setShareCopied(true)
              setTimeout(() => setShareCopied(false), 2000)
            }}
            className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            {shareCopied ? '✓ Copied!' : '🔗 Copy leaderboard link'}
          </button>
          <ShareNativeButton shareToken={shareToken} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {sortedParticipants.map((p, i) => {
          const myTeams = assignmentMap.get(p.id) ?? []
          return (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-[#E5EDEA] p-4 space-y-2.5"
              style={{ animation: 'fade-up 0.4s ease both', animationDelay: `${i * 30}ms` }}
            >
              <p className="font-heading font-bold text-pitch text-sm truncate">{p.name}</p>
              <div className="space-y-1.5">
                {myTeams.length === 0 ? (
                  <p className="text-mid text-xs italic">No team assigned</p>
                ) : (
                  myTeams.map(team => (
                    <div key={team.id} className="flex items-center gap-2">
                      <span className="text-lg leading-none">{team.flag ?? '🏳️'}</span>
                      <div>
                        <p className="text-pitch text-xs font-medium leading-tight">{team.name}</p>
                        {team.group_name && <p className="text-mid text-[10px]">{team.group_name}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
