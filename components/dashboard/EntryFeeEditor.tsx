'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  sweepstakeId: string
  initialFee: number
}

export function EntryFeeEditor({ sweepstakeId, initialFee }: Props) {
  const [fee, setFee] = useState(initialFee)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(initialFee > 0 ? String(initialFee) : '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    const parsed = draft.trim() === '' ? 0 : parseFloat(draft)
    if (isNaN(parsed) || parsed < 0) {
      setError('Enter a valid amount')
      return
    }
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase
      .from('sweepstakes')
      .update({ entry_fee: parsed })
      .eq('id', sweepstakeId)
    setSaving(false)
    if (err) {
      setError('Failed to save')
    } else {
      setFee(parsed)
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <div className="bg-white rounded-xl border-2 border-grass p-4">
        <p className="text-xs text-mid mb-2 font-medium uppercase tracking-wide">Entry fee</p>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mid text-sm">£</span>
            <input
              type="number"
              min="0"
              step="0.50"
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
              placeholder="0.00"
              className="w-full pl-7 pr-3 py-2 rounded-lg border border-[#D1D9D5] text-pitch text-sm focus:outline-none focus:ring-2 focus:ring-grass"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="shrink-0 bg-lime text-pitch text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50"
          >
            {saving ? '…' : 'Save'}
          </button>
          <button
            onClick={() => { setEditing(false); setDraft(fee > 0 ? String(fee) : '') }}
            className="shrink-0 text-mid text-xs hover:text-pitch transition-colors"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        <p className="text-xs text-mid mt-2">Amount each participant contributes. Leave blank for a free sweepstake.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5EDEA] p-4 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-heading font-bold text-pitch">
            {fee > 0 ? `£${Number(fee).toFixed(2)}` : '—'}
          </p>
          <p className="text-xs text-mid mt-0.5">Entry fee</p>
          <p className="text-xs text-mid/60 mt-0.5">
            {fee > 0 ? 'per participant' : 'free sweepstake'}
          </p>
        </div>
        <button
          onClick={() => { setDraft(fee > 0 ? String(fee) : ''); setEditing(true) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-light text-mid hover:text-pitch"
          title="Edit entry fee"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9.5 1.5a1.414 1.414 0 012 2L4 11H2v-2L9.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
