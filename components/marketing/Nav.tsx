'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Wordmark } from '@/components/brand/Wordmark'

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-200 ${
        scrolled
          ? 'bg-pitch/95 backdrop-blur-md border-b border-white/10 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <Link href="/">
        <Wordmark size="sm" variant="light" />
      </Link>

      <ul className="hidden md:flex items-center gap-8 list-none">
        <li>
          <a href="#how" className="text-sm text-white/60 hover:text-white transition-colors">
            How it works
          </a>
        </li>
        <li>
          <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">
            Features
          </a>
        </li>
        <li>
          <a href="#reserve" className="text-sm font-medium text-lime hover:text-lime/80 transition-colors">
            It&apos;s free
          </a>
        </li>
        <li>
          <Link href="/s/demo2026" className="text-sm text-white/60 hover:text-white transition-colors">
            Demo
          </Link>
        </li>
        <li>
          <Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">
            Contact
          </Link>
        </li>
        <li>
          <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
            Sign in
          </Link>
        </li>
        <li>
          <a
            href="#reserve"
            className="text-sm font-medium bg-lime text-pitch px-4 py-2 rounded-lg hover:bg-[#d4f54d] transition-colors"
          >
            Reserve your free sweepstake
          </a>
        </li>
      </ul>

      {/* Mobile: sign in + CTA */}
      <div className="md:hidden flex items-center gap-3">
        <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
          Sign in
        </Link>
        <a
          href="#reserve"
          className="text-sm font-medium bg-lime text-pitch px-4 py-2 rounded-lg hover:bg-[#d4f54d] transition-colors"
        >
          Reserve free
        </a>
      </div>
    </nav>
  )
}
