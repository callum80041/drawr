'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PaymentSummary } from '@/components/dashboard/PaymentSummary'
import { ParticipantRow } from '@/components/dashboard/ParticipantRow'
import { WaitlistRow, type WaitlistEntry } from '@/components/dashboard/WaitlistRow'
import { ShareButtons } from '@/components/dashboard/ShareButtons'
import { type CurrencyCode } from '@/lib/constants/currencies'

const FREE_PLAN_CAP = 48
const PRO_PLAN_CAP = 200

interface Participant {
  id: string
  name: string
  email: string | null
  paid: boolean
}

interface Props {
  sweepstakeId: string
  sweepstakeName: string
  joinUrl: string
  isEurovision?: boolean
  isPro: boolean
  entryFee: number
  currency?: CurrencyCode
  drawDone: boolean
  initialParticipants: Participant[]
  initialWaitlist: WaitlistEntry[]
  organiserName: string
  organiserEmail: string
}

export function ParticipantsClient({ sweepstakeId, sweepstakeName, joinUrl, isEurovision = false, isPro, entryFee, currency = 'GBP', drawDone, initialParticipants, initialWaitlist, organiserName, organiserEmail }: Props) {
  const supabase = createClient()
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(initialWaitlist)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [removeConfirm, setRemoveConfirm] = useState<{ id: string; name: string } | null>(null)
  const [removeOption, setRemoveOption] = useState<'return-teams' | null>('return-teams')
  const [removing, setRemoving] = useState(false)

  const cap = isPro ? PRO_PLAN_CAP : FREE_PLAN_CAP
  const atCap = participants.length >= cap
  const paidCount = participants.filter(p => p.paid).length

  const alreadyJoined = organiserEmail
    ? participants.some(p => p.email?.toLowerCase() === organiserEmail.toLowerCase())
    : false

  function fillAsOrganiser() {
    setName(organiserName)
    setEmail(organiserEmail)
  }

  function handleWaitlistPromote(id: string, participant: Participant) {
    setWaitlist(prev => prev.filter(e => e.id !== id))
    setParticipants(prev => [...prev, participant])
  }

  function handleWaitlistRemove(id: string) {
    setWaitlist(prev => prev.filter(e => e.id !== id))
  }
  const [chaseAllStatus, setChaseAllStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const unpaidWithEmail = participants.filter(p => !p.paid && p.email).length

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (atCap) {
      const message = isPro
        ? `You've reached the ${PRO_PLAN_CAP}-participant limit.`
        : `You've reached the ${FREE_PLAN_CAP}-participant limit. Upgrade to Pro for up to ${PRO_PLAN_CAP} participants.`
      setError(message)
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

  function handleRemoveClick(id: string) {
    const participant = participants.find(p => p.id === id)
    if (!participant) return

    if (drawDone) {
      setRemoveConfirm({ id, name: participant.name })
      setRemoveOption('return-teams')
    } else {
      handleConfirmRemove(id, 'return-teams')
    }
  }

  function handleConfirmRemove(id: string, option: 'return-teams') {
    const previous = participants
    setParticipants(prev => prev.filter(p => p.id !== id))
    setRemoving(true)

    startTransition(async () => {
      try {
        // If draw is done and user chose "return teams to pool", delete assignments first
        if (drawDone && option === 'return-teams') {
          const { error: delError } = await supabase
            .from('assignments')
            .delete()
            .eq('sweepstake_id', sweepstakeId)
            .eq('participant_id', id)
          if (delError) throw delError
        }

        // Delete the participant
        const { error } = await supabase.from('participants').delete().eq('id', id)
        if (error) {
          setParticipants(previous)
          throw error
        }

        setRemoveConfirm(null)
      } catch (err) {
        setParticipants(previous)
        setError(err instanceof Error ? err.message : 'Failed to remove participant')
      } finally {
        setRemoving(false)
      }
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
      <PaymentSummary total={participants.length} paid={paidCount} entryFee={entryFee} currency={currency} />

      {/* Add participant form */}
      <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-pitch tracking-tight">Add participant</h2>
          {!atCap && !alreadyJoined && organiserName && (
            <button
              type="button"
              onClick={fillAsOrganiser}
              className="text-xs font-medium text-grass hover:underline"
            >
              + Add myself
            </button>
          )}
          {alreadyJoined && (
            <span className="text-xs text-mid">✓ You&apos;re already in</span>
          )}
        </div>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              placeholder="Name *"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={atCap}
              className="w-full sm:flex-1 px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm disabled:bg-light disabled:cursor-not-allowed"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={atCap}
              className="w-full sm:flex-1 px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm disabled:bg-light disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={atCap || !name.trim()}
              className="w-full sm:w-auto bg-lime text-pitch text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              Add
            </button>
          </div>

          {atCap && (
            <p className="text-xs text-mid bg-light rounded-lg px-3 py-2">
              {isPro
                ? `Pro plan limit reached (${PRO_PLAN_CAP} participants).`
                : `Free plan limit reached (${FREE_PLAN_CAP} participants). Upgrade to Pro for up to ${PRO_PLAN_CAP} participants.`}
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
                {participants.length}{!isPro ? `/${FREE_PLAN_CAP}` : `/${PRO_PLAN_CAP}`}
              </span>
            </h2>
            <div className="flex items-center gap-3">
              {isPro && (
                <div className="relative inline-block">
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full absolute -top-2 -right-2 z-10">
                    Coming soon
                  </span>
                  <a
                    href={`/api/dashboard/${sweepstakeId}/export/participants`}
                    download
                    className="text-xs text-grass font-medium hover:underline opacity-60 pointer-events-none cursor-not-allowed"
                  >
                    Download CSV
                  </a>
                </div>
              )}
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
                currency={currency}
                onTogglePaid={handleTogglePaid}
                onRemove={handleRemoveClick}
              />
            ))}
          </ul>
        </div>
      )}

      {participants.length === 0 && (
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-mid mb-1">Or invite them</p>
          <h3 className="font-heading font-bold text-pitch tracking-tight mb-1">Share the self-signup link</h3>
          <p className="text-sm text-mid mb-4">
            Send this to your group — they sign themselves up. No manual adding needed.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
            <code className="flex-1 bg-light rounded-lg px-3 py-2.5 text-xs text-pitch font-mono truncate border border-[#E5EDEA]">
              {joinUrl}
            </code>
          </div>
          <ShareButtons
            url={joinUrl}
            sweepstakeName={sweepstakeName}
            isEurovision={isEurovision}
            size="lg"
          />
        </div>
      )}

      {/* Reserve / waitlist */}
      {waitlist.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-amber-100 bg-amber-50">
            <div>
              <h2 className="font-heading font-bold text-pitch tracking-tight">
                Reserve list
                <span className="ml-2 text-sm font-normal text-mid font-body">{waitlist.length}</span>
              </h2>
              <p className="text-xs text-amber-700 mt-0.5">
                {atCap ? 'Sweepstake is full — remove a participant to promote someone.' : 'Promote to move someone into a confirmed spot.'}
              </p>
            </div>
          </div>
          <ul className="px-4 py-2 divide-y divide-[#E5EDEA]/60">
            {waitlist.map(entry => (
              <WaitlistRow
                key={entry.id}
                entry={entry}
                sweepstakeId={sweepstakeId}
                atCap={atCap}
                onPromote={handleWaitlistPromote}
                onRemove={handleWaitlistRemove}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Remove confirmation modal */}
      {removeConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full space-y-4">
            <div className="px-6 py-4 border-b border-[#E5EDEA]">
              <h2 className="font-heading font-bold text-pitch text-lg">Remove participant?</h2>
              <p className="text-mid text-sm mt-1">
                {drawDone
                  ? `Remove ${removeConfirm.name} and return their assigned teams to the available pool?`
                  : `Remove ${removeConfirm.name} from this sweepstake?`}
              </p>
            </div>

            {drawDone && (
              <div className="px-6 pt-2">
                <p className="text-xs text-mid mb-2">Their teams will be unassigned and available for rebalancing.</p>
              </div>
            )}

            <div className="px-6 pb-4 flex gap-3">
              <button
                type="button"
                onClick={() => setRemoveConfirm(null)}
                disabled={removing}
                className="flex-1 px-4 py-2 bg-light text-pitch text-sm font-medium rounded-lg hover:bg-[#D1D9D5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (removeConfirm && removeOption) {
                    handleConfirmRemove(removeConfirm.id, removeOption)
                  }
                }}
                disabled={removing}
                className="flex-1 px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {removing ? 'Removing…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
