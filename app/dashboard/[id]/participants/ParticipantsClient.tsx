'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PaymentSummary } from '@/components/dashboard/PaymentSummary'
import { ParticipantRow } from '@/components/dashboard/ParticipantRow'

const FREE_PLAN_CAP = 48

interface Participant {
  id: string
  name: string
  email: string | null
  paid: boolean
}

interface Props {
  sweepstakeId: string
  plan: string
  entryFee: number
  initialParticipants: Participant[]
}

export function ParticipantsClient({ sweepstakeId, plan, entryFee, initialParticipants }: Props) {
  const supabase = createClient()
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const cap = plan === 'free' ? FREE_PLAN_CAP : Infinity
  const atCap = participants.length >= cap
  const paidCount = participants.filter(p => p.paid).length
  const [chaseAllStatus, setChaseAllStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const unpaidWithEmail = participants.filter(p => !p.paid && p.email).length

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (atCap) {
      setError(`Free plan is limited to ${FREE_PLAN_CAP} participants. Upgrade to Pro for unlimited.`)
      return
    }

    const trimmedName = name.trim()
    if (!trimmedName) return

    const { data, error: insertError } = await supabase
      .from('participants')
      .insert({
        sweepstake_id: sweepstakeId,
        name: trimmedName,
        email: email.trim() || null,
        paid: false,
      })
      .select('id, name, email, paid')
      .single()

    if (insertError || !data) {
      setError(insertError?.message ?? 'Failed to add participant.')
      return
    }

    setParticipants(prev => [...prev, data])
    setName('')
    setEmail('')
  }

  function handleTogglePaid(id: string, paid: boolean) {
    // Optimistic update
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, paid } : p))

    startTransition(async () => {
      const { error } = await supabase
        .from('participants')
        .update({ paid, paid_at: paid ? new Date().toISOString() : null })
        .eq('id', id)

      if (error) {
        // Revert on failure
        setParticipants(prev => prev.map(p => p.id === id ? { ...p, paid: !paid } : p))
      }
    })
  }

  function handleRemove(id: string) {
    const previous = participants
    setParticipants(prev => prev.filter(p => p.id !== id))

    startTransition(async () => {
      const { error } = await supabase.from('participants').delete().eq('id', id)
      if (error) setParticipants(previous)
    })
  }

  async function handleChaseAll() {
    setChaseAllStatus('sending')
    try {
      const res = await fetch('/api/email/payment-chase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sweepstakeId, sendToAll: true }),
      })
      setChaseAllStatus(res.ok ? 'sent' : 'error')
    } catch {
      setChaseAllStatus('error')
    }
  }

  function handleMarkAllPaid() {
    const previous = participants
    setParticipants(prev => prev.map(p => ({ ...p, paid: true })))

    startTransition(async () => {
      const { error } = await supabase
        .from('participants')
        .update({ paid: true, paid_at: new Date().toISOString() })
        .eq('sweepstake_id', sweepstakeId)

      if (error) setParticipants(previous)
    })
  }

  return (
    <div className="max-w-2xl space-y-6">

      {/* Payment summary */}
      <PaymentSummary total={participants.length} paid={paidCount} entryFee={entryFee} />

      {/* Add participant form */}
      <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
        <h2 className="font-heading font-bold text-pitch tracking-tight mb-4">Add participant</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Name *"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={atCap}
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm disabled:bg-light disabled:cursor-not-allowed"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={atCap}
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm disabled:bg-light disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={atCap || !name.trim()}
              className="bg-lime text-pitch text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              Add
            </button>
          </div>

          {atCap && (
            <p className="text-xs text-mid bg-light rounded-lg px-3 py-2">
              Free plan limit reached ({FREE_PLAN_CAP} participants).
            </p>
          )}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </form>
      </div>

      {/* Participant list */}
      {participants.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5EDEA]">
            <h2 className="font-heading font-bold text-pitch tracking-tight">
              Participants
              <span className="ml-2 text-sm font-normal text-mid font-body">
                {participants.length}{plan === 'free' ? `/${FREE_PLAN_CAP}` : ''}
              </span>
            </h2>
            <div className="flex items-center gap-3">
              {entryFee > 0 && unpaidWithEmail > 0 && (
                <button
                  type="button"
                  onClick={handleChaseAll}
                  disabled={chaseAllStatus === 'sending' || chaseAllStatus === 'sent'}
                  className={`text-xs font-medium hover:underline disabled:opacity-60 ${
                    chaseAllStatus === 'sent' ? 'text-mid cursor-default' :
                    chaseAllStatus === 'error' ? 'text-red-500' : 'text-mid'
                  }`}
                >
                  {chaseAllStatus === 'sending' ? 'Sending…' :
                   chaseAllStatus === 'sent' ? `✓ Reminders sent` :
                   chaseAllStatus === 'error' ? 'Failed — retry' :
                   `Chase all unpaid (${unpaidWithEmail})`}
                </button>
              )}
              {paidCount < participants.length && (
                <button
                  type="button"
                  onClick={handleMarkAllPaid}
                  className="text-xs text-grass font-medium hover:underline"
                >
                  Mark all paid
                </button>
              )}
            </div>
          </div>

          <ul className="px-4 py-2 divide-y divide-[#E5EDEA]/60">
            {participants.map(p => (
              <ParticipantRow
                key={p.id}
                participant={p}
                sweepstakeId={sweepstakeId}
                entryFee={entryFee}
                onTogglePaid={handleTogglePaid}
                onRemove={handleRemove}
              />
            ))}
          </ul>
        </div>
      )}

      {participants.length === 0 && (
        <div className="text-center py-12 text-mid text-sm">
          No participants yet. Add the first one above.
        </div>
      )}
    </div>
  )
}
