'use client'

import { useEffect, useState, useRef } from 'react'

// All 48 participants from the demo sweepstake — real data, no DB hit needed
const DEMO_DRAW = [
  { name: 'Jake Murray',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'England'       },
  { name: 'Kim Shaw',          flag: '🇦🇷', team: 'Argentina'     },
  { name: 'Callum M.',         flag: '🇧🇷', team: 'Brazil'        },
  { name: 'Matthew Griffiths', flag: '🇫🇷', team: 'France'        },
  { name: 'Elaine Burton',     flag: '🇪🇸', team: 'Spain'         },
  { name: 'Daniel K.',         flag: '🇩🇪', team: 'Germany'       },
  { name: 'Mike D.',           flag: '🇵🇹', team: 'Portugal'      },
  { name: 'Steve J.',          flag: '🇳🇱', team: 'Netherlands'   },
  { name: 'Tom S.',            flag: '🇧🇪', team: 'Belgium'       },
  { name: 'Nicky Evans',       flag: '🇺🇾', team: 'Uruguay'       },
  { name: 'Willow B.',         flag: '🇺🇸', team: 'USA'           },
  { name: 'Megan Clarke',      flag: '🇲🇽', team: 'Mexico'        },
  { name: 'Amanda P.',         flag: '🇨🇦', team: 'Canada'        },
  { name: 'Lee C.',            flag: '🇲🇦', team: 'Morocco'       },
  { name: 'Darcy Thompson',    flag: '🇯🇵', team: 'Japan'         },
  { name: 'Harry F.',          flag: '🇰🇷', team: 'South Korea'   },
  { name: 'Paul Y.',           flag: '🇦🇺', team: 'Australia'     },
  { name: 'Oliver Richards',   flag: '🇸🇳', team: 'Senegal'       },
  { name: 'Leanne Fox',        flag: '🇨🇭', team: 'Switzerland'   },
  { name: 'Leo Simmons',       flag: '🇭🇷', team: 'Croatia'       },
  { name: 'Amanda Fletcher',   flag: '🇩🇰', team: 'Denmark'       },
  { name: 'Charlotte Webb',    flag: '🇵🇱', team: 'Poland'        },
  { name: 'Jamie Brooks',      flag: '🇷🇸', team: 'Serbia'        },
  { name: 'Nick Cooper',       flag: '🇨🇴', team: 'Colombia'      },
  { name: 'Richard Palmer',    flag: '🇪🇨', team: 'Ecuador'       },
  { name: 'Debbie Price',      flag: '🇵🇪', team: 'Peru'          },
  { name: 'Lucy R.',           flag: '🇨🇱', team: 'Chile'         },
  { name: 'John R.',           flag: '🇮🇷', team: 'Iran'          },
  { name: 'Luke B.',           flag: '🇸🇦', team: 'Saudi Arabia'  },
  { name: 'Sarah Allen',       flag: '🇶🇦', team: 'Qatar'         },
  { name: 'Jordan H.',         flag: '🇨🇲', team: 'Cameroon'      },
  { name: 'Kieran H.',         flag: '🇳🇬', team: 'Nigeria'       },
  { name: 'Chris Scott',       flag: '🇬🇭', team: 'Ghana'         },
  { name: 'Dan M.',            flag: '🇪🇬', team: 'Egypt'         },
  { name: 'Eddie O\'Brien',    flag: '🇹🇳', team: 'Tunisia'       },
  { name: 'Mick N.',           flag: '🇩🇿', team: 'Algeria'       },
  { name: 'Louie Ward',        flag: '🇹🇷', team: 'Turkey'        },
  { name: 'Katie Davies',      flag: '🇺🇦', team: 'Ukraine'       },
  { name: 'Emma Lawson',       flag: '🇭🇺', team: 'Hungary'       },
  { name: 'Simon G.',          flag: '🇦🇹', team: 'Austria'       },
  { name: 'Robert B.',         flag: '🇷🇴', team: 'Romania'       },
  { name: 'Joe W.',            flag: '🇨🇿', team: 'Czech Republic'},
  { name: 'Kevin L.',          flag: '🇸🇰', team: 'Slovakia'      },
  { name: 'Ellen Walsh',       flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', team: 'Wales'         },
  { name: 'Ashley Cole',       flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', team: 'Scotland'      },
  { name: 'Victoria Stone',    flag: '🇳🇿', team: 'New Zealand'   },
  { name: 'Rachel G.',         flag: '🇨🇷', team: 'Costa Rica'    },
  { name: 'Ralph J.',          flag: '🇵🇦', team: 'Panama'        },
]

type Phase = 'idle' | 'drawing' | 'grid'

const DRAW_INTERVAL = 480  // ms per reveal
const GRID_HOLD    = 5000  // ms to hold the full results grid
const IDLE_HOLD    = 1400  // ms on "ready to draw" screen

export function HeroDrawAnimation() {
  const [phase, setPhase]           = useState<Phase>('idle')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [shown, setShown]           = useState<typeof DEMO_DRAW>([])
  const gridRef = useRef<HTMLDivElement>(null)

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
      if (currentIdx < DEMO_DRAW.length) {
        timer = setTimeout(() => {
          setShown(prev => [...prev, DEMO_DRAW[currentIdx]])
          setCurrentIdx(i => i + 1)
        }, DRAW_INTERVAL)
      } else {
        timer = setTimeout(() => setPhase('grid'), 400)
      }
    }

    if (phase === 'grid') {
      timer = setTimeout(() => setPhase('idle'), GRID_HOLD)
    }

    return () => clearTimeout(timer)
  }, [phase, currentIdx])

  const current = phase === 'drawing' && currentIdx < DEMO_DRAW.length
    ? DEMO_DRAW[currentIdx]
    : null

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="w-full">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-4">
          <div className="text-5xl" style={{ animation: 'draw-spin 0.5s ease both' }}>🎲</div>
          <p className="font-heading font-bold text-white text-lg tracking-tight">Ready to draw</p>
          <p className="text-white/40 text-xs">{DEMO_DRAW.length} participants · 48 teams</p>
          <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
            <div
              className="bg-lime h-full rounded-full"
              style={{ animation: `progress-fill ${IDLE_HOLD}ms linear both` }}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── Drawing ────────────────────────────────────────────────────────────────
  if (phase === 'drawing') {
    return (
      <div className="w-full space-y-3">
        {/* Big reveal card */}
        {current && (
          <div
            key={currentIdx}
            className="bg-white rounded-2xl border-2 border-lime shadow-xl shadow-black/20 p-5 text-center md:max-w-xs md:mx-auto"
            style={{ animation: 'hero-reveal 0.3s ease both' }}
          >
            <p className="text-xs text-mid mb-2 tabular-nums">
              {currentIdx + 1} <span className="text-[#D1D9D5]">/</span> {DEMO_DRAW.length}
            </p>
            <div className="text-5xl mb-1.5 leading-none select-none">{current.flag}</div>
            <p className="font-heading text-lg font-bold text-pitch leading-tight">{current.team}</p>
            <div className="my-2.5 flex items-center gap-2">
              <span className="flex-1 h-px bg-[#E5EDEA]" />
              <span className="text-[10px] uppercase tracking-widest text-mid">drawn by</span>
              <span className="flex-1 h-px bg-[#E5EDEA]" />
            </div>
            <p className="font-heading text-sm font-bold text-grass">{current.name}</p>
          </div>
        )}

        {/* Scrollable mini grid of already-drawn */}
        {shown.length > 0 && (
          <div className="max-h-52 overflow-y-auto rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {shown.map((entry, i) => (
                <div
                  key={i}
                  className="bg-white/8 border border-white/10 rounded-lg px-2.5 py-1.5 flex items-center gap-2"
                  style={{ animation: 'card-in 0.2s ease both' }}
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

  // ── Grid: all drawn ────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-3" ref={gridRef}>
      <div className="flex items-center justify-between">
        <p className="font-heading font-bold text-white text-sm tracking-tight">Draw complete 🎉</p>
        <span className="text-xs bg-lime/20 text-lime px-2.5 py-1 rounded-full font-medium">
          {DEMO_DRAW.length} teams drawn
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 max-h-[420px] overflow-y-auto rounded-xl">
        {DEMO_DRAW.map((entry, i) => (
          <div
            key={i}
            className="bg-white/8 border border-white/10 rounded-lg px-2.5 py-1.5 flex items-center gap-2"
            style={{ animation: `card-in 0.2s ${Math.min(i * 25, 400)}ms ease both` }}
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
