'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  organiserId: string
  hasName: boolean
  hasPassword: boolean
}

export function SetupBanner({ userId, organiserId, hasName, hasPassword }: Props) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!hasName && !name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!hasPassword && password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const supabase = createClient()

    try {
      // Update name in auth if needed
      if (!hasName && name.trim()) {
        const { error: updateAuthError } = await supabase.auth.updateUser({
          data: { name: name.trim() }
        })
        if (updateAuthError) throw updateAuthError
      }

      // Set password if needed
      if (!hasPassword && password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password
        })
        if (passwordError) throw passwordError
      }

      // Update organiser name in database if needed
      if (!hasName && name.trim()) {
        const { error: updateOrgError } = await supabase
          .from('organisers')
          .update({ name: name.trim() })
          .eq('id', organiserId)

        if (updateOrgError) throw updateOrgError
      }

      setCompleted(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  if (completed) {
    return (
      <div className="bg-grass/10 border border-grass/30 rounded-xl p-4 mb-8 flex items-center gap-3">
        <span className="text-xl">✓</span>
        <p className="text-sm text-pitch font-medium">All set! You're ready to create sweepstakes.</p>
      </div>
    )
  }

  return (
    <div className="bg-lime/10 border border-lime/30 rounded-xl p-5 mb-8">
      <h3 className="font-heading text-sm font-bold text-pitch mb-3">
        {!hasName && !hasPassword ? 'Complete your profile' : !hasName ? 'Set your name' : 'Create a password'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        {!hasName && (
          <div>
            <label htmlFor="banner-name" className="block text-xs font-medium text-pitch mb-1">
              Your name
            </label>
            <input
              id="banner-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sarah or Dave"
              className="w-full px-3 py-2 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
            />
          </div>
        )}

        {!hasPassword && (
          <div>
            <label htmlFor="banner-password" className="block text-xs font-medium text-pitch mb-1">
              Create a password
            </label>
            <input
              id="banner-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full px-3 py-2 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
            />
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={loading || (!hasName && !name.trim()) || (!hasPassword && password.length < 8)}
            className="bg-lime text-pitch text-xs font-medium px-3.5 py-1.5 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
