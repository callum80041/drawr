'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface OAuthButtonsProps {
  onError?: (error: string) => void
}

export function OAuthButtons({ onError }: OAuthButtonsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<'google' | null>(null)
  const supabase = createClient()

  async function handleOAuth(provider: 'google') {
    setLoading(provider)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        onError?.(error.message)
        setLoading(null)
      }
    } catch (err: any) {
      onError?.(err.message || 'Something went wrong')
      setLoading(null)
    }
  }

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#D1D9D5]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-mid">Or continue with</span>
        </div>
      </div>

      <div className="flex">
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          disabled={loading !== null}
          className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch font-medium text-sm hover:bg-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {loading === 'google' ? 'Signing in…' : 'Google'}
        </button>
      </div>
    </>
  )
}
