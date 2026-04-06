'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  /** 'hero' = on dark pitch bg, 'band' = on dark green band */
  variant?: 'hero' | 'band'
}

export function HeroEmailForm({ variant = 'hero' }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setStatus('submitting')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-start gap-3 bg-lime/15 border border-lime/30 rounded-xl px-5 py-4 max-w-md mx-auto text-left">
        <div className="w-5 h-5 rounded-full bg-lime flex items-center justify-center shrink-0 mt-0.5">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l2.5 2.5L9 1" stroke="#0B3D2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">You&apos;re reserved!</p>
          <p className="text-sm text-white/70 mt-0.5">
            We&apos;ve sent a magic link to <span className="text-white font-medium">{email}</span> — click it to open your dashboard.
          </p>
          <p className="text-xs text-white/50 mt-2">
            Next time, sign in at{' '}
            <a href="/login" className="text-lime hover:underline">
              playdrawr.co.uk/login
            </a>
            {' '}→ use &ldquo;Magic link&rdquo; with the same email.
          </p>
        </div>
      </div>
    )
  }

  const inputClass = variant === 'hero'
    ? 'flex-1 min-w-0 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-lime focus:ring-2 focus:ring-lime/30'
    : 'flex-1 min-w-0 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-lime focus:ring-2 focus:ring-lime/30'

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={status === 'submitting'}
          className={`${inputClass} px-4 py-3 rounded-xl text-sm outline-none transition-colors disabled:opacity-60`}
        />
        <button
          type="submit"
          disabled={status === 'submitting' || !email.trim()}
          className="shrink-0 bg-lime text-pitch font-bold text-sm px-5 py-3 rounded-xl hover:bg-[#d4f54d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'submitting' ? '…' : 'Reserve my draw →'}
        </button>
      </div>
      {status === 'error' && errorMsg && (
        <p className="text-xs text-red-400 px-1">{errorMsg}</p>
      )}
    </form>
  )
}
