'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Wordmark } from '@/components/brand/Wordmark'

interface SidebarProps {
  organiserName: string
  userEmail: string
}

const navItems = [
  {
    href: '/dashboard',
    label: 'My sweepstakes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    exact: true,
  },
  {
    href: '/dashboard/new',
    label: 'New sweepstake',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
        <line x1="9" y1="5" x2="9" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    exact: false,
  },
]

export function Sidebar({ organiserName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isActive(item: typeof navItems[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <aside className="hidden md:flex flex-col w-60 bg-pitch min-h-screen shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <Link href="/dashboard">
          <Wordmark size="sm" variant="light" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(item)
                ? 'bg-grass text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className={isActive(item) ? 'text-lime' : 'text-white/50'}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium text-white truncate">{organiserName}</p>
          <p className="text-xs text-white/50 truncate">{userEmail}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M7 3H3a1 1 0 00-1 1v10a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="15" y1="9" x2="7" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  )
}
