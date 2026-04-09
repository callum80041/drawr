'use client'

import { useState } from 'react'

export interface WaitlistEntry {
  id: string
  name: string
  email: string
  created_at: string
}

interface Props {
  entry: WaitlistEntry
  sweepstakeId: string
  atCap: boolean
  onPromote: (id: string, participant: { id: string; name: string; email: string | null; paid: boolean }) => void
  onRemove: (id: string) => void
}

export function WaitlistRow({ entry, sweepstakeId, atCap, onPromote, onRemove }: Props) {
  const [promoting, setPromoting] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState('')

  async function handlePromote() {
    setPromoting(true)
    setError('')
    const res = await fetch('/api/waitlist/promote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waitlistId: entry.id, sweepstakeId }),
    })
    const data = await res.json()
    setPromoting(false)
    if (!res.ok) {
      setError(data.error ?? 'Failed to promote')
    } else {
      onPromote(entry.id, data.participant)
    }
  }

  async function handleRemove() {
    setRemoving(true)
    const res = await fetch('/api/waitlist/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waitlistId: entry.id, sweepstakeId }),
    })
    setRemoving(false)
    if (res.ok) onRemove(entry.id)
  }

  return (
    <li className="flex items-center gap-3 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-pitch truncate">{entry.name}</p>
        {entry.email && <p className="text-xs text-mid truncate">{entry.email}</p>}
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handlePromote}
          disabled={promoting || removing || atCap}
          title={atCap ? 'Sweepstake is full — remove a participant first' : 'Move to confirmed participants'}
          className="text-xs font-medium text-grass hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {promoting ? 'Moving…' : 'Promote'}
        </button>
        <span className="text-[#E5EDEA]">·</span>
        <button
          onClick={handleRemove}
          disabled={removing || promoting}
          className="text-xs text-mid hover:text-red-500 transition-colors disabled:opacity-40"
        >
          {removing ? '…' : 'Remove'}
        </button>
      </div>
    </li>
  )
}
