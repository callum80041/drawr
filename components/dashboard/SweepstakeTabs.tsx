'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  id: string
  sweepstakeType?: string
}

export function SweepstakeTabs({ id, sweepstakeType = 'worldcup' }: Props) {
  const pathname = usePathname()
  const base = `/dashboard/${id}`
  const isEurovision = sweepstakeType === 'eurovision'

  const tabs = [
    { href: base,                     label: 'Overview',     exact: true },
    { href: `${base}/participants`,   label: 'Participants', exact: false },
    { href: `${base}/draw`,           label: 'Draw',         exact: false },
    ...(isEurovision ? [{ href: `${base}/results`, label: 'Results', exact: false }] : []),
    { href: `${base}/settings`,       label: 'Settings',     exact: false },
  ]

  function isActive(tab: typeof tabs[0]) {
    return tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
  }

  return (
    <div className="flex gap-1 -mb-px">
      {tabs.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            isActive(tab)
              ? 'border-grass text-pitch'
              : 'border-transparent text-mid hover:text-pitch'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
