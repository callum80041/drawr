'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const DEMOS = [
  { token: 'demo2026',      label: '⚽ World Cup',  emoji: '⚽' },
  { token: 'demoeurovision', label: '🎤 Eurovision', emoji: '🎤' },
]

const DEMO_TOKENS = new Set(DEMOS.map(d => d.token))

const DEMO_SUBTITLES: Record<string, string> = {
  'demo2026':       "All scores & standings are completely made up. We ran them through a random number generator with no respect for footballing reputations. 🎲",
  'demoeurovision': "These results are entirely fictional. Croatia did not actually win Eurovision 2026. Probably. 🎤",
}

export function DemoBar({ token }: { token: string }) {
  const pathname = usePathname()
  const isOrganiser = pathname.includes('/organiser')

  const subtitle = DEMO_SUBTITLES[token] ?? "Demo mode — no data is real."

  return (
    <div className="bg-gold/15 border-b border-gold/30 px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        {/* Left: label + subtitle */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-gold uppercase tracking-widest shrink-0">Demo</span>
          <span className="text-xs text-pitch/60 hidden sm:block">{subtitle}</span>
        </div>

        {/* Right: demo switcher + view toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tournament switcher */}
          <div className="flex items-center gap-1 bg-white/60 rounded-lg p-1">
            {DEMOS.map(d => (
              <Link
                key={d.token}
                href={isOrganiser ? `/s/${d.token}/organiser` : `/s/${d.token}`}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  token === d.token
                    ? 'bg-gold text-white shadow-sm'
                    : 'text-pitch/60 hover:text-pitch'
                }`}
              >
                {d.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <span className="w-px h-5 bg-pitch/15 hidden sm:block" />

          {/* Participant / Organiser toggle */}
          <div className="flex items-center gap-1 bg-white/60 rounded-lg p-1">
            <Link
              href={`/s/${token}`}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                !isOrganiser
                  ? 'bg-pitch text-white shadow-sm'
                  : 'text-pitch/60 hover:text-pitch'
              }`}
            >
              👥 Participant
            </Link>
            <Link
              href={`/s/${token}/organiser`}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                isOrganiser
                  ? 'bg-pitch text-white shadow-sm'
                  : 'text-pitch/60 hover:text-pitch'
              }`}
            >
              🗂 Organiser
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
