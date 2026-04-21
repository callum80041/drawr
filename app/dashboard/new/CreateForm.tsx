'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AssignmentModeSelector } from '@/components/dashboard/AssignmentModeSelector'
import { CURRENCIES, CURRENCY_OPTIONS, type CurrencyCode } from '@/lib/constants/currencies'

type Mode = 'random' | 'auto' | 'manual'
type PrizeType = 'money' | 'prizes'
type PayoutStructure = 'winner' | 'top_3'
type TournamentType = 'worldcup' | 'eurovision'

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
  const [payoutStructure, setPayoutStructure] = useState<PayoutStructure>('winner')
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
        payout_structure: payoutStructure,
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
      <div>
        <label className="block text-sm font-medium text-pitch mb-3">What are you playing for?</label>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: 'money', icon: '💷', label: 'Money pot', desc: 'Entry fees go into a prize pot.' },
            { value: 'prizes', icon: '🏆', label: 'Prizes', desc: 'Physical or non-cash prizes.' },
          ] as { value: PrizeType; icon: string; label: string; desc: string }[]).map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPrizeType(opt.value)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                prizeType === opt.value ? 'border-grass bg-grass/5' : 'border-[#D1D9D5] bg-white hover:border-mid'
              }`}
            >
              <span className="text-2xl mb-2 block">{opt.icon}</span>
              <p className="text-sm font-medium text-pitch mb-1">{opt.label}</p>
              <p className="text-xs text-mid">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Payout structure */}
      <div>
        <label className="block text-sm font-medium text-pitch mb-3">Who wins?</label>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: 'winner', icon: '🥇', label: 'Winner only', desc: 'First place takes everything.' },
            { value: 'top_3', icon: '🎖️', label: '1st, 2nd & 3rd', desc: 'Prize split across the top three.' },
          ] as { value: PayoutStructure; icon: string; label: string; desc: string }[]).map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPayoutStructure(opt.value)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                payoutStructure === opt.value ? 'border-grass bg-grass/5' : 'border-[#D1D9D5] bg-white hover:border-mid'
              }`}
            >
              <span className="text-2xl mb-2 block">{opt.icon}</span>
              <p className="text-sm font-medium text-pitch mb-1">{opt.label}</p>
              <p className="text-xs text-mid">{opt.desc}</p>
            </button>
          ))}
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
