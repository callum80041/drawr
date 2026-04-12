'use client'

import { useEffect, useState } from 'react'

const WORLD_CUP = [
  { name: 'Jake Murray',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'England'     },
  { name: 'Kim Shaw',       flag: '🇦🇷', team: 'Argentina'   },
  { name: 'Callum M.',      flag: '🇧🇷', team: 'Brazil'      },
  { name: 'Elaine Burton',  flag: '🇪🇸', team: 'Spain'       },
  { name: 'Daniel K.',      flag: '🇩🇪', team: 'Germany'     },
  { name: 'Mike D.',        flag: '🇵🇹', team: 'Portugal'    },
  { name: 'Nicky Evans',    flag: '🇺🇾', team: 'Uruguay'     },
  { name: 'Willow B.',      flag: '🇺🇸', team: 'USA'         },
  { name: 'Megan Clarke',   flag: '🇲🇽', team: 'Mexico'      },
  { name: 'Darcy Thompson', flag: '🇯🇵', team: 'Japan'       },
  { name: 'Leanne Fox',     flag: '🇨🇭', team: 'Switzerland' },
  { name: 'Charlotte Webb', flag: '🇸🇪', team: 'Sweden'      },
]

const EUROVISION = [
  { name: 'Sophie T.',     flag: '🇸🇪', team: 'Sweden'         },
  { name: 'Jake Murray',   flag: '🇬🇧', team: 'United Kingdom'  },
  { name: 'Elaine B.',     flag: '🇫🇷', team: 'France'          },
  { name: 'Kim Shaw',      flag: '🇳🇴', team: 'Norway'          },
  { name: 'Daniel K.',     flag: '🇮🇹', team: 'Italy'           },
  { name: 'Callum M.',     flag: '🇪🇸', team: 'Spain'           },
  { name: 'Willow B.',     flag: '🇺🇦', team: 'Ukraine'         },
  { name: 'Nicky Evans',   flag: '🇩🇪', team: 'Germany'         },
  { name: 'Leanne Fox',    flag: '🇨🇭', team: 'Switzerland'     },
  { name: 'Megan Clarke',  flag: '🇦🇹', team: 'Austria'         },
  { name: 'Mike D.',       flag: '🇸🇪', team: 'Iceland'         },
  { name: 'Charlotte W.',  flag: '🇮🇸', team: 'Moldova'         },
]

type Mode = 'worldcup' | 'eurovision'
type Phase = 'idle' | 'drawing' | 'done'

const DRAW_INTERVAL = 180   // ms per card reveal
const DONE_HOLD    = 3500   // ms holding the complete grid
const IDLE_HOLD    = 1200   // ms on "ready" screen between cycles

