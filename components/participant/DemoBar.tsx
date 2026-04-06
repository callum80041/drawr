'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DemoBar({ token }: { token: string }) {
  const pathname = usePathname()
  const isOrganiser = pathname.includes('/organiser')

  return (
    <div className="bg-gold/15 border-b border-gold/30 px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-gold uppercase tracking-widest shrink-0">Demo</span>
          <span className="text-xs text-pitch/60 hidden sm:block">All scores &amp; standings are completely made up. We ran them through a random number generator with no respect for footballing reputations. Not our fault if Argentina are bottom of Group D. 🎲</span>
        </div>
        <div className="flex items-center gap-1 bg-white/60 rounded-lg p-1">
          <Link
            href={`/s/${token}`}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
              !isOrganiser
                ? 'bg-pitch text-white shadow-sm'
                : 'text-pitch/60 hover:text-pitch'
            }`}
          >
            👥 Participant view
          </Link>
          <Link
            href={`/s/${token}/organiser`}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
              isOrganiser
                ? 'bg-pitch text-white shadow-sm'
                : 'text-pitch/60 hover:text-pitch'
            }`}
          >
            🗂 Organiser view
          </Link>
        </div>
      </div>
    </div>
  )
}
