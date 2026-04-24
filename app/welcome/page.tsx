'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Wordmark } from '@/components/brand/Wordmark'

export default function WelcomePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error: updateError } = await supabase
      .from('organisers')
      .update({ name: trimmed })
      .eq('user_id', user.id)

    if (updateError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    } else {
      router.push('/dashboard')
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
            This is how you&apos;ll appear to participants in your sweepstakes.
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

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full bg-lime text-pitch font-medium py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Saving…' : 'Continue to dashboard'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
