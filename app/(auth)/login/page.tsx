'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Wordmark } from '@/components/brand/Wordmark'

type Mode = 'password' | 'magic'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicSent, setMagicSent] = useState(false)

  const supabase = createClient()

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMagicSent(true)
    }
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
            Sign in
          </h1>

          {/* Mode tabs */}
          <div className="flex gap-1 bg-light rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('password'); setError('') }}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                mode === 'password'
                  ? 'bg-white text-pitch shadow-sm'
                  : 'text-mid hover:text-pitch'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => { setMode('magic'); setError('') }}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                mode === 'magic'
                  ? 'bg-white text-pitch shadow-sm'
                  : 'text-mid hover:text-pitch'
              }`}
            >
              Magic link
            </button>
          </div>

          {mode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
                  placeholder="••••••••"
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
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          ) : magicSent ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-3">📬</div>
              <p className="font-medium text-pitch mb-1">Check your inbox</p>
              <p className="text-sm text-mid">We sent a sign-in link to <strong>{email}</strong></p>
              <button
                type="button"
                onClick={() => { setMagicSent(false); setEmail('') }}
                className="mt-4 text-sm text-grass hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label htmlFor="magic-email" className="block text-sm font-medium text-pitch mb-1.5">
                  Email
                </label>
                <input
                  id="magic-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
                  placeholder="you@example.com"
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
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-mid mt-6">
            No account?{' '}
            <Link href="/signup" className="text-grass font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
