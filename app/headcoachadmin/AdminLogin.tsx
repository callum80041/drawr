'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AdminLogin() {
  const router  = useRouter()
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/headcoachadmin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      setError('Wrong password. Nice try.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pitch flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-4xl mb-3">🎲</p>
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">Head Coach</h1>
          <p className="text-white/40 text-sm mt-1">Admin access only</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent text-sm"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime text-pitch font-heading font-bold py-3 rounded-xl hover:bg-[#b8e03d] transition-colors disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Enter →'}
          </button>
        </form>
      </div>
    </div>
  )
}
