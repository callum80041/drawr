'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AssignmentModeSelector } from '@/components/dashboard/AssignmentModeSelector'
import { PrizesSection } from '@/components/dashboard/PrizesSection'
import { CURRENCIES, CURRENCY_OPTIONS, type CurrencyCode } from '@/lib/constants/currencies'

type Mode = 'random' | 'auto' | 'manual'
type PrizeType = 'money' | 'prizes'
type PrizeCategory = 'first_place' | 'second_place' | 'third_place' | 'fourth_place' | 'wooden_spoon' | 'first_knocked_out' | 'most_goals_conceded' | 'fewest_goals_scored' | 'most_cards' | 'golden_boot' | 'golden_glove'
type TournamentType = 'worldcup' | 'eurovision'

const PRIZE_CATEGORIES: { type: PrizeCategory; icon: string; label: string; desc: string }[] = [
  { type: 'first_place', icon: '🥇', label: '1st Place', desc: 'Winner of the sweepstake.' },
  { type: 'second_place', icon: '🥈', label: '2nd Place', desc: 'Runner-up.' },
  { type: 'third_place', icon: '🥉', label: '3rd Place', desc: 'Third place.' },
  { type: 'fourth_place', icon: '🎗️', label: '4th Place', desc: 'Semi-final exit.' },
  { type: 'wooden_spoon', icon: '🥄', label: 'Wooden Spoon', desc: 'Last place on the leaderboard.' },
  { type: 'first_knocked_out', icon: '👋', label: 'First Knocked Out', desc: 'First team eliminated.' },
  { type: 'most_goals_conceded', icon: '😬', label: 'Most Goals Conceded', desc: 'Team that concedes the most.' },
  { type: 'fewest_goals_scored', icon: '😴', label: 'Fewest Goals Scored', desc: 'Team that scores the least.' },
  { type: 'most_cards', icon: '🟥', label: 'Most Cards', desc: 'Most yellow and red cards combined.' },
  { type: 'golden_boot', icon: '👟', label: 'Golden Boot Team', desc: 'Team whose player wins the Golden Boot.' },
  { type: 'golden_glove', icon: '🧤', label: 'Golden Glove Team', desc: 'Team whose player wins the Golden Glove.' },
]

const TOURNAMENTS: { value: TournamentType; emoji: string; label: string; sub: string; count: string; tournamentId: number; tournamentName: string }[] = [
  {
    value: 'worldcup',
    emoji: '⚽',
    label: 'FIFA World Cup 2026',
    sub: 'Canada · Mexico · USA',
    count: '48 teams',
    tournamentId: 1,
    tournamentName: 'FIFA World Cup 2026',
  },
  {
    value: 'eurovision',
    emoji: '🎤',
    label: 'Eurovision Song Contest 2026',
    sub: 'Vienna, Austria',
    count: '35 countries',
    tournamentId: 2,
    tournamentName: 'Eurovision Song Contest 2026',
  },
]

interface Props {
  organiserId: string
}

