import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServiceClient } from '@/lib/supabase/server'
import { HeroEmailForm } from '@/components/marketing/HeroEmailForm'
import { HeroDrawAnimation } from '@/components/marketing/HeroDrawAnimation'
import { ScrollReveal } from '@/components/marketing/ScrollReveal'
import { CountdownBanner } from '@/components/marketing/CountdownBanner'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'
const SIGNUP_OFFSET = 30

export const metadata: Metadata = {
  title: 'World Cup 2026 Sweepstake — Free | playdrawr',
  description:
    'Run a FIFA World Cup 2026 sweepstake in minutes. Random draw of all 48 teams, live leaderboard, automatic scoring. Free forever.',
  openGraph: {
    title: 'World Cup 2026 Sweepstake — Free | playdrawr',
    description: 'Random draw, live leaderboard, automatic scoring. Free forever.',
    url: `${APP_URL}/worldcup`,
    images: [{ url: `${APP_URL}/api/og/home`, width: 1200, height: 630 }],
  },
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

const steps = [
  { num: '01', title: 'Create your sweepstake', desc: 'Name it, set your entry fee if you want one, and invite participants via a link. Takes under a minute.' },
  { num: '02', title: 'Run the draw', desc: 'Hit the button. All 48 World Cup teams are randomly assigned — fair, instant, no arguments.' },
  { num: '03', title: 'Share with your group', desc: 'Send one link to the office, the pub group chat, or the family WhatsApp. No accounts needed.' },
  { num: '04', title: 'Track it all summer', desc: 'Live scores, group standings, knockout bracket and payment tracking update automatically for 8 weeks.' },
]

const features = [
  { icon: '⚡', title: 'Instant random draw', desc: 'Cryptographically fair distribution of all 48 teams across any number of participants.' },
  { icon: '📡', title: 'Live scores & standings', desc: 'Group tables and knockout results update automatically from official data. No manual entry.' },
  { icon: '💷', title: 'Payment tracking', desc: 'Mark participants paid or unpaid. See your collected pot at a glance. No chasing.' },
  { icon: '🔗', title: 'Shareable participant view', desc: 'One link, no login required. Everyone sees their teams, standings, and the leaderboard.' },
  { icon: '🏆', title: 'Automatic leaderboard', desc: 'Points calculated in real time as results come in. Group wins, knockout rounds, and the final.' },
  { icon: '📊', title: 'Group & bracket view', desc: 'Full group stage tables with P W D L GD Pts. Qualified positions highlighted automatically.' },
]

const stats = [
  { value: '3 min', label: 'to set up, right now' },
  { value: '48', label: 'teams pre-loaded and ready' },
  { value: '£0', label: 'completely free, always' },
  { value: '8 wks', label: 'of automatic leaderboard' },
]

const testimonials = [
  { text: '"Finally sorted our office sweepstake without a single WhatsApp argument about who got which team. Sent one link, everyone was in within the hour."', author: 'Sarah M.', role: '🏢 Office Manager, Manchester' },
  { text: '"Been running the pub sweepstake on a scrap of paper for years. This is embarrassingly better. Takes me five minutes and the leaderboard updates itself."', author: 'Dave K.', role: '🍺 Pub landlord, Leeds' },
  { text: '"The payment tracking alone saved me chasing the lads for weeks. Everyone can see who\'s paid — sorts it out immediately."', author: 'Jamie T.', role: '⚽ Five-a-side organiser, Bristol' },
]

export default async function WorldCupPage() {
  const organiserCount = await getOrganiserCount()

  return (
    <div className="bg-pitch text-white overflow-x-hidden">

      {/* Countdown banner */}
      <div className="pt-16">
        <CountdownBanner />
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        id="reserve"
        className="relative flex flex-col items-center justify-center text-center px-6 pt-16 pb-20 overflow-hidden"
      >
        {/* Pitch glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.02]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,rgba(200,240,70,0.05)_0%,transparent_70%)]" />
        </div>

        {/* FIFA logo */}
        <div className="mb-8">
          <Image
            src="/fifa_logo_white.png"
            alt="FIFA World Cup 2026"
            width={160}
            height={60}
            className="object-contain mx-auto"
            style={{ opacity: 0.9 }}
            unoptimized
          />
        </div>

        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 bg-lime/10 border border-lime/25 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-lime shrink-0" />
          <span className="text-xs font-medium tracking-widest uppercase text-lime">World Cup 2026 — Free sweepstake tool</span>
        </div>

        {/* H1 */}
        <h1 className="font-heading font-bold leading-tight tracking-tight text-[clamp(36px,7vw,80px)] mb-5 max-w-3xl">
          Your World Cup sweepstake.<br />
          <span className="text-lime">Set up in 3 minutes.</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-xl text-lg text-white/60 leading-relaxed mb-6">
          Whether it&apos;s the office, the pub, the five-a-side group or the family WhatsApp — run your own sweepstake with a free draw, live leaderboard, and one link to share with everyone.
        </p>

        {/* Use case pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['🏢 Office', '🍺 Pub', '⚽ Five-a-side', '👨‍👩‍👧 Family', '🎮 Online group'].map(label => (
            <span key={label} className="text-xs font-medium bg-white/8 border border-white/15 text-white/70 px-3 py-1.5 rounded-full">
              {label}
            </span>
          ))}
        </div>

        {/* Email form */}
        <div className="w-full max-w-md mb-5">
          <HeroEmailForm variant="hero" />
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-2 mb-16">
          <span className="w-2 h-2 rounded-full bg-lime shrink-0" />
          <p className="text-sm text-white/50">
            <span className="text-white font-semibold">{organiserCount.toLocaleString()}</span>
            {' '}organisers have already reserved their draw
          </p>
        </div>

        {/* Draw animation */}
        <a href="#demo" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors mb-8">
          <span>Watch a live draw</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <div id="demo" className="w-full max-w-sm md:max-w-2xl scroll-mt-24">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-lime shrink-0" />
            <p className="text-xs font-medium tracking-widest uppercase text-lime/80">Live demo — watch the draw run</p>
          </div>
          <HeroDrawAnimation />
          <p className="text-center text-xs text-white/30 mt-3">
            This is what your group sees when you hit draw — 48 teams, randomly assigned, instantly.
          </p>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────────── */}
      <div className="border-y border-white/10 py-10 px-6 mt-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.value} className="text-center">
              <span className="block font-heading text-4xl text-lime leading-none mb-1">{s.value}</span>
              <span className="block text-xs text-white/40 leading-snug">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-px bg-lime" />
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-lime">How it works</span>
        </div>
        <h2 className="font-heading text-[clamp(36px,5vw,64px)] leading-none tracking-tight mb-4">
          Set up in minutes.<br /><span className="text-lime">Runs itself all summer.</span>
        </h2>
        <p className="text-white/50 text-lg font-light max-w-md mb-12">
          No spreadsheets. No group chat chaos. No chasing people for cash. Just a link.
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

      {/* ── Features ───────────────────────────────────────────────────── */}
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

      {/* ── Testimonials ───────────────────────────────────────────────── */}
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

      {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
      <div className="relative text-center px-6 py-24 md:py-32 overflow-hidden border-t border-lime/10">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,240,70,0.07)_0%,transparent_60%)]" />
        <div className="relative max-w-lg mx-auto">
          <h2 className="font-heading text-[clamp(32px,5vw,64px)] leading-tight tracking-tight mb-3">
            Office, pub, five-a-side<br />
            <span className="text-lime">or family — it&apos;s yours.</span>
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
