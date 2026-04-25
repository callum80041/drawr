'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Wordmark } from '@/components/brand/Wordmark'

export default function WelcomePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasPassword, setHasPassword] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Pre-fill name if from signup (stored in metadata)
      const metaName = user.user_metadata?.name
      if (metaName) {
        setName(metaName)
      }

      // Check auth methods: OAuth users have 'google'/'twitter', email users have 'password'
      const providers = user.identities?.map((i: any) => i.provider) || []
      const isOAuthUser = providers.includes('google') || providers.includes('twitter')
      const hasPasswordAuth = providers.includes('password')

      // For OAuth users or those who already set password: no password input needed
      setHasPassword(isOAuthUser || hasPasswordAuth)
    }

    checkUser()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    if (!hasPassword && password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    try {
      // Update name in auth metadata (for all users)
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { name: trimmed }
      })
      if (updateAuthError) throw updateAuthError

      // Set password if they came via magic link
      if (!hasPassword && password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password
        })
        if (passwordError) throw passwordError
      }

      // Update organiser name in database
      const { error: updateOrgError } = await supabase
        .from('organisers')
        .update({ name: trimmed })
        .eq('user_id', user.id)

      if (updateOrgError) throw updateOrgError

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-pitch flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Wordmark size="lg" variant="light" />
        </div>

        <div className="bg-white rounded-2xl p-8">
          <h1 className="font-heading text-2xl font-bold text-pitch tracking-tight mb-2">
            What should we call you?
          </h1>
          <p className="text-sm text-mid mb-6">
            This is how you'll appear to participants in your sweepstakes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-pitch mb-1.5">
                Your name
              </label>
              <input
                id="name"
                type="text"
                required
                autoFocus
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
                placeholder="e.g. Sarah or Dave from the pub"
              />
            </div>

            {!hasPassword && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-pitch mb-1.5">
                  Create a password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoFocus
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
                  placeholder="Min. 8 characters"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim() || (!hasPassword && password.length < 8)}
              className="w-full bg-lime text-pitch font-medium py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Setting up…' : 'Go to dashboard'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
