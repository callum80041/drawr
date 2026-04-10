import type { Metadata } from 'next'
import Link from 'next/link'
import { Wordmark } from '@/components/brand/Wordmark'
import { EurovisionNotifyForm } from './EurovisionNotifyForm'

export const metadata: Metadata = {
  title: 'Eurovision 2026 Sweepstake — Coming Soon | playdrawr',
  description:
    'Run a Eurovision Song Contest 2026 sweepstake with playdrawr. Random country draw, live leaderboard, automatic scoring. Sign up to be notified at launch.',
}

const BG = '#040241'
const PURPLE = '#5A22A9'
const PINK = '#F10F59'

export default function EurovisionPage() {
  return (
    <div style={{ background: BG, color: '#fff', minHeight: '100vh' }}>
      {/* Playdrawr wordmark — top-left */}
      <div className="fixed top-0 left-0 z-50 px-6 py-4">
        <Link href="/">
          <Wordmark size="sm" variant="light" />
        </Link>
      </div>

      {/* ── Section 1: Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 overflow-hidden"
        style={{ background: BG }}
      >
        {/* Decorative symbol — background */}
        <img
          src="/eurovision-symbol.svg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 340,
            height: 340,
            opacity: 0.08,
            filter: `hue-rotate(300deg) saturate(3) brightness(1.2)`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -60%)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />

        {/* Eurovision logo */}
        <img
          src="/eurovision-logo-white.svg"
          alt="Eurovision Song Contest"
          style={{ maxWidth: 280, width: '100%', marginBottom: 32 }}
        />

        {/* Eyebrow pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          style={{ background: 'rgba(241,15,89,0.15)', border: '1px solid rgba(241,15,89,0.4)', color: '#fff' }}
        >
          <span
            style={{ width: 8, height: 8, borderRadius: '50%', background: PINK, display: 'inline-block', flexShrink: 0 }}
          />
          Coming to playdrawr · April 2026
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
          Pick your countries, track the voting, crown the winner. We&apos;re building a Eurovision sweepstake
          tool&nbsp;— sign up to be first in when we launch.
        </p>

        {/* Signup form */}
        <div style={{ width: '100%', maxWidth: 420 }}>
          <EurovisionNotifyForm />
        </div>

        <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
          We&apos;ll only email you once&nbsp;— when it&apos;s live. No spam.
        </p>
      </section>

      {/* ── Section 2: Feature cards ── */}
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
              body: 'All Eurovision 2026 countries assigned at random. Fair, instant, no arguments.',
            },
            {
              emoji: '🗳️',
              title: 'Live voting leaderboard',
              body: 'Scores update in real time as the jury and public votes come in on the night.',
            },
            {
              emoji: '🏆',
              title: 'Crown your winner',
              body: 'Points for every country that makes the final, big points for top 10, jackpot for the winner.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-px"
              style={{
                background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
              }}
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

      {/* ── Section 3: Already use Drawr? ── */}
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
              If you&apos;ve already run a World Cup sweepstake with us, your Eurovision one will be ready and
              waiting in the same dashboard.
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

      {/* ── Section 4: Bottom CTA ── */}
      <section
        className="px-4 py-24 flex flex-col items-center text-center"
        style={{ background: BG }}
      >
        <img
          src="/eurovision-symbol.svg"
          alt=""
          aria-hidden="true"
          style={{ width: 56, height: 56, opacity: 0.6, marginBottom: 24 }}
        />
        <h2
          className="font-heading font-bold mb-4"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
        >
          Be first to know when we launch
        </h2>
        <p className="mb-10" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 400 }}>
          Drop your email and we&apos;ll ping you the moment Eurovision sweepstakes go live.
        </p>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <EurovisionNotifyForm ctaLabel="Be first to know when we launch →" />
        </div>
      </section>

      {/* Footer spacer — marketing footer will render below */}
    </div>
  )
}
