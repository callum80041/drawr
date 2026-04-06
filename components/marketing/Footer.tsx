import Link from 'next/link'
import { Wordmark } from '@/components/brand/Wordmark'

export function MarketingFooter() {
  return (
    <footer className="bg-pitch border-t border-white/10 px-6 md:px-12 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <Wordmark size="sm" variant="light" />

        <ul className="flex flex-wrap gap-6 list-none">
          <li><Link href="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">Privacy policy</Link></li>
          <li><Link href="/terms" className="text-sm text-white/50 hover:text-white transition-colors">Terms of service</Link></li>
          <li><Link href="/contact" className="text-sm text-white/50 hover:text-white transition-colors">Contact</Link></li>
        </ul>

        <p className="text-sm text-white/30">© 2026 playdrawr. All rights reserved.</p>
      </div>
    </footer>
  )
}
