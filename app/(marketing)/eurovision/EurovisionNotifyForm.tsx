'use client'

import { useState } from 'react'

const PINK = '#F10F59'

interface EurovisionNotifyFormProps {
  ctaLabel?: string
}

export function EurovisionNotifyForm({ ctaLabel = 'Notify me at launch →' }: EurovisionNotifyFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/eurovision-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="rounded-2xl px-6 py-5 text-center"
        style={{ background: 'rgba(241,15,89,0.12)', border: '1px solid rgba(241,15,89,0.35)' }}
      >
        <p className="font-semibold text-lg leading-snug">
          You&apos;re on the list! We&apos;ll email you the moment it&apos;s live. ✨
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <input
        type="text"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff',
        }}
        autoComplete="name"
        disabled={status === 'loading'}
      />
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff',
        }}
        autoComplete="email"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-xl px-6 py-3.5 font-semibold text-sm transition-opacity"
        style={{
          background: PINK,
          color: '#fff',
          opacity: status === 'loading' ? 0.7 : 1,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
        }}
      >
        {status === 'loading' ? 'Saving…' : ctaLabel}
      </button>
      {status === 'error' && (
        <p className="text-sm text-center" style={{ color: PINK }}>
          {errorMsg}
        </p>
      )}
    </form>
  )
}
