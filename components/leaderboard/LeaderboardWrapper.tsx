'use client'

import { useState } from 'react'
import { ShareModal } from './ShareModal'

interface LeaderboardWrapperProps {
  token: string
  sweepstakeName: string
  isPro: boolean
  isEurovision: boolean
  children: React.ReactNode
}

export function LeaderboardWrapper({
  token,
  sweepstakeName,
  isPro,
  isEurovision,
  children,
}: LeaderboardWrapperProps) {
  const [isShareOpen, setIsShareOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-lg font-bold" style={isEurovision ? { color: '#040241' } : { color: '#1A2E22' }}>
          Leaderboard
        </h2>
        {isPro ? (
          <button
            onClick={() => setIsShareOpen(true)}
            className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
            style={
              isEurovision
                ? { borderColor: '#CFC3F0', color: '#040241', background: 'rgba(241,15,89,0.06)' }
                : { borderColor: '#E5EDEA', color: '#1A2E22', background: '#fff' }
            }
          >
            Share →
          </button>
        ) : (
          <div className="relative inline-block">
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full absolute -top-2 -right-2 z-10">
              Coming soon
            </span>
            <button
              disabled
              className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors opacity-60 cursor-not-allowed pointer-events-none"
              style={
                isEurovision
                  ? { borderColor: '#CFC3F0', color: '#040241', background: 'rgba(241,15,89,0.06)' }
                  : { borderColor: '#E5EDEA', color: '#1A2E22', background: '#fff' }
              }
            >
              Share →
            </button>
          </div>
        )}
      </div>

      {children}

      <ShareModal token={token} sweepstakeName={sweepstakeName} isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  )
}
