'use client'

import { useState } from 'react'
import { type CurrencyCode } from '@/lib/constants/currencies'
import { formatCurrency } from '@/lib/utils/formatCurrency'

interface Participant {
  id: string
  name: string
  email: string | null
  paid: boolean
}

interface Props {
  participant: Participant
  sweepstakeId: string
  entryFee: number
  currency?: CurrencyCode
  onTogglePaid: (id: string, paid: boolean) => void
  onRemove: (id: string) => void
}

type ActionStatus = 'idle' | 'sending' | 'sent' | 'error'

export function ParticipantRow({ participant, sweepstakeId, entryFee, currency = 'GBP', onTogglePaid, onRemove }: Props) {
  const [inviteStatus, setInviteStatus] = useState<ActionStatus>('idle')
  const [chaseStatus, setChaseStatus] = useState<ActionStatus>('idle')

  async function handleInvite() {
    setInviteStatus('sending')
    try {
      const res = await fetch('/api/email/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: participant.id, sweepstakeId }),
      })
      setInviteStatus(res.ok ? 'sent' : 'error')
    } catch {
      setInviteStatus('error')
    }
  }

  async function handleChase() {
    setChaseStatus('sending')
    try {
      const res = await fetch('/api/email/payment-chase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: participant.id, sweepstakeId }),
      })
      setChaseStatus(res.ok ? 'sent' : 'error')
    } catch {
      setChaseStatus('error')
    }
  }

  return (
    <li className="flex items-center gap-3 py-3 px-4 hover:bg-light/50 rounded-lg -mx-1 group">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-mid/20 flex items-center justify-center shrink-0">
        <span className="text-xs font-medium text-mid">
          {participant.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Name / email */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-pitch truncate">{participant.name}</p>
        {participant.email && (
          <p className="text-xs text-mid truncate">{participant.email}</p>
        )}
      </div>

      {/* Invite button — only if email present */}
      {participant.email && (
        <button
          type="button"
          onClick={handleInvite}
          disabled={inviteStatus === 'sending' || inviteStatus === 'sent'}
          title={inviteStatus === 'sent' ? 'Invite sent!' : `Send invite to ${participant.email}`}
          className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors shrink-0 ${
            inviteStatus === 'sent'  ? 'bg-lime/20 border-lime/40 text-pitch cursor-default' :
            inviteStatus === 'error' ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' :
            'bg-white border-[#D1D9D5] text-mid hover:border-mid hover:text-pitch'
          } disabled:opacity-60`}
        >
          {inviteStatus === 'sending' ? '…' : inviteStatus === 'sent' ? '✓ Invited' : inviteStatus === 'error' ? 'Retry' : 'Invite'}
        </button>
      )}

      {/* Chase button — only if email present and not paid */}
      {participant.email && !participant.paid && entryFee > 0 && (
        <button
          type="button"
          onClick={handleChase}
          disabled={chaseStatus === 'sending' || chaseStatus === 'sent'}
          title={chaseStatus === 'sent' ? 'Reminder sent!' : `Send payment reminder to ${participant.email}`}
          className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors shrink-0 ${
            chaseStatus === 'sent'  ? 'bg-lime/20 border-lime/40 text-pitch cursor-default' :
            chaseStatus === 'error' ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' :
            'bg-white border-[#D1D9D5] text-mid hover:border-mid hover:text-pitch'
          } disabled:opacity-60`}
        >
          {chaseStatus === 'sending' ? '…' : chaseStatus === 'sent' ? '✓ Chased' : chaseStatus === 'error' ? 'Retry' : 'Chase'}
        </button>
      )}

      {/* Paid toggle */}
      <button
        type="button"
        onClick={() => onTogglePaid(participant.id, !participant.paid)}
        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
          participant.paid
            ? 'bg-lime/20 border-lime/40 text-pitch hover:bg-lime/30'
            : 'bg-white border-[#D1D9D5] text-mid hover:border-mid'
        }`}
        title={participant.paid ? 'Mark unpaid' : 'Mark paid'}
      >
        {participant.paid ? (
          <>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="text-grass">
              <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Paid{entryFee > 0 ? ` ${formatCurrency(entryFee, currency)}` : ''}
          </>
        ) : (
          <>Unpaid{entryFee > 0 ? ` ${formatCurrency(entryFee, currency)}` : ''}</>
        )}
      </button>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(participant.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-mid hover:text-red-500 rounded"
        title="Remove participant"
        aria-label={`Remove ${participant.name}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  )
}
