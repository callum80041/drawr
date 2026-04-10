'use client'

import { useState } from 'react'
import { EUROVISION_POINTS } from '@/lib/scoring'

const ROWS = [
  {
    pts: EUROVISION_POINTS.REACH_FINAL,
    result: 'Reaches Grand Final',
    note: 'Your country qualifies from their semi-final (or is already auto-qualified as a Big 5 country or Austria).',
  },
  {
    pts: EUROVISION_POINTS.POSITION_TOP10,
    result: '4th–10th in the Final',
    note: 'Solid performance. Not quite a trophy, but the scoreboard is looking healthy.',
  },
  {
    pts: EUROVISION_POINTS.POSITION_TOP3,
    result: '2nd or 3rd in the Final',
    note: "Close, so close. They'll be back. Probably.",
  },
  {
    pts: EUROVISION_POINTS.POSITION_WINNER,
    result: 'Wins Eurovision',
    note: 'Twelve points. The big one. Your country hosts next year and you collect the prize pot.',
  },
]

const MAX_POINTS = EUROVISION_POINTS.REACH_FINAL + EUROVISION_POINTS.POSITION_WINNER

export function EurovisionPointsGuide() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-[#E5EDEA] bg-white overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-light/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🎤</span>
          <span className="font-heading font-bold text-pitch text-sm">How does scoring work?</span>
          <span className="text-xs text-mid hidden sm:block">(no musical knowledge required)</span>
        </div>
        <svg
          className={`text-mid transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-[#E5EDEA]">
          <p className="text-sm text-mid pt-4 leading-relaxed">
            Simple: your country earns points, you earn points. No jury politics, no televote conspiracy theories.
            Just maths and whatever Switzerland submits.
          </p>

          <div>
            <p className="text-xs font-medium text-mid uppercase tracking-wider mb-2">Points — cumulative</p>
            <div className="space-y-1">
              {ROWS.map(row => (
                <div key={row.result} className="flex items-start gap-3 py-2 border-b border-[#E5EDEA]/60 last:border-0">
                  <div className="flex items-center gap-2 min-w-[160px] shrink-0">
                    <span className="font-heading font-bold text-pitch text-sm w-7 text-right tabular-nums">
                      {row.pts}
                    </span>
                    <span className="text-xs text-mid">pts</span>
                    <span className="text-sm font-medium text-pitch">— {row.result}</span>
                  </div>
                  <p className="text-xs text-mid leading-relaxed">{row.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-light rounded-lg px-4 py-3 flex items-start gap-2.5">
            <span className="text-base shrink-0">✨</span>
            <p className="text-xs text-mid leading-relaxed">
              <strong className="text-pitch">Auto-qualified countries</strong> (UK, France, Germany, Spain, Italy &amp; Austria as host)
              skip the semi-finals and go straight to the Grand Final — they automatically earn the <strong className="text-pitch">Reaches Final</strong> points.
            </p>
          </div>

          <div className="bg-lime/10 border border-lime/30 rounded-lg px-4 py-3 space-y-1.5">
            <p className="text-xs font-medium text-pitch">🏆 Does the Eurovision winner always win the sweepstake?</p>
            <p className="text-xs text-mid leading-relaxed">
              Almost certainly, yes. With{' '}
              <strong className="text-pitch">{MAX_POINTS} points</strong> on offer for a winning country,
              the person who drew that nation is almost certainly taking the prize.
              Unless they drew the UK. We say this with love.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
