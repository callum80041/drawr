'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type PrizeType =
  | 'first_place' | 'second_place' | 'third_place' | 'fourth_place'
  | 'wooden_spoon' | 'first_knocked_out' | 'most_goals_conceded'
  | 'fewest_goals_scored' | 'most_cards' | 'golden_boot' | 'golden_glove'

export interface PrizeRow {
  prize_type: string
  amount: number | null
}

interface Props {
  sweepstakeId: string
  initialPrizes: PrizeRow[]
}

const PRIZE_DEFS: { type: PrizeType; icon: string; label: string; desc: string }[] = [
  { type: 'first_place',          icon: '🥇', label: '1st Place',           desc: 'Winner of the sweepstake.' },
  { type: 'second_place',         icon: '🥈', label: '2nd Place',           desc: 'Runner-up.' },
  { type: 'third_place',          icon: '🥉', label: '3rd Place',           desc: 'Third place.' },
  { type: 'fourth_place',         icon: '🎗️', label: '4th Place',           desc: 'Semi-final exit.' },
  { type: 'wooden_spoon',         icon: '🥄', label: 'Wooden Spoon',        desc: 'Last place on the overall leaderboard.' },
  { type: 'first_knocked_out',    icon: '👋', label: 'First Knocked Out',   desc: 'First team eliminated in the group stage.' },
  { type: 'most_goals_conceded',  icon: '😬', label: 'Most Goals Conceded', desc: 'Team that concedes the most in the group stage.' },
  { type: 'fewest_goals_scored',  icon: '😴', label: 'Fewest Goals Scored', desc: 'Team that scores the least in the group stage.' },
  { type: 'most_cards',           icon: '🟥', label: 'Most Cards',          desc: 'Most yellow and red cards combined.' },
  { type: 'golden_boot',          icon: '👟', label: 'Golden Boot Team',    desc: "Team whose player wins the Golden Boot (top scorer)." },
  { type: 'golden_glove',         icon: '🧤', label: 'Golden Glove Team',   desc: "Team whose player wins the Golden Glove (best goalkeeper)." },
]

type PrizeState = { enabled: boolean; amount: string }

function buildInitialState(initialPrizes: PrizeRow[]): Record<PrizeType, PrizeState> {
  const result = {} as Record<PrizeType, PrizeState>
  for (const def of PRIZE_DEFS) {
    const existing = initialPrizes.find(p => p.prize_type === def.type)
    result[def.type] = {
      enabled: !!existing,
      amount: existing?.amount != null ? String(existing.amount) : '',
    }
  }
  return result
}

export function PrizesSection({ sweepstakeId, initialPrizes }: Props) {
  const supabase = createClient()
  const [prizes, setPrizes] = useState<Record<PrizeType, PrizeState>>(() => buildInitialState(initialPrizes))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  function toggle(type: PrizeType) {
    setPrizes(prev => ({ ...prev, [type]: { ...prev[type], enabled: !prev[type].enabled } }))
  }

  function setAmount(type: PrizeType, value: string) {
    setPrizes(prev => ({ ...prev, [type]: { ...prev[type], amount: value } }))
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setSaveError('')

    const enabledTypes = PRIZE_DEFS.map(d => d.type).filter(t => prizes[t].enabled)
    const disabledTypes = PRIZE_DEFS.map(d => d.type).filter(t => !prizes[t].enabled)

    if (enabledTypes.length > 0) {
      const rows = enabledTypes.map(t => {
        const parsed = parseFloat(prizes[t].amount)
        return {
          sweepstake_id: sweepstakeId,
          prize_type: t,
          amount: isNaN(parsed) || parsed < 0 ? null : parsed,
        }
      })
      const { error } = await supabase
        .from('sweepstake_prizes')
        .upsert(rows, { onConflict: 'sweepstake_id,prize_type' })
      if (error) { setSaveError(error.message); setSaving(false); return }
    }

    if (disabledTypes.length > 0) {
      const { error } = await supabase
        .from('sweepstake_prizes')
        .delete()
        .eq('sweepstake_id', sweepstakeId)
        .in('prize_type', disabledTypes)
      if (error) { setSaveError(error.message); setSaving(false); return }
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5EDEA] divide-y divide-[#E5EDEA]">
      <div className="p-6">
        <h2 className="text-sm font-semibold text-pitch mb-1">Prizes</h2>
        <p className="text-xs text-mid">Toggle on any category and set a prize pot. Leave the amount blank if the prize isn&apos;t cash.</p>
      </div>

      {PRIZE_DEFS.map(def => {
        const state = prizes[def.type]
        return (
          <div key={def.type} className="px-6 py-4 flex items-center gap-4">
            <button
              type="button"
              role="switch"
              aria-checked={state.enabled}
              onClick={() => toggle(def.type)}
              className={`relative shrink-0 inline-flex h-6 w-10 items-center rounded-full transition-colors ${state.enabled ? 'bg-grass' : 'bg-[#D1D9D5]'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${state.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-pitch">
                <span className="mr-1.5">{def.icon}</span>{def.label}
              </p>
              <p className="text-xs text-mid mt-0.5">{def.desc}</p>
            </div>

            <div className={`shrink-0 w-28 transition-opacity ${state.enabled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mid text-sm select-none">£</span>
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  value={state.amount}
                  onChange={e => setAmount(def.type, e.target.value)}
                  placeholder="0.00"
                  tabIndex={state.enabled ? 0 : -1}
                  className="w-full pl-6 pr-3 py-2 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        )
      })}

      <div className="p-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-lime text-pitch font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : 'Save prizes'}
        </button>
        {saved && <span className="text-sm text-grass font-medium">✓ Saved</span>}
        {saveError && <span className="text-sm text-red-500">{saveError}</span>}
      </div>
    </div>
  )
}