export function CreateForm({ organiserId }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [entryFee, setEntryFee] = useState('')
  const [currency, setCurrency] = useState<CurrencyCode>('GBP')
  const [mode, setMode] = useState<Mode>('random')
  const [prizeType, setPrizeType] = useState<PrizeType>('money')
  const [prizeAmounts, setPrizeAmounts] = useState<Record<PrizeCategory, { enabled: boolean; amount: string; type: 'fixed' | 'percent' }>>(() => {
    const initial = {} as Record<PrizeCategory, { enabled: boolean; amount: string; type: 'fixed' | 'percent' }>
    PRIZE_CATEGORIES.forEach(cat => {
      initial[cat.type] = { enabled: cat.type === 'first_place', amount: '', type: 'fixed' }
    })
    return initial
  })
  const [tournament, setTournament] = useState<TournamentType>('worldcup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const t = TOURNAMENTS.find(t => t.value === tournament)!

    const { data, error: insertError } = await supabase
      .from('sweepstakes')
      .insert({
        organiser_id: organiserId,
        name: name.trim(),
        tournament_id: t.tournamentId,
        tournament_name: t.tournamentName,
        sweepstake_type: tournament,
        entry_fee: entryFee ? parseFloat(entryFee) : 0,
        currency: currency,
        assignment_mode: mode,
        prize_type: prizeType,
        status: 'setup',
        plan: 'free',
      })
      .select('id, share_token')
      .single()

    if (insertError || !data) {
      setError(insertError?.message ?? 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    // Create prize entries
    const enabledPrizeKeys = Object.entries(prizeAmounts)
      .filter(([, state]) => state.enabled)
      .map(([key]) => key as PrizeCategory)

    if (enabledPrizeKeys.length > 0) {
      const prizeRows = enabledPrizeKeys.map(prizeKey => {
        const state = prizeAmounts[prizeKey]
        const parsed = parseFloat(state.amount)
        return {
          sweepstake_id: data.id,
          prize_type: prizeKey,
          amount: isNaN(parsed) || parsed < 0 ? null : parsed,
          amount_type: state.type,
        }
      })
      try {
        await supabase
          .from('sweepstake_prizes')
          .insert(prizeRows)
      } catch {
        // best-effort
      }
    }

    // Fire confirmation email (non-blocking)
    fetch('/api/email/sweepstake-created', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sweepstakeId: data.id }),
    }).catch(() => { /* best-effort */ })

    router.push(`/dashboard/${data.id}?created=1`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-pitch mb-1.5">
          Sweepstake name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          maxLength={80}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Office World Cup 2026"
          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
        />
      </div>

      {/* Tournament */}
      <div>
        <label className="block text-sm font-medium text-pitch mb-3">Tournament</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOURNAMENTS.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTournament(t.value)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                tournament === t.value ? 'border-grass bg-grass/5' : 'border-[#D1D9D5] bg-white hover:border-mid'
              }`}
            >
              <span className="text-2xl mb-2 block">{t.emoji}</span>
              <p className="text-sm font-medium text-pitch mb-0.5">{t.label}</p>
              <p className="text-xs text-mid">{t.sub}</p>
              <span className="inline-block mt-2 text-xs bg-lime/30 text-pitch px-2 py-0.5 rounded-full font-medium">
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Currency & Entry fee */}
      <div className="space-y-4">
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-pitch mb-1.5">
            Currency <span className="text-mid font-normal">(optional)</span>
          </label>
          <select
            id="currency"
            value={currency}
            onChange={e => setCurrency(e.target.value as CurrencyCode)}
            className="w-full max-w-xs px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
          >
            {CURRENCY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="entry-fee" className="block text-sm font-medium text-pitch mb-1.5">
            Entry fee per participant <span className="text-mid font-normal">(optional)</span>
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mid text-sm">{CURRENCIES[currency].symbol}</span>
            <input
              id="entry-fee"
              type="number"
              min="0"
              step="0.50"
              value={entryFee}
              onChange={e => setEntryFee(e.target.value)}
              placeholder="0.00"
              className="w-full pl-7 pr-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
            />
          </div>
          <p className="text-xs text-mid mt-1.5">You collect payments directly from participants. playdrawr doesn&apos;t take a percentage — you keep 100% of entry fees.</p>
        </div>
      </div>

      {/* Prize type */}
      <PrizesSection value={prizeType} onChange={setPrizeType} />

      {/* Prize categories */}
      <div>
        <label className="block text-sm font-medium text-pitch mb-3">What are the prizes?</label>
        <div className="space-y-3">
          {PRIZE_CATEGORIES.map(cat => {
            const state = prizeAmounts[cat.type]
            return (
              <div key={cat.type} className="p-3 rounded-lg border border-[#D1D9D5] bg-white">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={state.enabled}
                    onClick={() => setPrizeAmounts(prev => ({
                      ...prev,
                      [cat.type]: { ...prev[cat.type], enabled: !prev[cat.type].enabled }
                    }))}
                    className={`relative shrink-0 inline-flex h-6 w-10 items-center rounded-full transition-colors mt-0.5 ${state.enabled ? 'bg-grass' : 'bg-[#D1D9D5]'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${state.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-pitch">
                      <span className="mr-1.5">{cat.icon}</span>{cat.label}
                    </p>
                    <p className="text-xs text-mid mt-0.5">{cat.desc}</p>
                  </div>

                  {state.enabled && (
                    <div className="flex gap-2 shrink-0">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mid text-sm">{state.type === 'fixed' ? '£' : '%'}</span>
                        <input
                          type="number"
                          min="0"
                          step="0.50"
                          value={state.amount}
                          onChange={e => setPrizeAmounts(prev => ({
                            ...prev,
                            [cat.type]: { ...prev[cat.type], amount: e.target.value }
                          }))}
                          placeholder="0"
                          className="w-24 pl-7 pr-3 py-2 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrizeAmounts(prev => ({
                          ...prev,
                          [cat.type]: { ...prev[cat.type], type: prev[cat.type].type === 'fixed' ? 'percent' : 'fixed' }
                        }))}
                        className="px-2 py-2 rounded-lg border border-[#D1D9D5] text-pitch hover:bg-light text-xs font-medium transition-colors"
                      >
                        {state.type === 'fixed' ? '£' : '%'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Assignment mode */}
      <div>
        <label className="block text-sm font-medium text-pitch mb-3">
          How should teams be assigned?
        </label>
        <AssignmentModeSelector value={mode} onChange={setMode} />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-lime text-pitch font-medium px-6 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? 'Creating…' : 'Create sweepstake →'}
        </button>
        <a href="/dashboard" className="text-sm text-mid hover:text-pitch transition-colors">
          Cancel
        </a>
      </div>
    </form>
  )
}
