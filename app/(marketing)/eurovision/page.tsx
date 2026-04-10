import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Eurovision 2026 Sweepstake | playdrawr',
  description:
    'Run a Eurovision Song Contest 2026 sweepstake with playdrawr. Random country draw, live leaderboard, real scoring. Free. Set up in 3 minutes.',
  openGraph: {
    title: 'Eurovision 2026 Sweepstake | playdrawr',
    description: 'Random country draw, live leaderboard, real scoring. Free. Set up in 3 minutes.',
  },
}

const BG     = '#040241'
const PURPLE = '#5A22A9'
const PINK   = '#F10F59'

export default function EurovisionPage() {
  return (
    <div style={{ background: BG, color: '#fff', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 overflow-hidden"
      >
        {/* Decorative symbol */}
        <img
          src="/eurovision-symbol.svg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            opacity: 0.06,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />

        {/* Eurovision logo */}
        <img
          src="/eurovision-logo-white.svg"
          alt="Eurovision Song Contest"
          style={{ maxWidth: 260, width: '100%', marginBottom: 32 }}
        />

        {/* Eyebrow pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          style={{ background: 'rgba(241,15,89,0.15)', border: '1px solid rgba(241,15,89,0.4)', color: '#fff' }}
        >
          <span
            style={{ width: 8, height: 8, borderRadius: '50%', background: PINK, display: 'inline-block', flexShrink: 0, animation: 'pulse 2s infinite' }}
          />
          Vienna, Austria · 13–17 May 2026
        </div>

        {/* H1 */}
        <h1
          className="font-heading font-extrabold leading-tight mb-6"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', maxWidth: 640 }}
        >
          Your Eurovision sweepstake.{' '}
          <span style={{ color: PINK }}>Done in 3 minutes.</span>
        </h1>

        {/* Subtext */}
        <p
          className="mb-10 leading-relaxed"
          style={{ maxWidth: 520, fontSize: '1.125rem', color: 'rgba(255,255,255,0.75)' }}
        >
          35 countries, random draw, live leaderboard as the votes come in. Follow the real Eurovision
          scoring — every jury point and public vote counts.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: PINK, color: '#fff' }}
          >
            Create your sweepstake
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <Link
            href="/s/demoeurovision"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
          >
            View live demo →
          </Link>
        </div>

        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Free · No credit card · 35 countries ready to draw
        </p>
      </section>

      {/* ── Feature cards ─────────────────────────────────────────────── */}
      <section className="px-4 py-20" style={{ background: BG }}>
        <h2
          className="text-center font-heading font-bold mb-12"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
        >
          What you&apos;ll get
        </h2>

        <div
          className="grid gap-6 mx-auto"
          style={{ maxWidth: 960, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
        >
          {[
            {
              emoji: '🎤',
              title: 'Random country draw',
              body: 'All 35 Eurovision 2026 countries assigned at random. Fair, instant, no arguments about who got Sweden.',
            },
            {
              emoji: '🗳️',
              title: 'Real Eurovision scoring',
              body: 'Points come from the actual Grand Final scoreboard — jury votes + public televote, exactly as shown on TV.',
            },
            {
              emoji: '📺',
              title: 'Live leaderboard',
              body: 'The semi-final results and Grand Final scores update in real time. The drama on TV is the drama in your group.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-px"
              style={{ background: `linear-gradient(135deg, ${PURPLE}, ${PINK})` }}
            >
              <div
                className="rounded-2xl p-6 h-full flex flex-col gap-3"
                style={{ background: BG }}
              >
                <span style={{ fontSize: '2rem' }}>{card.emoji}</span>
                <h3 className="font-heading font-bold text-lg">{card.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How scoring works ─────────────────────────────────────────── */}
      <section className="px-4 py-16" style={{ background: BG }}>
        <div
          className="mx-auto rounded-2xl p-8 md:p-10"
          style={{ maxWidth: 800, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: PINK }}>
            How scoring works
          </p>
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-1">
              <div
                className="rounded-xl p-4 mb-3"
                style={{ background: 'rgba(90,34,169,0.2)', border: '1px solid rgba(90,34,169,0.3)' }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">Reach the Grand Final</span>
                  <span className="font-heading font-bold text-sm" style={{ color: '#C8F046' }}>+10 pts</span>
                </div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Qualify from a semi-final, or auto-qualify as Big 5 or host Austria
                </p>
              </div>
              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(241,15,89,0.15)', border: '1px solid rgba(241,15,89,0.25)' }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">Grand Final score</span>
                  <span className="font-heading font-bold text-sm" style={{ color: PINK }}>+ real pts</span>
                </div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Your country&apos;s actual combined jury + televote from the Final
                </p>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Example</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Your country qualifies ✓ <strong style={{ color: '#C8F046' }}>+10 pts</strong>, then scores 423 in the
                Final — your total is <strong style={{ color: '#fff' }}>433 pts</strong>. The same scoreboard you see on TV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Already use Drawr? ────────────────────────────────────────── */}
      <section className="px-4 py-16" style={{ background: BG }}>
        <div
          className="mx-auto rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            maxWidth: 800,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ flex: 1 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C8F046' }}>
              Already use Drawr for football?
            </p>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, maxWidth: 480 }}>
              Your Eurovision sweepstake sits alongside your World Cup one in the same dashboard.
              No new account needed — just create and go.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-opacity hover:opacity-80"
            style={{ background: '#C8F046', color: '#1A2E22' }}
          >
            Go to your dashboard →
          </Link>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section
        className="px-4 py-24 flex flex-col items-center text-center"
        style={{ background: BG, borderTop: '1px solid rgba(241,15,89,0.15)' }}
      >
        <img
          src="/eurovision-symbol.svg"
          alt=""
          aria-hidden="true"
          style={{ width: 56, height: 56, opacity: 0.5, marginBottom: 24 }}
        />
        <h2
          className="font-heading font-bold mb-4"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
        >
          Ready to run your Eurovision sweepstake?
        </h2>
        <p className="mb-10" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 400 }}>
          Free. 3 minutes. 35 countries. Your group sorted before the first semi-final.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-opacity hover:opacity-90"
            style={{ background: PINK, color: '#fff', fontSize: '1rem' }}
          >
            Create your sweepstake — it&apos;s free →
          </Link>
          <Link
            href="/s/demoeurovision"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}
          >
            View live demo
          </Link>
        </div>
      </section>

    </div>
  )
}
