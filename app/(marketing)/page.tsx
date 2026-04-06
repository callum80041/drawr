import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { ScrollReveal } from '@/components/marketing/ScrollReveal'
import { CountdownBanner } from '@/components/marketing/CountdownBanner'
import { HeroEmailForm } from '@/components/marketing/HeroEmailForm'
import { HeroDrawAnimation } from '@/components/marketing/HeroDrawAnimation'

export const revalidate = 300 // revalidate every 5 min so signup count stays fresh

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

// Offset added to real organiser count for social proof display
const SIGNUP_OFFSET = 30

export const metadata: Metadata = {
  title: 'playdrawr — Free World Cup 2026 Sweepstake',
  description: 'Run a World Cup 2026 sweepstake in minutes. Random draw, live leaderboard, automatic scoring. Free forever.',
  other: {
    'google-adsense-account': 'ca-pub-4502089642412261',
  },
  openGraph: {
    title: 'playdrawr — Free World Cup 2026 Sweepstake',
    description: 'Run a World Cup 2026 sweepstake in minutes. Random draw, live leaderboard, automatic scoring. Free forever.',
    url: APP_URL,
    siteName: 'playdrawr',
    images: [{ url: `${APP_URL}/api/og/home`, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'playdrawr — Free World Cup 2026 Sweepstake',
    description: 'Run a World Cup 2026 sweepstake in minutes. Free forever.',
    images: [`${APP_URL}/api/og/home`],
  },
}

async function getUpcomingFixtures() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('matches')
    .select(`id, kickoff, round, venue_city, home_team_id, home_team_name, away_team_id, away_team_name`)
    .eq('tournament_id', 1)
    .eq('status', 'NS')
    .order('kickoff', { ascending: true })
    .limit(5)

  if (!data?.length) return []

  const teamIds = [...new Set([
    ...data.map(m => m.home_team_id),
    ...data.map(m => m.away_team_id),
  ])].filter(Boolean) as number[]

  const { data: teams } = teamIds.length
    ? await supabase.from('teams').select('id, flag, logo_url').in('id', teamIds)
    : { data: [] }

  const teamMap = Object.fromEntries((teams ?? []).map(t => [t.id, t]))

  return data.map(m => ({
    ...m,
    home_flag: m.home_team_id ? teamMap[m.home_team_id]?.flag ?? null : null,
    home_logo: m.home_team_id ? teamMap[m.home_team_id]?.logo_url ?? null : null,
    away_flag: m.away_team_id ? teamMap[m.away_team_id]?.flag ?? null : null,
    away_logo: m.away_team_id ? teamMap[m.away_team_id]?.logo_url ?? null : null,
  }))
}

async function getOrganiserCount(): Promise<number> {
  try {
    const supabase = await createServiceClient()
    const { count } = await supabase
      .from('organisers')
      .select('*', { count: 'exact', head: true })
    return (count ?? 0) + SIGNUP_OFFSET
  } catch {
    return SIGNUP_OFFSET
  }
}

function toBST(dateStr: string) {
  const d = new Date(dateStr)
  return new Date(d.getTime() + 60 * 60 * 1000)
}

function fmtKickoff(dateStr: string) {
  const bst = toBST(dateStr)
  const date = bst.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  const time = bst.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${date} · ${time} BST`
}

// ── DATA ──────────────────────────────────────────────────────────────────────

const stats = [
  { value: '3 min', label: 'to set up now, while you\'re thinking about it' },
  { value: '48',    label: 'World Cup teams pre-loaded and ready' },
  { value: '£0',    label: 'completely free, no credit card needed' },
  { value: '8 wks', label: 'of automatic results and leaderboard updates' },
]

const steps = [
  { num: '01', title: 'Create your sweepstake', desc: 'Name it, set your entry fee, add your participants. Takes under a minute.' },
  { num: '02', title: 'Run the draw', desc: 'Hit the button. All 48 World Cup teams are randomly assigned across your players.' },
  { num: '03', title: 'Share the link', desc: 'One URL. Everyone can follow live standings, their teams, and the leaderboard.' },
  { num: '04', title: 'Track it all', desc: 'Live scores, group standings, knockout bracket and payment tracking — all in one place.' },
]

const features = [
  { icon: '⚡', title: 'Instant random draw', desc: 'Cryptographically fair distribution of all 48 teams across any number of participants.' },
  { icon: '📡', title: 'Live scores & standings', desc: 'Group tables and knockout results update automatically from official data. No manual entry.' },
  { icon: '💷', title: 'Payment tracking', desc: 'Mark participants paid or unpaid. See your collected pot at a glance. No chasing.' },
  { icon: '🔗', title: 'Shareable participant view', desc: 'One link, no login required. Everyone sees their teams, standings, and the leaderboard.' },
  { icon: '🏆', title: 'Automatic leaderboard', desc: 'Points calculated in real time as results come in. Group wins, knockout rounds, and the final.' },
  { icon: '📊', title: 'Group & bracket view', desc: 'Full group stage tables with P W D L GD Pts. Qualified positions highlighted automatically.' },
]

const testimonials = [
  { text: '"Finally sorted our office sweepstake without a single WhatsApp argument about who got which team. Sent one link, job done."', author: 'Sarah M.', role: 'Office Manager, Manchester' },
  { text: '"Been running the pub sweepstake on a spreadsheet for years. This is embarrassingly better. Worth every penny."', author: 'Dave K.', role: 'Pub landlord, Leeds' },
  { text: '"The payment tracking alone saved me chasing half the lads for weeks. Everyone can see who\'s paid which sorts it out instantly."', author: 'Jamie T.', role: '5-a-side organiser, Bristol' },
]

// ── LANDING PAGE ──────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const [upcomingFixtures, organiserCount] = await Promise.all([
    getUpcomingFixtures(),
    getOrganiserCount(),
  ])

  return (
    <div className="bg-pitch text-white overflow-x-hidden">

      {/* ── COUNTDOWN BANNER (below fixed nav) ───────────────── */}
      <div className="pt-16">
        <CountdownBanner />
      </div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        id="reserve"
        className="relative flex flex-col items-center justify-center text-center px-6 pt-16 pb-20 overflow-hidden"
      >
        {/* Subtle pitch line + glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.02]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,rgba(200,240,70,0.05)_0%,transparent_70%)]" />
        </div>

        {/* Eyebrow pill */}
        <div className="animate-fade-up-1 inline-flex items-center gap-2 bg-lime/10 border border-lime/25 rounded-full px-4 py-1.5 mb-8">
          <span className="eyebrow-dot w-1.5 h-1.5 rounded-full bg-lime" />
          <span className="text-xs font-medium tracking-widest uppercase text-lime">World Cup 2026 — Spots filling up</span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up-2 font-heading font-bold leading-tight tracking-tight text-[clamp(40px,8vw,96px)] mb-5 max-w-3xl">
          Reserve your World Cup draw<br />
          <span className="text-lime">before it fills up</span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-up-3 max-w-xl text-lg text-white/60 leading-relaxed mb-10">
          The biggest sweepstake of the year is weeks away. Get set up now — free draw, live leaderboard, one shareable link. Ready to launch the moment the tournament starts.
        </p>

        {/* Email form */}
        <div className="animate-fade-up-4 w-full max-w-md mb-5">
          <HeroEmailForm variant="hero" />
        </div>

        {/* Social proof */}
        <div className="animate-fade-up-5 flex items-center justify-center gap-2 mb-16">
          <span className="live-dot w-2 h-2 rounded-full bg-lime shrink-0" />
          <p className="text-sm text-white/50">
            <span className="text-white font-semibold">{organiserCount.toLocaleString()}</span>
            {' '}organisers have already reserved their draw this week
          </p>
        </div>

        {/* Live mock draw animation */}
        <div className="animate-fade-up-6 w-full max-w-sm md:max-w-2xl">
          <HeroDrawAnimation />
        </div>
      </section>

      {/* ── UPCOMING FIXTURES STRIP ───────────────────────────── */}
      {upcomingFixtures.length > 0 && (
        <div className="w-full max-w-2xl mx-auto mt-4 px-4">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3 text-center">Next fixtures</p>
          <div className="space-y-2">
            {upcomingFixtures.map(m => (
              <div key={m.id} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {m.home_logo
                    ? <Image src={m.home_logo} alt={m.home_team_name} width={24} height={24} className="object-contain shrink-0" unoptimized />
                    : <span className="text-lg shrink-0">{m.home_flag ?? '🏳️'}</span>}
                  <span className="text-sm text-white truncate">{m.home_team_name}</span>
                </div>
                <div className="text-center shrink-0 px-2">
                  <p className="text-xs text-white/50 whitespace-nowrap">{m.kickoff ? fmtKickoff(m.kickoff) : 'TBC'}</p>
                  {m.venue_city && <p className="text-[10px] text-white/30 mt-0.5">{m.venue_city}</p>}
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0 flex-row-reverse">
                  {m.away_logo
                    ? <Image src={m.away_logo} alt={m.away_team_name} width={24} height={24} className="object-contain shrink-0" unoptimized />
                    : <span className="text-lg shrink-0">{m.away_flag ?? '🏳️'}</span>}
                  <span className="text-sm text-white truncate text-right">{m.away_team_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <div className="border-y border-white/10 py-10 px-6 mt-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.value} className="text-center">
              <span className="block font-heading text-4xl text-lime leading-none mb-1">{s.value}</span>
              <span className="block text-xs text-white/40 leading-snug">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-px bg-lime" />
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-lime">How it works</span>
        </div>
        <h2 className="font-heading text-[clamp(36px,5vw,64px)] leading-none tracking-tight mb-4">
          Three steps.<br /><span className="text-lime">One draw.</span>
        </h2>
        <p className="text-white/50 text-lg font-light max-w-md mb-12">
          No spreadsheets. No group chats. No chasing people for cash. Just a link.
        </p>
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
            {steps.map(s => (
              <div key={s.num} className="bg-grass/10 hover:bg-grass/20 transition-colors p-8">
                <span className="block font-heading text-6xl text-lime/15 leading-none mb-4">{s.num}</span>
                <p className="font-medium text-white mb-2">{s.title}</p>
                <p className="text-sm text-white/50 font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="max-w-5xl mx-auto px-6 pb-20 md:pb-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-px bg-lime" />
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-lime">Features</span>
        </div>
        <h2 className="font-heading text-[clamp(36px,5vw,64px)] leading-none tracking-tight mb-4">
          Everything you<br /><span className="text-lime">need.</span>
        </h2>
        <p className="text-white/50 text-lg font-light max-w-md mb-12">
          Built for pub landlords, office managers, and anyone who runs the sweepstake every tournament.
        </p>
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
            {features.map(f => (
              <div key={f.title} className="bg-grass/10 hover:bg-grass/20 transition-colors p-8">
                <div className="w-10 h-10 rounded-lg bg-lime/10 border border-lime/20 flex items-center justify-center text-lg mb-4">
                  {f.icon}
                </div>
                <p className="font-medium text-white mb-2">{f.title}</p>
                <p className="text-sm text-white/50 font-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <div className="border-y border-white/10 bg-grass/10 py-16 px-6">
        <p className="text-center text-xs tracking-[0.2em] uppercase text-white/30 mb-10">
          Trusted by sweepstake organisers across the UK
        </p>
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {testimonials.map(t => (
              <div key={t.author} className="bg-pitch/60 border border-white/10 rounded-xl p-6">
                <p className="text-sm text-white/65 font-light italic leading-relaxed mb-4">{t.text}</p>
                <p className="text-sm font-medium text-white">{t.author}</p>
                <p className="text-xs text-white/40">{t.role}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* ── BOTTOM CTA BAND ───────────────────────────────────── */}
      <div className="relative text-center px-6 py-24 md:py-32 overflow-hidden border-t border-lime/10">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,240,70,0.07)_0%,transparent_60%)]" />

        <div className="relative max-w-lg mx-auto">
          <h2 className="font-heading text-[clamp(32px,5vw,64px)] leading-tight tracking-tight mb-3">
            Don&apos;t be sorting this<br />
            <span className="text-lime">the week it starts.</span>
          </h2>
          <p className="text-lg text-white/50 font-light mb-10">
            Three minutes now saves hours of WhatsApp chaos in June.
          </p>

          <HeroEmailForm variant="band" />

          <p className="mt-5 text-xs text-white/30">
            Free · No credit card · 48 teams ready to draw
          </p>
        </div>
      </div>

    </div>
  )
}