export function HeroDrawAnimation() {
  const [mode, setMode]             = useState<Mode>('worldcup')
  const [phase, setPhase]           = useState<Phase>('idle')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [shown, setShown]           = useState<typeof WORLD_CUP>([])

  const entries = mode === 'worldcup' ? WORLD_CUP : EUROVISION
  const isEV    = mode === 'eurovision'

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (phase === 'idle') {
      timer = setTimeout(() => {
        setShown([])
        setCurrentIdx(0)
        setPhase('drawing')
      }, IDLE_HOLD)
    }

    if (phase === 'drawing') {
      if (currentIdx < entries.length) {
        timer = setTimeout(() => {
          setShown(prev => [...prev, entries[currentIdx]])
          setCurrentIdx(i => i + 1)
        }, DRAW_INTERVAL)
      } else {
        timer = setTimeout(() => setPhase('done'), 300)
      }
    }

    if (phase === 'done') {
      timer = setTimeout(() => {
        // Alternate tournament each cycle
        setMode(m => m === 'worldcup' ? 'eurovision' : 'worldcup')
        setPhase('idle')
      }, DONE_HOLD)
    }

    return () => clearTimeout(timer)
  }, [phase, currentIdx, entries])

  const current = phase === 'drawing' && currentIdx < entries.length
    ? entries[currentIdx]
    : null

  const accentColor  = isEV ? '#F10F59' : '#C8F046'
  const accentBg     = isEV ? 'rgba(241,15,89,0.15)'  : 'rgba(200,240,70,0.15)'
  const accentText   = isEV ? '#F10F59'                : '#C8F046'
  const accentBorder = isEV ? 'rgba(241,15,89,0.3)'   : 'rgba(200,240,70,0.3)'
  const label        = isEV ? '🎤 Eurovision 2026'    : '⚽ World Cup 2026'

  // ── Tournament badge ──────────────────────────────────────────────────────
  function Badge() {
    return (
      <div
        className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-3"
        style={{ background: accentBg, color: accentText, border: `1px solid ${accentBorder}` }}
      >
        {label}
      </div>
    )
  }

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="w-full">
        <div
          className="rounded-2xl p-6 text-center space-y-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Badge />
          <div className="text-4xl">{isEV ? '🎤' : '🎲'}</div>
          <p className="font-heading font-bold text-white text-base tracking-tight">Ready to draw</p>
          <p className="text-white/40 text-xs">{entries.length} participants · {entries.length} {isEV ? 'countries' : 'teams'}</p>
          <div className="w-full bg-white/10 rounded-full h-0.5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background: accentColor,
                animation: `progress-fill ${IDLE_HOLD}ms linear both`,
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── Drawing ────────────────────────────────────────────────────────────────
  if (phase === 'drawing') {
    return (
      <div className="w-full space-y-2">
        <Badge />
        {current && (
          <div
            key={currentIdx}
            className="bg-white rounded-2xl p-4 text-center"
            style={{
              border: `2px solid ${accentColor}`,
              boxShadow: `0 0 24px ${accentColor}30`,
              animation: 'hero-reveal 0.25s ease both',
            }}
          >
            <p className="text-[10px] text-mid mb-1.5 tabular-nums">
              {currentIdx + 1} <span className="text-[#D1D9D5]">/</span> {entries.length}
            </p>
            <div className="text-4xl mb-1 leading-none select-none">{current.flag}</div>
            <p className="font-heading text-base font-bold text-pitch leading-tight">{current.team}</p>
            <div className="my-2 flex items-center gap-2">
              <span className="flex-1 h-px bg-[#E5EDEA]" />
              <span className="text-[9px] uppercase tracking-widest text-mid">drawn by</span>
              <span className="flex-1 h-px bg-[#E5EDEA]" />
            </div>
            <p className="font-heading text-xs font-bold text-grass">{current.name}</p>
          </div>
        )}
        {shown.length > 0 && (
          <div className="max-h-40 overflow-hidden rounded-xl">
            <div className="grid grid-cols-2 gap-1">
              {[...shown].reverse().slice(0, 6).map((entry, i) => (
                <div
                  key={i}
                  className="rounded-lg px-2.5 py-1.5 flex items-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', animation: 'card-in 0.15s ease both' }}
                >
                  <span className="text-sm leading-none shrink-0">{entry.flag}</span>
                  <div className="min-w-0">
                    <p className="text-white text-[10px] font-medium leading-tight truncate">{entry.name}</p>
                    <p className="text-white/40 text-[10px] leading-tight truncate">{entry.team}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Done: all drawn ────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <Badge />
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: accentBg, color: accentText }}
        >
          Draw complete 🎉
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1 max-h-[260px] overflow-y-auto rounded-xl">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="rounded-lg px-2.5 py-1.5 flex items-center gap-2"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              animation: `card-in 0.15s ${Math.min(i * 30, 300)}ms ease both`,
            }}
          >
            <span className="text-sm leading-none shrink-0">{entry.flag}</span>
            <div className="min-w-0">
              <p className="text-white text-[10px] font-medium leading-tight truncate">{entry.name}</p>
              <p className="text-white/40 text-[10px] leading-tight truncate">{entry.team}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
