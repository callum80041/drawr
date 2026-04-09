'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function PublicTabs({ token }: { token: string }) {
  const pathname = usePathname()
  const base = `/s/${token}`

  const tabs = [
    { href: base,                  label: 'Leaderboard', exact: true },
    { href: `${base}/fixtures`,    label: 'Fixtures',    exact: false },
    { href: `${base}/groups`,      label: 'Groups',      exact: false },
    { href: `${base}/bracket`,     label: 'Bracket',     exact: false },
    { href: `${base}/predict`,     label: 'Predict 🏆',  exact: false },
  ]

  return (
    <div className="flex gap-1 overflow-x-auto -mb-px">
      {tabs.map(tab => {
        const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              active
                ? 'border-lime text-white'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
