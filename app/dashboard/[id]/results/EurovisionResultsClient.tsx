'use client'

import { useState } from 'react'

interface Country {
  id: number
  name: string
  flag: string | null
  semi_final: number | null
}

interface ResultState {
  qualified: boolean
  final_position: string  // string so input works cleanly, convert on save
}

interface Props {
  sweepstakeId: string
  countries: Country[]
  existingMap: Record<number, { qualified: boolean; final_position: number | null }>
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
        // Auto-qualified countries start as qualified=true
        qualified: ex ? ex.qualified : c.semi_final === null,
        final_position: ex?.final_position != null ? String(ex.final_position) : '',
      }
    }
    return map
  }

  const [results, setResults] = useState<Record<number, ResultState>>(initResults)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function toggle(id: number, field: 'qualified') {
    setResults(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: !prev[id][field] },
    }))
  }

  function setPosition(id: number, val: string) {
    setResults(prev => ({
      ...prev,
      [id]: { ...prev[id], final_position: val },
    }))
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError('')

    const payload = countries.map(c => ({
      team_id: c.id,
      qualified: results[c.id]?.qualified ?? false,
      final_position: results[c.id]?.final_position
        ? parseInt(results[c.id].final_position, 10)
        : null,
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

  // Group countries by semi
  const autoQualified = countries.filter(c => c.semi_final === null)
  const semi1 = countries.filter(c => c.semi_final === 1)
  const semi2 = countries.filter(c => c.semi_final === 2)

  const groups = [
    { label: 'Auto-qualified (Big 5 + Host)', countries: autoQualified, lockQualified: true },
    { label: 'Semi-Final 1', countries: semi1, lockQualified: false },
    { label: 'Semi-Final 2', countries: semi2, lockQualified: false },
  ]

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="font-heading font-bold text-pitch text-lg tracking-tight">Eurovision Results</h2>
        <p className="text-sm text-mid mt-1">
          Mark which countries qualified from each semi-final, then enter Grand Final finishing positions (1 = winner).
          Save at any time — the leaderboard updates immediately.
        </p>
      </div>

      {groups.map(group => (
        <div key={group.label} className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E5EDEA] bg-light/60">
            <h3 className="font-heading font-bold text-sm text-pitch">{group.label}</h3>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2 text-xs font-medium text-mid uppercase tracking-wide border-b border-[#E5EDEA]">
            <span>Country</span>
            <span className="w-28 text-center">Qualified / In final</span>
            <span className="w-28 text-center">Final position</span>
          </div>

          <ul className="divide-y divide-[#E5EDEA]">
            {group.countries.map(c => {
              const r = results[c.id]
              const isQualified = r?.qualified ?? false
              const isAutoQ = c.semi_final === null

              return (
                <li key={c.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3">
                  {/* Country name */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl">{c.flag ?? '🏳️'}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-pitch truncate">{c.name}</p>
                      {!isAutoQ && (
                        <p className="text-xs text-mid">{semiLabel(c.semi_final)}</p>
                      )}
                    </div>
                  </div>

                  {/* Qualified toggle */}
                  <div className="w-28 flex justify-center">
                    {isAutoQ ? (
                      <span className="text-xs font-medium text-grass bg-lime/20 px-2.5 py-1 rounded-full">
                        Auto ✓
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggle(c.id, 'qualified')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-grass focus:ring-offset-1 ${
                          isQualified ? 'bg-grass' : 'bg-[#D1D9D5]'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            isQualified ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Final position */}
                  <div className="w-28 flex justify-center">
                    <input
                      type="number"
                      min="1"
                      max="26"
                      value={r?.final_position ?? ''}
                      disabled={!isQualified}
                      onChange={e => setPosition(c.id, e.target.value)}
                      placeholder="—"
                      className="w-16 text-center px-2 py-1.5 rounded-lg border border-[#D1D9D5] text-sm text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-lime text-pitch font-medium px-6 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 text-sm"
        >
          {saving ? 'Saving…' : 'Save results'}
        </button>
        {saved && (
          <span className="text-sm text-grass font-medium">✓ Saved — leaderboard updated</span>
        )}
        {error && (
          <span className="text-sm text-red-600">{error}</span>
        )}
      </div>

      <div className="bg-light rounded-xl px-5 py-4 text-xs text-mid leading-relaxed">
        <strong className="text-pitch">Tip:</strong> You can save partial results at any time — e.g. after the semi-finals,
        then again after the Grand Final. The leaderboard updates live for all participants.
      </div>
    </div>
  )
}
