'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// World Cup 2026 kick-off: 11 June 2026, 19:00 UTC
const WC_KICKOFF = new Date('2026-06-11T19:00:00Z')

function getTimeLeft() {
  const diff = WC_KICKOFF.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

export function CountdownBanner() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { label: 'd', value: time?.days ?? null },
    { label: 'h', value: time?.hours ?? null },
    { label: 'm', value: time?.minutes ?? null },
    { label: 's', value: time?.seconds ?? null },
  ]

  if (time === null && typeof window !== 'undefined') return null

  return (
    <div
      className="w-full py-2.5 px-4"
      style={{ background: '#C8F046', color: '#0B3D2E' }}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm font-medium leading-tight">
        <span className="font-semibold">World Cup 2026 kicks off in</span>

        <div className="flex items-center gap-1" suppressHydrationWarning>
          {units.map(u => (
            <span
              key={u.label}
              className="inline-flex items-baseline gap-0.5 px-2 py-0.5 rounded-full tabular-nums font-bold text-[13px]"
              style={{ background: 'rgba(11,61,46,0.13)' }}
              suppressHydrationWarning
            >
              {u.value !== null ? String(u.value).padStart(2, '0') : '--'}
              <span className="text-[11px] font-normal opacity-60">{u.label}</span>
            </span>
          ))}
        </div>

        <span>—</span>

        <Link
          href="#reserve"
          className="font-bold underline underline-offset-2 hover:opacity-70 transition-opacity whitespace-nowrap"
          style={{ color: '#0B3D2E' }}
        >
          reserve your free sweepstake now
        </Link>
      </div>
    </div>
  )
}
