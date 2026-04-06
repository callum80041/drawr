import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ScrollReveal } from '@/components/marketing/ScrollReveal'
import { Countdown } from '@/components/marketing/Countdown'

export const revalidate = 3600 // ISR — revalidate fixtures strip hourly

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export const metadata: Metadata = {
  title: 'playdrawr — Free World Cup 2026 Sweepstake',
  description: 'Run a World Cup 2026 sweepstake in minutes. Random draw, live leaderboard, automatic scoring. Free forever.',
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
    .select(`
      id, kickoff, round, venue_city,
      home_team_id, home_team_name,
      away_team_id, away_team_name
    `)
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

// ── DATA ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: '48', label: 'Nations' },
  { value: '104', label: 'Matches' },
  { value: '30s', label: 'To set up' },
  { value: '£0', label: 'To start' },
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

const FREE_FEATURES = [
  'Up to 48 participants — covers any office, pub or family draw',
  'Full animated draw with team reveal',
  'Shareable link — participants see their team instantly',
  'Payment tracking — know exactly who\'s paid',
  'Full fixture list with kick-off times (BST)',
  'Group standings & knockout bracket',
  'Leaderboard updated after every match',
  'No account needed for participants',
]

const testimonials = [
  { text: '"Finally sorted our office sweepstake without a single WhatsApp argument about who got which team. Sent one link, job done."', author: 'Sarah M.', role: 'Office Manager, Manchester' },
  { text: '"Been running the pub sweepstake on a spreadsheet for years. This is embarrassingly better. Worth every penny."', author: 'Dave K.', role: 'Pub landlord, Leeds' },
  { text: '"The payment tracking alone saved me chasing half the lads for weeks. Everyone can see who\'s paid which sorts it out instantly."', author: 'Jamie T.', role: '5-a-side organiser, Bristol' },
]

// ── LANDING PAGE ─────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const upcomingFixtures = await getUpcomingFixtures()
  return (
    <div className="bg-pitch text-white overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden">

        {/* Subtle pitch line + glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.02]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,rgba(200,240,70,0.05)_0%,transparent_70%)]" />
        </div>

        {/* Eyebrow pill */}
        <div className="animate-fade-up-1 inline-flex items-center gap-2 bg-lime/10 border border-lime/25 rounded-full px-4 py-1.5 mb-8">
          <span className="eyebrow-dot w-1.5 h-1.5 rounded-full bg-lime" />
          <span className="text-xs font-medium tracking-widest uppercase text-lime">World Cup 2026 — Ready</span>
        </div>

        {/* Title */}
        <h1 className="animate-fade-up-2 font-heading font-bold leading-none tracking-tight text-[clamp(72px,13vw,160px)] mb-3">
          play<span className="text-lime">drawr</span>
        </h1>
        <p className="animate-fade-up-3 font-heading text-[clamp(14px,2.5vw,26px)] tracking-[0.2em] text-white/40 uppercase mb-8">
          Football Sweepstakes, Reinvented
        </p>
        <p className="animate-fade-up-4 max-w-lg text-lg text-white/60 leading-relaxed mb-10">
          Run your World Cup sweepstake in minutes. Random draws, live standings, payment tracking — shared with a single link.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up-5 flex flex-wrap gap-3 justify-center mb-16">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-lime text-pitch font-medium px-7 py-3.5 rounded-xl hover:bg-[#d4f54d] transition-colors text-[15px]"
          >
            Create your draw
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <Link
            href="/s/demo2026"
            className="inline-flex items-center gap-2 bg-transparent text-white font-normal px-7 py-3.5 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors text-[15px]"
          >
            See the demo
          </Link>
        </div>

        {/* Orb animation */}
        <div className="animate-fade-up-6 relative w-64 h-64 md:w-80 md:h-80">
          {/* Rings */}
          <div className="orb-ring-1 absolute inset-0 rounded-full border border-lime/15" />
          <div className="orb-ring-2 absolute inset-5 rounded-full border border-lime/10" />
          <div className="orb-ring-3 absolute inset-11 rounded-full border border-lime/[0.06]" />

          {/* Orbiting balls */}
          {[
            { label: 'ENG', cls: 'orb-ball-1', bg: 'bg-lime text-pitch' },
            { label: 'BRA', cls: 'orb-ball-2', bg: 'bg-grass/80 text-white border border-grass' },
            { label: 'ARG', cls: 'orb-ball-3', bg: 'bg-pitch border border-mid/40 text-mid' },
          ].map(b => (
            <div
              key={b.label}
              className={`orb-ball ${b.cls} w-11 h-11 rounded-full flex items-center justify-center font-heading text-xs font-bold ${b.bg}`}
            />
          ))}

          {/* Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-grass/20 border border-lime/20 flex items-center justify-center">
            <span className="font-heading text-lime text-[11px] tracking-widest">DRAW</span>
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ────────────────────────────────────────── */}
      <div className="w-full max-w-2xl mx-auto mt-16 text-center px-4">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-4">
          FIFA World Cup 2026 kicks off in
        </p>
        <Countdown />
      </div>

      {/* ── UPCOMING FIXTURES STRIP ──────────────────────────── */}
      {upcomingFixtures.length > 0 && (
        <div className="w-full max-w-2xl mx-auto mt-12 px-4">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3 text-center">Next fixtures</p>
          <div className="space-y-2">
            {upcomingFixtures.map(m => (
              <div key={m.id} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                {/* Home */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {m.home_logo
                    ? <Image src={m.home_logo} alt={m.home_team_name} width={24} height={24} className="object-contain shrink-0" unoptimized />
                    : <span className="text-lg shrink-0">{m.home_flag ?? '🏳️'}</span>
                  }
                  <span className="text-sm text-white truncate">{m.home_team_name}</span>
                </div>

                {/* Time */}
                <div className="text-center shrink-0 px-2">
                  <p className="text-xs text-white/50 whitespace-nowrap">
                    {m.kickoff ? fmtKickoff(m.kickoff) : 'TBC'}
                  </p>
                  {m.venue_city && (
                    <p className="text-[10px] text-white/30 mt-0.5">{m.venue_city}</p>
                  )}
                </div>

                {/* Away */}
                <div className="flex items-center gap-2 flex-1 min-w-0 flex-row-reverse">
                  {m.away_logo
                    ? <Image src={m.away_logo} alt={m.away_team_name} width={24} height={24} className="object-contain shrink-0" unoptimized />
                    : <span className="text-lg shrink-0">{m.away_flag ?? '🏳️'}</span>
                  }
                  <span className="text-sm text-white truncate text-right">{m.away_team_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <div className="border-y border-white/10 py-8 px-6">
        <div className="max-w-3xl mx-auto flex justify-center flex-wrap gap-10 md:gap-16">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <span className="block font-heading text-4xl text-lime leading-none">{s.value}</span>
              <span className="block text-xs uppercase tracking-widest text-white/40 mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
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

      {/* ── FEATURES ─────────────────────────────────────────── */}
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

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="pricing" className="max-w-3xl mx-auto px-6 pb-20 md:pb-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-px bg-lime" />
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-lime">It&apos;s free</span>
        </div>
        <h2 className="font-heading text-[clamp(36px,5vw,64px)] leading-none tracking-tight mb-4">
          100% free.<br /><span className="text-lime">No strings.</span>
        </h2>
        <p className="text-white/50 text-lg font-light mb-12">
          We&apos;re building a product people love. That starts with giving it away.
        </p>

        <ScrollReveal>
          <div className="relative rounded-2xl bg-grass/10 border border-lime p-8 md:p-10">
            <span className="absolute -top-3 left-8 bg-lime text-pitch text-[10px] font-medium tracking-widest uppercase px-3 py-1 rounded-full">
              Free forever
            </span>

            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="shrink-0">
                <div className="font-heading text-7xl text-lime leading-none">£0</div>
                <p className="text-white/40 text-sm mt-1">always</p>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 flex-1">
                {FREE_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/70 font-light">
                    <svg className="shrink-0 mt-0.5 text-lime" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
                      <path d="M4 7l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-lime text-pitch font-medium px-8 py-3 rounded-xl hover:bg-[#d4f54d] transition-colors text-sm"
              >
                Create your sweepstake →
              </Link>
              <p className="text-xs text-white/30">No credit card · No spam · We will never share your details with anyone.</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
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

      {/* ── CTA BAND ─────────────────────────────────────────── */}
      <div className="relative text-center px-6 py-24 md:py-32 overflow-hidden border-t border-lime/10">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,240,70,0.07)_0%,transparent_60%)]" />

        <h2 className="relative font-heading text-[clamp(36px,6vw,80px)] leading-none tracking-tight mb-4">
          Your draw.<br /><span className="text-lime">Your rules.</span>
        </h2>
        <p className="relative text-lg text-white/45 font-light mb-10">
          Set up your World Cup 2026 sweepstake in 30 seconds. Free to start.
        </p>
        <Link
          href="/signup"
          className="relative inline-flex items-center gap-2 bg-lime text-pitch font-medium px-10 py-4 rounded-xl hover:bg-[#d4f54d] transition-colors text-base"
        >
          Create your draw
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <p className="relative mt-5 text-xs text-white/25">
          No credit card · No spam · We will never share your details with anyone
        </p>
      </div>

    </div>
  )
}
