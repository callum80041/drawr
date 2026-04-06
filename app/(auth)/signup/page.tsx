'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Wordmark } from '@/components/brand/Wordmark'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkEmail, setCheckEmail] = useState(false)

  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
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
    } else {
      // Supabase may auto-confirm or require email confirmation depending on project settings.
      // Redirect to dashboard; middleware will handle unauthenticated state.
      setCheckEmail(true)
    }
  }

  if (checkEmail) {
    return (
      <main className="min-h-screen bg-pitch flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Wordmark size="lg" variant="light" />
          </div>
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">📬</div>
            <h1 className="font-heading text-xl font-bold text-pitch mb-2">Check your email</h1>
            <p className="text-sm text-mid">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
            </p>
            <Link href="/login" className="block mt-6 text-sm text-grass hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-pitch flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Wordmark size="lg" variant="light" />
        </div>

        {/* Card */}
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

          <p className="text-center text-sm text-mid mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-grass font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-mid/60 mt-4">
          Free forever for up to 48 participants
        </p>
      </div>
    </main>
  )
}
