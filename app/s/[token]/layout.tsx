import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Wordmark } from '@/components/brand/Wordmark'
import { PublicTabs } from '@/components/participant/PublicTabs'
import { DemoBar } from '@/components/participant/DemoBar'

const DEMO_TOKEN = 'demo2026'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

interface Props {
  children: React.ReactNode
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  const supabase = await createClient()
  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('name, tournament_name')
    .eq('share_token', token)
    .single()

  if (!sweepstake) return {}

  const title       = `${sweepstake.name} — playdrawr`
  const description = `Live leaderboard for ${sweepstake.name}. Follow the standings and see who's winning the sweepstake.`
  const ogImage     = `${APP_URL}/api/og/sweepstake?token=${token}`

  return {
    title,
    description,
    other: {
      'google-adsense-account': 'ca-pub-4502089642412261',
    },
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function PublicLayout({ children, params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name, status, tournament_name, share_token')
    .eq('share_token', token)
    .single()

  if (!sweepstake) notFound()

  const isDemo = sweepstake.share_token === DEMO_TOKEN

  return (
    <div className="min-h-screen bg-light flex flex-col">
      {isDemo && <DemoBar token={token} />}
      {/* Header */}
      <header className="bg-pitch px-4 md:px-8 pt-5 pb-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Wordmark size="sm" variant="light" />
            </Link>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              sweepstake.status === 'active'   ? 'bg-lime/20 text-lime' :
              sweepstake.status === 'complete' ? 'bg-gold/20 text-gold' :
              'bg-white/10 text-white/60'
            }`}>
              {sweepstake.status}
            </span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
            {sweepstake.name}
          </h1>
          <PublicTabs token={token} />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-8 py-6">
        {children}
      </main>

      <footer className="text-center py-6 px-4 space-y-1.5">
        <p className="text-xs text-mid">
          Powered by{' '}
          <Link href="/" className="text-grass font-medium hover:underline">playdrawr</Link>
        </p>
        <p className="text-xs text-mid/60">
          Sweepstake tool for entertainment purposes only. No gambling services provided.
        </p>
        <p className="text-xs text-mid/60">
          18+ only. Please gamble responsibly.{' '}
          <a
            href="https://www.begambleaware.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-mid transition-colors"
          >
            BeGambleAware.org
          </a>
        </p>
      </footer>
    </div>
  )
}
