'use client'

import { useState } from 'react'
import { EUROVISION_SEMI_BONUS } from '@/lib/scoring'

interface Country {
  id: number
  name: string
  flag: string | null
  semi_final: number | null
}

interface ResultState {
  qualified: boolean
  final_position: string       // 1–26, for display ordering only
  grand_final_points: string   // actual Eurovision jury + televote score
}

interface Props {
  sweepstakeId: string
  countries: Country[]
  existingMap: Record<number, { qualified: boolean; final_position: number | null; grand_final_points: number | null }>
}

function semiLabel(sf: number | null) {
  if (sf === null) return 'Auto-qualified'
  return `Semi-Final ${sf}`
}

export function EurovisionResultsClient({ sweepstakeId, countries, existingMap }: Props) {
  const initResults = () => {
    const map: Record<number, ResultState> = {}
    for (const c of countries) {
      const ex = existingMap[c.id]
      map[c.id] = {
        qualified:          ex ? ex.qualified : c.semi_final === null,
        final_position:     ex?.final_position        != null ? String(ex.final_position)        : '',
        grand_final_points: ex?.grand_final_points    != null ? String(ex.grand_final_points)    : '',
      }
    }
    return map
  }

  const [results,  setResults]  = useState<Record<number, ResultState>>(initResults)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [error,    setError]    = useState('')

  function toggleQualified(id: number) {
    setResults(prev => ({
      ...prev,
      [id]: { ...prev[id], qualified: !prev[id].qualified, grand_final_points: '', final_position: '' },
    }))
  }

  function setField(id: number, field: 'final_position' | 'grand_final_points', val: string) {
    setResults(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }))
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError('')

    const payload = countries.map(c => ({
      team_id:            c.id,
      qualified:          results[c.id]?.qualified ?? false,
      final_position:     results[c.id]?.final_position     ? parseInt(results[c.id].final_position, 10)     : null,
      grand_final_points: results[c.id]?.grand_final_points ? parseInt(results[c.id].grand_final_points, 10) : null,
    }))

    const res = await fetch('/api/eurovision/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sweepstakeId, results: payload }),
    })

    const json = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(json.error ?? 'Failed to save results')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const autoQualified = countries.filter(c => c.semi_final === null)
  const semi1         = countries.filter(c => c.semi_final === 1)
  const semi2         = countries.filter(c => c.semi_final === 2)

  const groups = [
    { label: 'Auto-qualified (Big 5 + Host)', countries: autoQualified },
    { label: 'Semi-Final 1',                  countries: semi1 },
    { label: 'Semi-Final 2',                  countries: semi2 },
  ]

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="font-heading font-bold text-pitch text-lg tracking-tight">Eurovision Results</h2>
        <p className="text-sm text-mid mt-1">
          After each semi-final, mark which countries qualified. After the Grand Final, enter each country&apos;s
          actual combined points (jury + public televote). The leaderboard uses those real scores — just like the show.
        </p>
      </div>

      {/* Scoring explainer */}
      <div className="bg-light rounded-xl px-5 py-4 text-sm space-y-1">
        <p className="font-medium text-pitch mb-2">How scoring works</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-mid">
          <div className="flex items-start gap-2">
            <span className="text-grass font-bold shrink-0">+{EUROVISION_SEMI_BONUS} pts</span>
            <span>Country reaches the Grand Final (auto-qual or semi qualifier)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-grass font-bold shrink-0">+ real pts</span>
            <span>Country&apos;s actual Grand Final score (jury + televote combined) added directly to your total</span>
          </div>
        </div>
        <p className="text-xs text-mid/60 mt-2">
          e.g. if your country scores 423 in the final, you get {EUROVISION_SEMI_BONUS} + 423 = {EUROVISION_SEMI_BONUS + 423} points
        </p>
      </div>

      {groups.map(group => (
        <div key={group.label} className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E5EDEA] bg-light/60">
            <h3 className="font-heading font-bold text-sm text-pitch">{group.label}</h3>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-5 py-2 text-xs font-medium text-mid uppercase tracking-wide border-b border-[#E5EDEA]">
            <span>Country</span>
            <span className="w-24 text-center">In Final</span>
            <span className="w-24 text-center">Position</span>
            <span className="w-28 text-center">Points scored</span>
          </div>

          <ul className="divide-y divide-[#E5EDEA]">
            {group.countries.map(c => {
              const r        = results[c.id]
              const isQ      = r?.qualified ?? false
              const isAutoQ  = c.semi_final === null

              return (
                <li key={c.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-5 py-3">
                  {/* Country */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl">{c.flag ?? '🏳️'}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-pitch truncate">{c.name}</p>
                      {!isAutoQ && <p className="text-xs text-mid">{semiLabel(c.semi_final)}</p>}
                    </div>
                  </div>

                  {/* In Final toggle */}
                  <div className="w-24 flex justify-center">
                    {isAutoQ ? (
                      <span className="text-xs font-medium text-grass bg-lime/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                        Auto ✓
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleQualified(c.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-grass focus:ring-offset-1 ${
                          isQ ? 'bg-grass' : 'bg-[#D1D9D5]'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isQ ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    )}
                  </div>

                  {/* Final position (for display/ordering only) */}
                  <div className="w-24 flex justify-center">
                    <input
                      type="number"
                      min="1"
                      max="26"
                      value={r?.final_position ?? ''}
                      disabled={!isQ}
                      onChange={e => setField(c.id, 'final_position', e.target.value)}
                      placeholder="—"
                      title="Finishing position (1 = winner) — used for display order only"
                      className="w-14 text-center px-2 py-1.5 rounded-lg border border-[#D1D9D5] text-sm text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Grand Final points — THE scoring field */}
                  <div className="w-28 flex items-center justify-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={r?.grand_final_points ?? ''}
                      disabled={!isQ}
                      onChange={e => setField(c.id, 'grand_final_points', e.target.value)}
                      placeholder="—"
                      title="Actual combined jury + televote score from the Grand Final"
                      className="w-20 text-center px-2 py-1.5 rounded-lg border border-[#D1D9D5] text-sm text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                    {isQ && r?.grand_final_points && (
                      <span className="text-xs text-grass font-medium shrink-0">
                        = {EUROVISION_SEMI_BONUS + parseInt(r.grand_final_points || '0', 10)} pts
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-lime text-pitch font-medium px-6 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 text-sm"
        >
          {saving ? 'Saving…' : 'Save results'}
        </button>
        {saved  && <span className="text-sm text-grass font-medium">✓ Saved — leaderboard updated</span>}
        {error  && <span className="text-sm text-red-600">{error}</span>}
      </div>

      <div className="bg-light rounded-xl px-5 py-4 text-xs text-mid leading-relaxed">
        <strong className="text-pitch">Tip:</strong> Save after each semi-final to update the leaderboard as qualifiers are confirmed, then enter Grand Final points during/after the show on Saturday night.
      </div>
    </div>
  )
}
