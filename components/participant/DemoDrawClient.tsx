'use client'

import { useState, useEffect } from 'react'

interface Team {
  id: number
  name: string
  flag: string | null
  group_name: string | null
}

interface Participant {
  id: string
  name: string
}

interface Assignment {
  participant_id: string
  team_id: number
  team_name: string
  team_flag: string | null
}

interface Props {
  participants: Participant[]
  teams: Team[]
  assignments: Assignment[]
  drawCompletedAt: string | null
}

type Phase = 'revealed' | 'animating'
type Speed = 'normal' | 'fast'

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

function RevealCard({ item, index, total }: { item: DrawItem; index: number; total: number }) {
  const primaryTeam = item.teams[0]
  const extraTeams  = item.teams.slice(1)

  return (
    <div
      key={index}
      className="bg-white rounded-2xl border-2 border-lime shadow-xl shadow-pitch/10 p-8 text-center max-w-xs mx-auto"
      style={{ animation: 'reveal-draw 0.35s ease both' }}
    >
      <p className="text-xs text-mid mb-5 tabular-nums">
        {index + 1} <span className="text-[#D1D9D5]">/</span> {total}
      </p>
      <div className="text-7xl mb-3 leading-none select-none">
        {primaryTeam?.flag ?? '🏳️'}
      </div>
      <p className="font-heading text-2xl font-bold text-pitch leading-tight">
        {primaryTeam?.name}
      </p>
      {primaryTeam?.group_name && (
        <p className="text-xs text-mid mt-1">{primaryTeam.group_name}</p>
      )}
      {extraTeams.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {extraTeams.map(t => (
            <span key={t.id} className="text-sm bg-light rounded-full px-2 py-0.5 text-pitch">
              {t.flag} {t.name}
            </span>
          ))}
        </div>
      )}
      <div className="my-5 flex items-center gap-3">
        <span className="flex-1 h-px bg-[#E5EDEA]" />
        <span className="text-[10px] uppercase tracking-widest text-mid">drawn by</span>
        <span className="flex-1 h-px bg-[#E5EDEA]" />
      </div>
      <p className="font-heading text-xl font-bold text-grass tracking-tight">
        {item.participant.name}
      </p>
    </div>
  )
}

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

export function DemoDrawClient({ participants, teams, assignments, drawCompletedAt }: Props) {
  // Build assignment map from existing assignments
  const buildDrawItems = (): DrawItem[] => {
    const teamMap = new Map<number, Team>()
    teams.forEach(t => teamMap.set(t.id, t))

    const participantTeams = new Map<string, Team[]>()
    participants.forEach(p => participantTeams.set(p.id, []))
    assignments.forEach(a => {
      const team = teamMap.get(a.team_id)
      if (team) participantTeams.get(a.participant_id)?.push(team)
    })

    return shuffle(participants).map(p => ({
      participant: p,
      teams: participantTeams.get(p.id) ?? [],
    }))
  }

  const [phase,      setPhase]      = useState<Phase>('revealed')
  const [drawOrder,  setDrawOrder]  = useState<DrawItem[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [speed,      setSpeed]      = useState<Speed>('normal')

  const INTERVAL_MS = speed === 'fast' ? 220 : 520

  useEffect(() => {
    if (phase !== 'animating') return
    if (currentIdx >= drawOrder.length) {
      setPhase('revealed')
      return
    }
    const timer = setTimeout(() => setCurrentIdx(i => i + 1), INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [phase, currentIdx, drawOrder.length, INTERVAL_MS])

  function handleReplay() {
    const order = buildDrawItems()
    setDrawOrder(order)
    setCurrentIdx(0)
    setPhase('animating')
  }

  function handleSkip() {
    setCurrentIdx(drawOrder.length)
    setPhase('revealed')
  }

  // ── Animating ────────────────────────────────────────────────────────────────
  if (phase === 'animating') {
    const currentItem = drawOrder[currentIdx]
    const drawnItems  = drawOrder.slice(0, currentIdx)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">The draw is live</h2>
            <p className="text-mid text-sm mt-0.5">{currentIdx} of {drawOrder.length} drawn</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSpeed(s => s === 'normal' ? 'fast' : 'normal')}
              className="text-xs text-mid hover:text-pitch transition-colors px-3 py-1.5 rounded-lg border border-[#E5EDEA] bg-white"
            >
              {speed === 'normal' ? '⏩ Speed up' : '⏸ Normal'}
            </button>
            <button
              onClick={handleSkip}
              className="text-xs text-mid hover:text-pitch transition-colors underline underline-offset-2"
            >
              Skip to end
            </button>
          </div>
        </div>

        {currentItem && (
          <div className="flex justify-center py-2">
            <RevealCard key={currentIdx} item={currentItem} index={currentIdx} total={drawOrder.length} />
          </div>
        )}

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

  // ── Revealed ─────────────────────────────────────────────────────────────────
  const sortedItems = buildDrawItems().sort((a, b) => a.participant.name.localeCompare(b.participant.name))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">Draw complete</h2>
          {drawCompletedAt && (
            <p className="text-mid text-sm mt-0.5">
              {participants.length} participants · {assignments.length} teams ·{' '}
              Drawn {new Date(drawCompletedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
        <button
          onClick={handleReplay}
          className="text-sm bg-lime text-pitch font-medium px-4 py-2 rounded-xl hover:bg-[#b8e03d] transition-colors"
        >
          ▶ Replay draw
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {sortedItems.map((item, i) => (
          <div
            key={item.participant.id}
            className="bg-white rounded-xl border border-[#E5EDEA] p-4 space-y-2.5"
            style={{ animation: 'fade-up 0.4s ease both', animationDelay: `${i * 20}ms` }}
          >
            <p className="font-heading font-bold text-pitch text-sm truncate">{item.participant.name}</p>
            <div className="space-y-1.5">
              {item.teams.length === 0 ? (
                <p className="text-mid text-xs italic">No team assigned</p>
              ) : item.teams.map(team => (
                <div key={team.id} className="flex items-center gap-2">
                  <span className="text-lg leading-none">{team.flag ?? '🏳️'}</span>
                  <div>
                    <p className="text-pitch text-xs font-medium leading-tight">{team.name}</p>
                    {team.group_name && <p className="text-mid text-[10px]">{team.group_name}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-pitch rounded-xl p-6 text-center space-y-3">
        <p className="text-white font-heading font-bold text-lg">Want a live draw for your group?</p>
        <p className="text-white/60 text-sm">Create a free account — the real draw reveals each name live, one by one, with the suspense intact.</p>
        <a href="/signup" className="inline-flex items-center gap-2 bg-lime text-pitch font-medium px-6 py-2.5 rounded-xl hover:bg-[#d4f54d] transition-colors text-sm">
          Create your sweepstake free →
        </a>
      </div>
    </div>
  )
}
