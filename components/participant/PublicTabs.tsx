'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  token: string
  sweepstakeType?: string
}

export function PublicTabs({ token, sweepstakeType = 'worldcup' }: Props) {
  const pathname = usePathname()
  const base = `/s/${token}`
  const isEurovision = sweepstakeType === 'eurovision'

  const tabs = isEurovision
    ? [
        { href: base,                    label: 'Leaderboard', exact: true },
        { href: `${base}/semi-finals`,   label: 'Semi-Finals', exact: false },
        { href: `${base}/grand-final`,   label: 'Grand Final', exact: false },
      ]
    : [
        { href: base,                label: 'Leaderboard', exact: true },
        { href: `${base}/fixtures`,  label: 'Fixtures',    exact: false },
        { href: `${base}/groups`,    label: 'Groups',      exact: false },
        { href: `${base}/bracket`,   label: 'Bracket',     exact: false },
        { href: `${base}/predict`,   label: 'Predict 🏆',  exact: false },
      ]

  // Eurovision: active tab underline uses pink; World Cup uses lime
  const activeColor = isEurovision ? '#F10F59' : undefined

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
                ? isEurovision
                  ? 'text-white'
                  : 'border-lime text-white'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
            style={active && isEurovision ? { borderBottomColor: '#F10F59', borderBottomWidth: 2, color: '#fff' } : undefined}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
