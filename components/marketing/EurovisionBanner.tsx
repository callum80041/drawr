import Link from 'next/link'
import Image from 'next/image'

export function EurovisionBanner() {
  return (
    <section className="relative overflow-hidden px-4 py-12 md:py-16" style={{ background: '#040241' }}>
      {/* Purple glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(90,34,169,0.35) 0%, transparent 70%)',
        }}
      />
      {/* Pink glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 40% 60% at 20% 50%, rgba(241,15,89,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Left: copy */}
        <div className="flex-1 text-center md:text-left">
          {/* Coming soon pill */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(241,15,89,0.15)', border: '1px solid rgba(241,15,89,0.4)', color: '#F10F59' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#F10F59' }} />
            Coming May 2026
          </div>

          {/* Eurovision logo */}
          <div className="mb-4 flex justify-center md:justify-start">
            <Image
              src="/eurovision-logo-white.svg"
              alt="Eurovision Song Contest"
              width={220}
              height={60}
              className="object-contain"
              unoptimized
            />
          </div>

          <h2 className="font-heading font-bold text-white text-2xl md:text-3xl tracking-tight mb-3 leading-tight">
            Eurovision sweepstakes<br />
            <span style={{ color: '#F10F59' }}>are coming to playdrawr.</span>
          </h2>
          <p className="text-white/55 text-sm leading-relaxed mb-6 max-w-md mx-auto md:mx-0">
            Assign countries, track the voting, crown your winner. Sign up to be first in when we launch.
          </p>

          <Link
            href="/eurovision"
            className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: '#F10F59', color: '#ffffff' }}
          >
            Get early access
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Right: symbol + details */}
        <div className="shrink-0 flex flex-col items-center gap-4">
          {/* Big symbol */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ background: 'rgba(90,34,169,0.5)' }}
            />
            <Image
              src="/eurovision-symbol.svg"
              alt=""
              width={100}
              height={106}
              className="relative object-contain"
              unoptimized
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>

          {/* Quick stats */}
          <div className="flex gap-6 text-center">
            <div>
              <p className="font-heading font-bold text-2xl" style={{ color: '#F10F59' }}>~37</p>
              <p className="text-xs text-white/40">countries</p>
            </div>
            <div>
              <p className="font-heading font-bold text-2xl" style={{ color: '#5A22A9' }}>1</p>
              <p className="text-xs text-white/40">winner</p>
            </div>
            <div>
              <p className="font-heading font-bold text-2xl text-white">May</p>
              <p className="text-xs text-white/40">2026</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
