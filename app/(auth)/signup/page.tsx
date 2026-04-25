'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Wordmark } from '@/components/brand/Wordmark'
import { OAuthButtons } from '@/app/(auth)/components/OAuthButtons'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkEmail, setCheckEmail] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // If Supabase returned a session immediately (email confirmation disabled),
    // skip the "check your email" screen and go straight to the dashboard.
    if (data.session) {
      router.push('/dashboard')
      return
    }

    setCheckEmail(true)
  }

  async function handleResend() {
    setResending(true)
    setResent(false)
    await supabase.auth.resend({ type: 'signup', email })
    setResending(false)
    setResent(true)
  }

  if (checkEmail) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">📬</div>
        <h1 className="font-heading text-xl font-bold text-pitch mb-2">Check your email</h1>
        <p className="text-sm text-mid mb-1">We sent a confirmation link to</p>
        <p className="text-sm font-semibold text-pitch mb-4">{email}</p>
        <p className="text-sm text-mid mb-6">
          Click the link in the email to activate your account and you&apos;ll land straight in your dashboard — no extra steps.
        </p>
        <div className="bg-light rounded-xl px-4 py-3 mb-6 text-left space-y-1.5">
          <p className="text-xs font-semibold text-pitch">Not seeing it?</p>
          <p className="text-xs text-mid">Check your spam or junk folder.</p>
          <p className="text-xs text-mid">
            The email comes from <span className="font-medium text-pitch">hello@playdrawr.co.uk</span>
          </p>
        </div>
        {resent ? (
          <p className="text-sm text-grass font-medium mb-4">✓ Resent — check your inbox again</p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-grass hover:underline disabled:opacity-50 mb-4 block mx-auto"
          >
            {resending ? 'Sending…' : 'Resend confirmation email'}
          </button>
        )}
        <Link href="/login" className="block text-sm text-mid hover:text-pitch transition-colors">
          ← Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-8">
      <h1 className="font-heading text-2xl font-bold text-pitch tracking-tight mb-6">
        Create account
      </h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-pitch mb-1.5">
            Your name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
            placeholder="Alex Smith"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-pitch mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-pitch mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
            placeholder="Min. 8 characters"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-lime text-pitch font-medium py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
        <p className="text-xs text-mid text-center leading-relaxed">
          🔒 We will never share your details with anyone. No spam, ever.
        </p>
      </form>

      <OAuthButtons onError={setError} />

      <p className="text-center text-sm text-mid mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-grass font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-pitch flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Wordmark size="lg" variant="light" />
        </div>
        <Suspense>
          <SignupForm />
        </Suspense>
        <p className="text-center text-xs text-mid/60 mt-4">
          Free forever for up to 48 participants
        </p>
      </div>
    </main>
  )
}
