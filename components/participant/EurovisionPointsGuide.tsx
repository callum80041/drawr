'use client'

import { useState } from 'react'
import { EUROVISION_SEMI_BONUS } from '@/lib/scoring'

export function EurovisionPointsGuide() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(90,34,169,0.15)', background: '#fff' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🎤</span>
          <span className="font-heading font-bold text-sm" style={{ color: '#040241' }}>How does scoring work?</span>
          <span className="text-xs hidden sm:block" style={{ color: 'rgba(4,2,65,0.4)' }}>(no musical knowledge required)</span>
        </div>
        <svg
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'rgba(4,2,65,0.4)' }}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: 'rgba(90,34,169,0.1)' }}>
          <p className="text-sm pt-4 leading-relaxed" style={{ color: 'rgba(4,2,65,0.6)' }}>
            We follow the actual Eurovision scoring system — your sweepstake points are your country&apos;s real Grand Final score, just like watching the show.
          </p>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(90,34,169,0.06)', border: '1px solid rgba(90,34,169,0.12)' }}>
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-sm" style={{ color: '#040241' }}>Step 1 — Reach the Grand Final</p>
                <span className="font-heading font-bold text-sm" style={{ color: '#5A22A9' }}>+{EUROVISION_SEMI_BONUS} pts</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(4,2,65,0.55)' }}>
                Your country qualifies from their semi-final (or is already auto-qualified as a Big 5 country or Austria the host). Flat bonus — everyone who makes it gets this.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(241,15,89,0.06)', border: '1px solid rgba(241,15,89,0.15)' }}>
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-sm" style={{ color: '#040241' }}>Step 2 — Grand Final points</p>
                <span className="font-heading font-bold text-sm" style={{ color: '#F10F59' }}>+ real points</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(4,2,65,0.55)' }}>
                Your country&apos;s actual combined jury + public televote score from the Grand Final is added directly to your total. The same scoreboard you watch on TV — no position-based approximations.
              </p>
            </div>

            {/* Example */}
            <div className="rounded-xl p-4" style={{ background: '#F5F9F6', border: '1px solid #E5EDEA' }}>
              <p className="text-xs font-medium mb-2" style={{ color: '#040241' }}>Example</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(4,2,65,0.6)' }}>
                Your country qualifies from Semi-Final 1 ✓ (+{EUROVISION_SEMI_BONUS} pts), then scores 423 points in the Grand Final — your leaderboard total is <strong style={{ color: '#040241' }}>{EUROVISION_SEMI_BONUS + 423} points</strong>. If they get nul points in the final, you still have {EUROVISION_SEMI_BONUS}.
              </p>
            </div>
          </div>

          <div className="rounded-xl px-4 py-3 flex items-start gap-2.5" style={{ background: 'rgba(90,34,169,0.06)' }}>
            <span className="text-base shrink-0">📺</span>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(4,2,65,0.6)' }}>
              <strong style={{ color: '#040241' }}>Why this scoring?</strong> In Eurovision, the distance between 1st and 2nd can be hundreds of points — or just one. Copying the real scoring means the Saturday night leaderboard is exactly as dramatic for your sweepstake as it is on TV.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
