import Link from 'next/link'
import { Wordmark } from '@/components/brand/Wordmark'

export function MarketingFooter() {
  return (
    <footer className="bg-pitch border-t border-white/10 px-6 md:px-12 py-10">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Wordmark size="sm" variant="light" />

          <ul className="flex flex-wrap gap-x-6 gap-y-2 list-none">
            <li><Link href="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="text-sm text-white/50 hover:text-white transition-colors">Terms</Link></li>
            <li><Link href="/contact" className="text-sm text-white/50 hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/responsible-gambling" className="text-sm text-white/50 hover:text-white transition-colors">Responsible Gambling</Link></li>
            <li><Link href="/affiliate-disclosure" className="text-sm text-white/50 hover:text-white transition-colors">Affiliate Disclosure</Link></li>
          </ul>
        </div>

        {/* Compliance bar */}
        <div className="border-t border-white/10 pt-5 space-y-1.5">
          <p className="text-xs text-white/30 leading-relaxed">
            Playdrawr is a sweepstake tool for entertainment purposes only. No gambling services are provided on this site.
          </p>
          <p className="text-xs text-white/30 leading-relaxed">
            18+ only. Please gamble responsibly.{' '}
            <a
              href="https://www.begambleaware.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/60 transition-colors"
            >
              BeGambleAware.org
            </a>
          </p>
          <p className="text-xs text-white/20 mt-2">© {new Date().getFullYear()} playdrawr</p>
        </div>

      </div>
    </footer>
  )
}
