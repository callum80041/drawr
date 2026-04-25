'use client'

import { useState, use, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShareButtons } from '@/components/dashboard/ShareButtons'
import { type CurrencyCode } from '@/lib/constants/currencies'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { ParticipantOAuthButtons } from './ParticipantOAuthButtons'

type SignupTab = 'standard' | 'oauth'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

interface Props {
  params: Promise<{ token: string }>
}

export default function JoinPage({ params }: Props) {
  const { token } = use(params)
  const searchParams = useSearchParams()
  const [signupTab, setSignupTab] = useState<SignupTab>('standard')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('') // spam trap
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [successData, setSuccessData] = useState<{ name: string; sweepstakeName: string; entryFee: number; currency: CurrencyCode; waitlisted: boolean } | null>(null)

  const joinUrl = `${APP_URL}/join/${token}`

  async function performJoin(signupMethod: string) {
    if (!name.trim()) return
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: name.trim(),
          email: email.trim(),
          website: honeypot,
          signup_method: signupMethod,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setSuccessData({
        name: data.participant.name,
        sweepstakeName: data.sweepstake.name,
        entryFee: data.sweepstake.entryFee,
        currency: data.sweepstake.currency ?? 'GBP',
        waitlisted: !!data.waitlisted,
      })
      setStatus('success')
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  async function handleSubmit(e: React.FormEvent, signupMethod: string = 'email') {
    e.preventDefault()
    await performJoin(signupMethod)
  }

  function handleOAuthError(error: string) {
    setErrorMsg(error)
    setStatus('error')
  }

  // Handle OAuth callback — pre-fill form and auto-submit
  useEffect(() => {
    const oauthEmail = searchParams.get('email')
    const oauthName = searchParams.get('name')
    const signupMethod = searchParams.get('signup_method')

    if (oauthEmail && oauthName && signupMethod) {
      setEmail(oauthEmail)
      setName(oauthName)
      setAgeConfirmed(true)
      setSignupTab('oauth')
      // Auto-submit after state update
      setTimeout(() => {
        performJoin(signupMethod)
      }, 100)
    }
  }, [])

  if (status === 'success' && successData) {
    const isWaitlisted = successData.waitlisted

    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-[#E5EDEA] overflow-hidden">
            <div className="bg-pitch px-8 py-7">
              <p className="text-2xl font-heading font-black text-white tracking-tight">Drawr 🎲</p>
              <p className="text-sm text-white/50 mt-1">Sweepstake</p>
            </div>
            <div className="px-8 py-8 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isWaitlisted ? 'bg-amber-100' : 'bg-lime'}`}>
                {isWaitlisted ? (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="11" stroke="#92400e" strokeWidth="2.5"/>
                    <path d="M14 8v6l4 2" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                    <path d="M2 11l7 7L26 2" stroke="#1A2E22" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              {isWaitlisted ? (
                <>
                  <h1 className="text-2xl font-heading font-black text-pitch tracking-tight mb-2">You&apos;re on the reserve list ⏳</h1>
                  <p className="text-mid text-sm leading-relaxed mb-2">
                    <strong className="text-pitch">{successData.sweepstakeName}</strong> is currently full, {successData.name}.
                  </p>
                  <p className="text-mid text-sm leading-relaxed">
                    You&apos;re on the reserve list — if a spot opens up we&apos;ll email you straight away. Fingers crossed!
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-heading font-black text-pitch tracking-tight mb-2">You&apos;re in! 🎉</h1>
                  <p className="text-mid text-sm leading-relaxed mb-2">
                    Welcome to <strong className="text-pitch">{successData.sweepstakeName}</strong>, {successData.name}.
                  </p>
                  <p className="text-mid text-sm leading-relaxed">
                    Sit tight — you&apos;ll find out your draw once the organiser runs it.
                    Fingers crossed for a good one.
                  </p>
                </>
              )}

              {successData.entryFee > 0 && (
                <div className="mt-5 bg-light rounded-xl px-5 py-4 text-left">
                  <p className="text-xs text-mid uppercase tracking-wide font-semibold mb-1">Entry fee</p>
                  <p className="text-2xl font-heading font-black text-pitch">{formatCurrency(successData.entryFee, successData.currency)}</p>
                  <p className="text-xs text-mid mt-1">Pay your organiser directly — they&apos;ll mark you as paid.</p>
                </div>
              )}

              {/* View leaderboard */}
              <Link
                href={`/s/${token}`}
                className="block mt-5 bg-pitch text-white font-bold text-sm text-center py-3.5 rounded-xl hover:bg-pitch/90 transition-colors"
              >
                View the leaderboard →
              </Link>

              {/* Tell a mate */}
              <div className="mt-4 bg-light rounded-xl px-5 py-4 text-left">
                <p className="text-sm font-semibold text-pitch mb-0.5">Know someone else who&apos;d want in?</p>
                <p className="text-xs text-mid mb-3">Send them the join link.</p>
                <ShareButtons url={joinUrl} sweepstakeName={successData.sweepstakeName} />
              </div>

              <p className="mt-6 text-xs text-mid">
                Want to run your own sweepstake?{' '}
                <Link href="/signup" className="text-grass hover:underline font-medium">
                  Start one free →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[#E5EDEA] overflow-hidden">
          {/* Header */}
          <div className="bg-pitch px-8 py-7">
            <p className="text-2xl font-heading font-black text-white tracking-tight">Drawr 🎲</p>
            <p className="text-sm text-white/50 mt-1">Sweepstake</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h1 className="text-2xl font-heading font-black text-pitch tracking-tight mb-1">
              Join the sweepstake
            </h1>
            <p className="text-sm text-mid mb-6 leading-relaxed">
              Enter your details to grab your spot. You&apos;ll be assigned a team once the organiser runs the draw.
            </p>

            {/* Signup tabs */}
            <div className="flex gap-1 bg-light rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => { setSignupTab('standard'); setErrorMsg('') }}
                className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                  signupTab === 'standard'
                    ? 'bg-white text-pitch shadow-sm'
                    : 'text-mid hover:text-pitch'
                }`}
              >
                Standard signup
              </button>
              <button
                type="button"
                onClick={() => { setSignupTab('oauth'); setErrorMsg('') }}
                className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                  signupTab === 'oauth'
                    ? 'bg-white text-pitch shadow-sm'
                    : 'text-mid hover:text-pitch'
                }`}
              >
                Quick signup
              </button>
            </div>

            {signupTab === 'standard' ? (
            <form onSubmit={(e) => handleSubmit(e, 'email')} className="space-y-4">
              {/* Honeypot — hidden from real users, bots fill it */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pitch uppercase tracking-wide mb-1.5">
                  Your name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jamie Vardy"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-xl border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pitch uppercase tracking-wide mb-1.5">
                  Email address <span className="text-mid font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. jamie@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-xl border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm disabled:opacity-60"
                />
                <p className="text-xs text-mid mt-1.5">
                  No spam — only used to send you your draw result and leaderboard updates.
                </p>
              </div>

              {/* 18+ confirmation */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  checked={ageConfirmed}
                  onChange={e => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#D1D9D5] accent-[#1A2E22] shrink-0 cursor-pointer"
                />
                <span className="text-xs text-mid leading-relaxed group-hover:text-pitch transition-colors">
                  I confirm I am aged 18 or over. I understand this is a sweepstake for entertainment purposes only —
                  no gambling services are provided.{' '}
                  <a
                    href="/responsible-gambling"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-grass hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    Gamble responsibly.
                  </a>
                </span>
              </label>

              {status === 'error' && errorMsg && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting' || !name.trim() || !ageConfirmed}
                className="w-full bg-lime text-pitch font-bold text-base py-3.5 rounded-xl hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Joining…' : 'Join sweepstake →'}
              </button>
            </form>
            ) : (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-sm text-mid mb-2">Sign up quickly with Google or X</p>
                <p className="text-xs text-mid/60">We&apos;ll use your email and name from your account</p>
              </div>

              <ParticipantOAuthButtons token={token} onError={handleOAuthError} />

              {status === 'error' && errorMsg && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{errorMsg}</p>
              )}

              <div className="mt-4 p-4 rounded-lg border border-[#E5EDEA] bg-light/50">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    checked={ageConfirmed}
                    onChange={e => setAgeConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#D1D9D5] accent-[#1A2E22] shrink-0 cursor-pointer"
                  />
                  <span className="text-xs text-mid leading-relaxed group-hover:text-pitch transition-colors">
                    I confirm I am aged 18 or over. I understand this is a sweepstake for entertainment purposes only —
                    no gambling services are provided.{' '}
                    <a
                      href="/responsible-gambling"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-grass hover:underline"
                      onClick={e => e.stopPropagation()}
                    >
                      Gamble responsibly.
                    </a>
                  </span>
                </label>
              </div>
            </div>
            )}

            <p className="mt-5 text-center text-xs text-mid">
              Already signed up?{' '}
              <Link href={`/s/${token}`} className="text-grass hover:underline font-medium">
                View the leaderboard →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-mid mt-4">
          Powered by{' '}
          <Link href="/" className="text-grass hover:underline font-medium">
            playdrawr.co.uk
          </Link>
        </p>
      </div>
    </div>
  )
}
