'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function NewSyndicateForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [entryFee, setEntryFee] = useState('1.00')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch('/api/lottery/syndicates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        entry_fee_pence: Math.round(parseFloat(entryFee) * 100),
        start_date: startDate,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong')
      setSaving(false)
      return
    }

    const syndicate = await res.json()
    router.push(`/headcoachadmin/lottery/${syndicate.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="Wednesday Lottery 2026"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Weekly entry fee (£)</label>
          <input
            type="number"
            step="0.50"
            min="0.50"
            value={entryFee}
            onChange={e => setEntryFee(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
          />
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="bg-lime-400 text-gray-950 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-lime-300 disabled:opacity-50 transition"
      >
        {saving ? 'Creating…' : 'Create syndicate'}
      </button>
    </form>
  )
}
