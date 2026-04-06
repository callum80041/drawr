'use client'

import { useEffect, useState } from 'react'

// FIFA World Cup 2026 opening match: 11 June 2026, 23:00 UTC
const WC_START = new Date('2026-06-11T23:00:00Z')

function getTimeLeft() {
  const diff = WC_START.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

const UNITS = ['Days', 'Hours', 'Minutes', 'Seconds'] as const

export function Countdown() {
  // Start null so server renders skeleton — avoids hydration mismatch
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const values = time
    ? [time.days, time.hours, time.minutes, time.seconds]
    : [null, null, null, null]

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      {UNITS.map((label, i) => (
        <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-w-[72px] text-center">
          <span className="block font-heading text-3xl md:text-4xl text-lime leading-none tabular-nums" suppressHydrationWarning>
            {values[i] !== null ? String(values[i]).padStart(2, '0') : '--'}
          </span>
          <span className="block text-[10px] uppercase tracking-widest text-white/40 mt-1">{label}</span>
        </div>
      ))}
    </div>
  )
}
