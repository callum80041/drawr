'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  /** 'hero' = on dark pitch bg, 'band' = on dark green band */
  variant?: 'hero' | 'band'
}

export function HeroEmailForm({ variant = 'hero' }: Props) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setStatus('submitting')
    const trimmedEmail = email.trim().toLowerCase()

    try {
      // Create account & establish session
      const response = await fetch('/api/auth/quick-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create account')
      }

      // Redirect straight to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong')
      setStatus('idle')
    }
  }

  const inputClass = 'flex-1 min-w-0 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-lime focus:ring-2 focus:ring-lime/30'

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={status === 'submitting'}
          className={`${inputClass} px-4 py-4 rounded-xl text-sm outline-none transition-colors disabled:opacity-60`}
        />
        <button
          type="submit"
          disabled={status === 'submitting' || !email.trim()}
          className="shrink-0 bg-lime text-pitch font-bold text-base px-8 py-4 rounded-xl shadow-[0_4px_16px_rgba(200,240,70,0.4)] hover:scale-105 hover:shadow-[0_6px_24px_rgba(200,240,70,0.6)] transition-all duration-200 border-2 border-lime/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-[0_4px_16px_rgba(200,240,70,0.4)] whitespace-nowrap"
        >
          {status === 'submitting' ? '…' : 'Start free'}
        </button>
      </div>
      {errorMsg && (
        <p className="text-xs text-red-400 px-1 mt-2">{errorMsg}</p>
      )}
    </form>
  )
}
