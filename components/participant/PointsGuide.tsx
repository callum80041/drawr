'use client'

import { useState } from 'react'
import { POINTS } from '@/lib/scoring'

const STAGES = [
  {
    phase: 'Group stage',
    rows: [
      { result: 'Win',  pts: POINTS.GROUP_WIN,  note: 'Your team turns up. Full commitment. Three points.' },
      { result: 'Draw', pts: POINTS.GROUP_DRAW, note: 'One point. Both teams agreed not to decide anything. Classic football.' },
      { result: 'Loss', pts: POINTS.GROUP_LOSS, note: "Zero. We don't talk about this." },
    ],
  },
  {
    phase: 'Knockout rounds — points per match won',
    rows: [
      { result: 'Round of 32 win',   pts: POINTS.R32_WIN,   note: "Each win earns points. Your team isn't just making up the numbers." },
      { result: 'Round of 16 win',   pts: POINTS.R16_WIN,   note: 'Top 16 in the world. You may begin quietly believing.' },
      { result: 'Quarter-final win', pts: POINTS.QF_WIN,    note: 'Top 8. Phone in sick. Clear your weekend.' },
      { result: 'Semi-final win',    pts: POINTS.SF_WIN,    note: 'Final four. Your team is basically carrying you at this point.' },
      { result: 'Win the World Cup', pts: POINTS.FINAL_WIN, note: 'Champions of the world. The big one.' },
    ],
  },
]

export function PointsGuide() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-[#E5EDEA] bg-white overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-light/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🧮</span>
          <span className="font-heading font-bold text-pitch text-sm">How does scoring work?</span>
          <span className="text-xs text-mid hidden sm:block">(no offside knowledge required)</span>
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
            Simple: your team earns points, you earn points. No VAR reviews, no 45-minute
            injury-time debates, no conspiracy theories about referees. Just maths.
          </p>

          {STAGES.map(stage => (
            <div key={stage.phase}>
              <p className="text-xs font-medium text-mid uppercase tracking-wider mb-2">{stage.phase}</p>
              <div className="space-y-1">
                {stage.rows.map(row => (
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
          ))}

          {/* VAR note */}
          <div className="bg-light rounded-lg px-4 py-3 flex items-start gap-2.5">
            <span className="text-base shrink-0">📺</span>
            <p className="text-xs text-mid leading-relaxed">
              <strong className="text-pitch">VAR note:</strong> all points are final. There is no video review.
              Unlike actual football, our decisions are correct the first time and we won&apos;t spend
              six minutes staring at a screen before awarding something that still upsets everyone.
            </p>
          </div>

          {/* World Cup winner note */}
          <div className="bg-lime/10 border border-lime/30 rounded-lg px-4 py-3 space-y-1.5">
            <p className="text-xs font-medium text-pitch">🏆 So… does the World Cup winner always win the sweepstake?</p>
            <p className="text-xs text-mid leading-relaxed">
              Almost certainly, yes. With{' '}
              <strong className="text-pitch">{POINTS.FINAL_WIN} points</strong> just for lifting the trophy,
              the person who drew that team is almost certainly going home with the prize pot.
              If you&apos;re not particularly football-mad — don&apos;t worry, you&apos;ll hear about it
              if you win. Trust us. This only happens every four years and the whole country loses
              its mind regardless. You&apos;ll know.
            </p>
          </div>

          <p className="text-xs text-mid text-center">
            A team that wins every game all the way to glory can earn up to{' '}
            <strong className="text-pitch">
              {POINTS.GROUP_WIN * 3 + POINTS.R32_WIN + POINTS.R16_WIN + POINTS.QF_WIN + POINTS.SF_WIN + POINTS.FINAL_WIN} points
            </strong>
            . Choose your team wisely. Or just hope for the best — that&apos;s what sweepstakes are for.
          </p>
        </div>
      )}
    </div>
  )
}
