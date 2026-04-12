import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { ScrollReveal } from '@/components/marketing/ScrollReveal'
import { HeroEmailForm } from '@/components/marketing/HeroEmailForm'
import { HeroDrawAnimation } from '@/components/marketing/HeroDrawAnimation'

export const revalidate = 300

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'
const SIGNUP_OFFSET = 30

export const metadata: Metadata = {
  title: 'playdrawr — Free Sweepstake Tool for World Cup & Eurovision 2026',
  description: 'Run a World Cup 2026 or Eurovision 2026 sweepstake in minutes. Random draw, live leaderboard, automatic scoring. Free forever.',
  other: {
    'google-adsense-account': 'ca-pub-4502089642412261',
  },
  openGraph: {
    title: 'playdrawr — Free Sweepstake Tool for World Cup & Eurovision 2026',
    description: 'Run a World Cup or Eurovision sweepstake in minutes. Free forever.',
    url: APP_URL,
    siteName: 'playdrawr',
    images: [{ url: `${APP_URL}/api/og/home`, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'playdrawr — Free Sweepstake Tool',
    description: 'World Cup 2026 or Eurovision 2026 sweepstake in minutes. Free forever.',
    images: [`${APP_URL}/api/og/home`],
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
  { num: '01', title: 'Create your sweepstake', desc: 'Name it, pick your tournament, set an optional entry fee, and invite participants via a link.' },
  { num: '02', title: 'Run the draw', desc: 'One button. Teams or countries assigned at random — fair, instant, no arguments.' },
  { num: '03', title: 'Share with your group', desc: 'Send one link to the office, pub group chat, or family WhatsApp. No accounts needed.' },
  { num: '04', title: 'Watch it run itself', desc: 'Scores, standings and the leaderboard update automatically. You just watch.' },
]

const testimonials = [
  { text: '"Finally sorted our office sweepstake without a single WhatsApp argument about who got which team."', author: 'Sarah M.', role: '🏢 Office Manager, Manchester' },
  { text: '"Been running the pub sweepstake on a scrap of paper for years. This is embarrassingly better."', author: 'Dave K.', role: '🍺 Pub landlord, Leeds' },
  { text: '"The payment tracking alone saved me chasing the lads for weeks. Everyone can see who\'s paid."', author: 'Jamie T.', role: '⚽ Five-a-side organiser, Bristol' },
]

export default async function LandingPage() {
  const organiserCount = await getOrganiserCount()

  return (
    <div className="bg-pitch text-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        id="reserve"
        className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_60%,rgba(200,240,70,0.04)_0%,transparent_70%)]" />
        </div>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-4 py-1.5 mb-8">
          <span className="text-xs font-medium tracking-widest uppercase text-white/60">2026 Sweepstake Tool</span>
        </div>

        <h1 className="font-heading font-bold leading-tight tracking-tight text-[clamp(36px,6vw,80px)] mb-5 max-w-3xl">
          Your sweepstake.<br />
          <span className="text-lime">Pick your tournament.</span>
        </h1>

        <p className="max-w-xl text-lg text-white/60 leading-relaxed mb-10">
          World Cup 2026 or Eurovision 2026 — run a fair draw, share one link with your group, and let the leaderboard do the rest. Free forever.
        </p>

        {/* Tournament cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-10">

          {/* World Cup card */}
          <Link
            href="/worldcup"
            className="group relative rounded-2xl p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-xl"
            style={{ background: 'rgba(200,240,70,0.06)', border: '1px solid rgba(200,240,70,0.2)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <Image
                src="/fifa_logo_white.png"
                alt="FIFA World Cup 2026"
                width={100}
                height={38}
                className="object-contain"
                style={{ opacity: 0.85 }}
                unoptimized
              />
              <svg className="w-4 h-4 text-lime/40 group-hover:text-lime transition-colors mt-1" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="font-heading font-bold text-lg text-white mb-1">World Cup 2026</p>
            <p className="text-sm text-white/50 mb-4">USA · Canada · Mexico · June–July 2026</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-lime/10 text-lime px-2.5 py-1 rounded-full">48 teams</span>
              <span className="text-xs bg-white/8 text-white/50 px-2.5 py-1 rounded-full">Live scores</span>
              <span className="text-xs bg-white/8 text-white/50 px-2.5 py-1 rounded-full">Group stage + knockout</span>
            </div>
          </Link>

          {/* Eurovision card */}
          <Link
            href="/eurovision"
            className="group relative rounded-2xl p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-xl"
            style={{ background: 'rgba(241,15,89,0.06)', border: '1px solid rgba(241,15,89,0.2)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <img
                src="/eurovision-logo-white.svg"
                alt="Eurovision Song Contest 2026"
                style={{ height: 38, opacity: 0.9 }}
              />
              <svg className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors mt-1" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="font-heading font-bold text-lg text-white mb-1">Eurovision 2026</p>
            <p className="text-sm text-white/50 mb-4">Vienna, Austria · May 2026</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(241,15,89,0.15)', color: '#F10F59' }}>35 countries</span>
              <span className="text-xs bg-white/8 text-white/50 px-2.5 py-1 rounded-full">Real scoring</span>
              <span className="text-xs bg-white/8 text-white/50 px-2.5 py-1 rounded-full">Semi-finals + Final</span>
            </div>
          </Link>
        </div>

        {/* Email form CTA */}
        <div className="w-full max-w-md mb-5">
          <HeroEmailForm variant="hero" />
        </div>

        {/* Social proof */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime shrink-0" />
            <p className="text-sm text-white/50">
              <span className="text-white font-semibold">{organiserCount.toLocaleString()}</span>
              {' '}organisers already signed up
            </p>
          </div>
          <a
            href="https://www.producthunt.com/products/playdrawr-sweepstakes-made-simple?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-playdrawr-sweepstakes-made-simple"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Playdrawr: Sweepstakes Made Simple - Sweepstakes sorted in minutes, not spreadsheets | Product Hunt"
              width={250}
              height={54}
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1120910&theme=dark&t=1775864125705"
            />
          </a>
        </div>
      </section>

      {/* ── SEE IT IN ACTION ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-20 md:pb-28">
        <ScrollReveal>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(200,240,70,0.2)', background: 'linear-gradient(135deg, rgba(200,240,70,0.05) 0%, rgba(255,255,255,0.02) 60%)' }}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-6 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-lime/60" />
                <span className="text-xs font-medium text-lime tracking-widest uppercase">Live demo</span>
              </div>
              <span className="text-[10px] text-white/30 font-mono">playdrawr.co.uk</span>
            </div>

            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1 min-w-0">
                <h2 className="font-heading text-[clamp(28px,4vw,46px)] leading-tight tracking-tight mb-4">
                  See the real thing.<br />
                  <span className="text-lime">No sign-up needed.</span>
                </h2>
                <p className="text-white/50 font-light leading-relaxed mb-8">
                  Two live demo sweepstakes — pick a tournament and see exactly what your group gets. Scores, leaderboard, everything.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/s/demo2026"
                    className="inline-flex items-center justify-center gap-2 bg-lime text-pitch font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-lime/90 transition-colors"
                  >
                    ⚽ World Cup demo
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                  <a
                    href="/s/demoeurovision"
                    className="inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                    style={{ background: '#F10F59', color: '#fff' }}
                  >
                    🎤 Eurovision demo
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                </div>
              </div>
              <div className="w-full md:w-72 shrink-0">
                <HeroDrawAnimation />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how" className="max-w-5xl mx-auto px-6 pb-20 md:pb-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-px bg-lime" />
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-lime">How it works</span>
        </div>
        <h2 className="font-heading text-[clamp(36px,5vw,64px)] leading-none tracking-tight mb-4">
          Set up in minutes.<br /><span className="text-lime">Runs itself.</span>
        </h2>
        <p className="text-white/50 text-lg font-light max-w-md mb-12">
          No spreadsheets. No group chat chaos. No chasing people for cash.
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

      {/* ── BOTTOM CTA ───────────────────────────────────────── */}
      <div className="relative text-center px-6 py-24 md:py-32 overflow-hidden border-t border-lime/10">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,240,70,0.07)_0%,transparent_60%)]" />
        <div className="relative max-w-lg mx-auto">
          <h2 className="font-heading text-[clamp(32px,5vw,64px)] leading-tight tracking-tight mb-3">
            Office, pub, five-a-side<br />
            <span className="text-lime">or family — it&apos;s yours.</span>
          </h2>
          <p className="text-lg text-white/50 font-light mb-10">
            Three minutes now saves hours of WhatsApp chaos.
          </p>
          <HeroEmailForm variant="band" />
          <p className="mt-5 text-xs text-white/30">
            Free · No credit card · World Cup & Eurovision ready
          </p>
        </div>
      </div>

    </div>
  )
}
