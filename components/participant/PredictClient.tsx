'use client'

import { useState, useEffect } from 'react'

const DEADLINE = new Date('2026-06-11T19:00:00Z')

interface Team {
  id: number
  name: string
  flag: string | null
}

interface Group {
  name: string
  teams: Team[]
}

interface Pick {
  teamId: number
  teamName: string
  teamFlag: string
}

interface CommunityPick {
  teamId: number
  teamName: string
  teamFlag: string | null
  count: number
}

interface CommunityGroup {
  groupName: string
  picks: CommunityPick[]
}

interface Props {
  sweepstakeId: string
  groups: Group[]
  initialParticipant?: { id: string; name: string } | null
  initialPicks?: Record<string, Pick>
}

export function PredictClient({ sweepstakeId, groups, initialParticipant = null, initialPicks = {} }: Props) {
  const isPast = new Date() > DEADLINE

  const startStep = isPast ? 'done' : initialParticipant ? 'predict' : 'email'

  const [step, setStep] = useState<'email' | 'predict' | 'done'>(startStep)
  const [email, setEmail] = useState('')
  const [participant, setParticipant] = useState<{ id: string; name: string } | null>(initialParticipant)
  const [picks, setPicks] = useState<Record<string, Pick>>(initialPicks)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [communityPicks, setCommunityPicks] = useState<CommunityGroup[]>([])
  const [loadingCommunity, setLoadingCommunity] = useState(false)

  const allPicked = groups.every(g => picks[g.name])

  // Load community picks when past deadline or on done step after deadline
  useEffect(() => {
    if (isPast || step === 'done') {
      setLoadingCommunity(true)
      fetch(`/api/predictions/community?sweepstakeId=${sweepstakeId}`)
        .then(r => r.json())
        .then(data => {
          if (data.groups) setCommunityPicks(data.groups)
        })
        .catch(() => {})
        .finally(() => setLoadingCommunity(false))
    }
  }, [isPast, step, sweepstakeId])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/predictions/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sweepstakeId, email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setParticipant(data.participant)
      // Populate existing picks
      const existingPicks: Record<string, Pick> = {}
      for (const p of data.predictions ?? []) {
        existingPicks[p.groupName] = { teamId: p.teamId, teamName: p.teamName, teamFlag: p.teamFlag ?? '' }
      }
      setPicks(existingPicks)
      setStep('predict')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSubmit() {
    if (!participant || !allPicked) return
    setError('')
    setSaving(true)
    try {
      const predictionsArray = Object.entries(picks).map(([groupName, pick]) => ({
        groupName,
        teamId: pick.teamId,
        teamName: pick.teamName,
        teamFlag: pick.teamFlag,
      }))
      const res = await fetch('/api/predictions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sweepstakeId, participantId: participant.id, predictions: predictionsArray }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to save. Please try again.')
        return
      }
      setStep('done')
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // --- Community picks view (after deadline) ---
  if (isPast) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
          <h2 className="font-heading font-bold text-xl text-pitch mb-1">The Verdict Is In 🗳️</h2>
          <p className="font-body text-sm text-mid">Here's what your sweepstake predicted for the top of each group.</p>
        </div>
        {loadingCommunity ? (
          <div className="text-center py-12 text-mid font-body text-sm">Loading community picks…</div>
        ) : communityPicks.length === 0 ? (
          <div className="text-center py-12 text-mid font-body text-sm">No predictions were submitted for this sweepstake.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityPicks.map(g => {
              const total = g.picks.reduce((sum, p) => sum + p.count, 0)
              return (
                <div key={g.groupName} className="bg-white rounded-xl border border-[#E5EDEA] p-5">
                  <h3 className="font-heading font-bold text-pitch mb-3">{g.groupName}</h3>
                  <div className="space-y-2">
                    {g.picks.map(pick => {
                      const pct = total > 0 ? Math.round((pick.count / total) * 100) : 0
                      return (
                        <div key={pick.teamId}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-body text-sm text-pitch flex items-center gap-1.5">
                              {pick.teamFlag && <span>{pick.teamFlag}</span>}
                              {pick.teamName}
                            </span>
                            <span className="font-body text-xs text-mid">{pick.count} pick{pick.count !== 1 ? 's' : ''} · {pct}%</span>
                          </div>
                          <div className="h-1.5 bg-light rounded-full overflow-hidden">
                            <div
                              className="h-full bg-lime rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // --- Email verification step ---
  if (step === 'email') {
    return (
      <div className="max-w-md mx-auto space-y-6 py-4">
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
          <h2 className="font-heading font-bold text-2xl text-pitch mb-3">Top of the Group 🏆</h2>
          <p className="font-body text-sm text-mid leading-relaxed mb-6">
            Pick one team to top each group — like a manager picking their starting XI, except there's no VAR to bail you out.
            No money on the line, just the sweet taste of being right when everyone else got it wrong.
            Predictions lock when the first whistle blows: <strong className="text-pitch">11 June 2026, 7pm UTC.</strong> ⚽
          </p>
          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label htmlFor="email" className="block font-body text-sm font-medium text-pitch mb-1">
                Your email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-[#E5EDEA] rounded-lg px-3 py-2.5 text-sm font-body text-pitch placeholder:text-mid/50 focus:outline-none focus:ring-2 focus:ring-lime/50"
              />
            </div>
            {error && (
              <p className="font-body text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={saving || !email.trim()}
              className="w-full bg-lime text-pitch font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-[#b8e03d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Checking…' : 'Access my predictions'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // --- Prediction form step ---
  if (step === 'predict') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
          <p className="font-body text-sm text-mid">
            Welcome back, <strong className="text-pitch">{participant?.name}</strong>! Pick your group winners below.
          </p>
          <p className="font-body text-xs text-mid/70 mt-1">
            {Object.keys(picks).length} of {groups.length} groups picked
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(group => {
            const selected = picks[group.name]
            return (
              <div key={group.name} className="bg-white rounded-xl border border-[#E5EDEA] p-5">
                <h3 className="font-heading font-bold text-pitch mb-3">{group.name}</h3>
                <div className="space-y-2">
                  {group.teams.map(team => {
                    const isSelected = selected?.teamId === team.id
                    return (
                      <button
                        key={team.id}
                        onClick={() => setPicks(prev => ({
                          ...prev,
                          [group.name]: { teamId: team.id, teamName: team.name, teamFlag: team.flag ?? '' },
                        }))}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all font-body text-sm ${
                          isSelected
                            ? 'border-lime bg-lime/10 text-pitch font-semibold'
                            : 'border-[#E5EDEA] bg-light text-mid hover:border-lime/40 hover:bg-lime/5'
                        }`}
                      >
                        {team.flag && <span className="text-base leading-none">{team.flag}</span>}
                        <span>{team.name}</span>
                        {isSelected && <span className="ml-auto text-xs text-grass font-semibold">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {error && (
          <p className="font-body text-sm text-red-600 text-center">{error}</p>
        )}

        <div className="flex justify-center pb-4">
          <button
            onClick={handleSubmit}
            disabled={!allPicked || saving}
            className="bg-lime text-pitch font-semibold text-sm px-8 py-2.5 rounded-lg hover:bg-[#b8e03d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving…' : allPicked ? 'Submit predictions' : `Pick ${groups.length - Object.keys(picks).length} more group${groups.length - Object.keys(picks).length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    )
  }

  // --- Done step ---
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
        <p className="text-2xl mb-2">✅</p>
        <h2 className="font-heading font-bold text-xl text-pitch mb-1">Locked in!</h2>
        <p className="font-body text-sm text-mid">
          Your predictions are saved. Check back on 27 June to see how you got on.
        </p>
        <p className="font-body text-sm text-mid mt-2">
          Change your mind? You can update until <strong className="text-pitch">11 June 2026</strong>.
        </p>
        <button
          onClick={() => setStep('predict')}
          className="mt-4 bg-lime text-pitch font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors"
        >
          Edit predictions
        </button>
      </div>

      {/* Summary grid */}
      <div>
        <h3 className="font-heading font-bold text-pitch mb-3">Your picks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {groups.map(group => {
            const pick = picks[group.name]
            return (
              <div key={group.name} className="bg-white rounded-xl border border-[#E5EDEA] px-4 py-3 flex items-center justify-between">
                <span className="font-body text-sm font-medium text-mid">{group.name}</span>
                {pick ? (
                  <span className="font-body text-sm font-semibold text-pitch flex items-center gap-1.5">
                    {pick.teamFlag && <span>{pick.teamFlag}</span>}
                    {pick.teamName}
                  </span>
                ) : (
                  <span className="font-body text-xs text-mid/50 italic">Not picked</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Community picks section */}
      {communityPicks.length > 0 && (
        <div>
          <h3 className="font-heading font-bold text-pitch mb-3">The Verdict Is In 🗳️ — here's what your sweepstake predicted</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityPicks.map(g => {
              const total = g.picks.reduce((sum, p) => sum + p.count, 0)
              return (
                <div key={g.groupName} className="bg-white rounded-xl border border-[#E5EDEA] p-5">
                  <h4 className="font-heading font-bold text-pitch mb-3">{g.groupName}</h4>
                  <div className="space-y-2">
                    {g.picks.map(pick => {
                      const pct = total > 0 ? Math.round((pick.count / total) * 100) : 0
                      return (
                        <div key={pick.teamId}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-body text-sm text-pitch flex items-center gap-1.5">
                              {pick.teamFlag && <span>{pick.teamFlag}</span>}
                              {pick.teamName}
                            </span>
                            <span className="font-body text-xs text-mid">{pick.count} · {pct}%</span>
                          </div>
                          <div className="h-1.5 bg-light rounded-full overflow-hidden">
                            <div
                              className="h-full bg-lime rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
