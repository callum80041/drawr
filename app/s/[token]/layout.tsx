import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Wordmark } from '@/components/brand/Wordmark'
import { PublicTabs } from '@/components/participant/PublicTabs'
import { DemoBar } from '@/components/participant/DemoBar'

const DEMO_TOKENS = new Set(['demo2026', 'demoeurovision'])
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
    .select('id, name, status, tournament_name, share_token, image_url, sweepstake_type')
    .eq('share_token', token)
    .single()

  if (!sweepstake) notFound()

  const isDemo = DEMO_TOKENS.has(sweepstake.share_token)
  const isEurovision = sweepstake.sweepstake_type === 'eurovision'

  // Eurovision brand colours
  const BG      = isEurovision ? '#040241' : undefined
  const PINK    = '#F10F59'
  const PURPLE  = '#5A22A9'

  return (
    <div className="min-h-screen flex flex-col" style={isEurovision ? { background: '#F0EFF8' } : { background: undefined }} >
      {isDemo && <DemoBar token={token} />}

      {/* Cover photo banner (World Cup only) */}
      {!isEurovision && sweepstake.image_url && (
        <div className="w-full h-40 md:h-56 overflow-hidden">
          <img
            src={sweepstake.image_url}
            alt={`${sweepstake.name} cover`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <header
        className="px-4 md:px-8 pt-5 pb-0 relative overflow-hidden"
        style={isEurovision ? { background: BG } : { background: undefined }}
      >
        {/* Eurovision: decorative glows */}
        {isEurovision && (
          <>
            <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 55% 100% at 85% 50%, rgba(90,34,169,0.4) 0%, transparent 70%)` }} />
            <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 35% 80% at 15% 50%, rgba(241,15,89,0.15) 0%, transparent 70%)` }} />
          </>
        )}

        {!isEurovision && <div className="bg-pitch absolute inset-0 -z-10" />}

        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Wordmark size="sm" variant="light" />
            </Link>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={isEurovision
                ? sweepstake.status === 'active'
                  ? { background: 'rgba(241,15,89,0.2)', color: PINK }
                  : sweepstake.status === 'complete'
                  ? { background: 'rgba(255,215,0,0.2)', color: '#FFD700' }
                  : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
                : sweepstake.status === 'active'
                ? { background: 'rgba(200,240,77,0.2)', color: '#C8F04D' }
                : sweepstake.status === 'complete'
                ? { background: 'rgba(255,215,0,0.2)', color: '#FFD700' }
                : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
              }
            >
              {sweepstake.status}
            </span>
          </div>

          {/* Eurovision: logo above title */}
          {isEurovision && (
            <div className="mb-3">
              <img src="/eurovision-logo-white.svg" alt="Eurovision Song Contest" style={{ height: 36, width: 'auto' }} />
            </div>
          )}

          <h1 className="font-heading text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
            {sweepstake.name}
          </h1>

          <PublicTabs token={token} sweepstakeType={sweepstake.sweepstake_type ?? 'worldcup'} />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-8 py-6">
        {children}
      </main>

      <footer
        className="text-center py-6 px-4 space-y-1.5"
        style={isEurovision ? { background: '#040241', borderTop: '1px solid rgba(255,255,255,0.08)' } : undefined}
      >
        <p className="text-xs" style={isEurovision ? { color: 'rgba(255,255,255,0.4)' } : { color: undefined }} >
          Powered by{' '}
          <Link href="/" className="font-medium hover:underline" style={isEurovision ? { color: '#F10F59' } : { color: undefined }}>playdrawr</Link>
        </p>
        <p className="text-xs" style={isEurovision ? { color: 'rgba(255,255,255,0.25)' } : { color: undefined }}>
          Sweepstake tool for entertainment purposes only. No gambling services provided.
        </p>
        <p className="text-xs" style={isEurovision ? { color: 'rgba(255,255,255,0.25)' } : { color: undefined }}>
          18+ only. Please gamble responsibly.{' '}
          <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="underline">
            BeGambleAware.org
          </a>
        </p>
      </footer>
    </div>
  )
}
