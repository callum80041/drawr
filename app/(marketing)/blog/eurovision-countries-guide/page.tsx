import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Eurovision Countries Guide: Favourites & Underdogs | playdrawr',
  description: 'Full Eurovision country guide. Favourites, outsiders, and wildcard entries that could win your sweepstake.',
}

export default function EurovisionCountriesGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Eurovision guide</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        Eurovision countries: favourites, outsiders, and sweepstake strategy
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        Not all Eurovision countries are equal — and understanding the landscape gives context to your sweepstake. Here is how the competition naturally splits, and why that matters.
      </p>

      <div className="space-y-10 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Top-tier favourites</h2>
          <p className="text-sm mb-4">
            These countries consistently perform well due to strong production budgets, established music industries, and reliable jury appeal.
          </p>
          <div className="bg-light rounded-xl p-5 text-sm">
            <p className="font-semibold text-pitch mb-3">Typically includes:</p>
            <div className="flex flex-wrap gap-2">
              {['Sweden', 'Ukraine', 'Italy', 'United Kingdom', 'France'].map(c => (
                <span key={c} className="bg-lime/20 text-pitch px-3 py-1 rounded-full text-xs font-medium">{c}</span>
              ))}
            </div>
          </div>
          <p className="text-sm mt-4">
            If you draw one of these, you are immediately competitive. The catch — so does everyone else know it, which makes the reaction at draw time all the more satisfying.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Mid-tier contenders</h2>
          <p className="text-sm mb-4">
            These entries are consistent but less dominant. They often finish top 10 and occasionally push higher.
          </p>
          <div className="bg-light rounded-xl p-5 text-sm">
            <p className="font-semibold text-pitch mb-3">Often includes:</p>
            <div className="flex flex-wrap gap-2">
              {['Norway', 'Australia', 'Netherlands', 'Spain', 'Belgium'].map(c => (
                <span key={c} className="bg-white border border-[#E5EDEA] text-mid px-3 py-1 rounded-full text-xs font-medium">{c}</span>
              ))}
            </div>
          </div>
          <p className="text-sm mt-4">
            These are strong sweepstake draws. Not obvious favourites, but capable of winning. In a sweepstake they represent the real value — you are in the game without being the target.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Wildcard nations</h2>
          <p className="text-sm mb-4">
            These are unpredictable. They rely on viral performances, unique staging, or a strong public vote surge. They either finish near the bottom or shock everyone.
          </p>
          <div className="bg-light rounded-xl p-5 text-sm">
            <p className="font-semibold text-pitch mb-3">Examples:</p>
            <div className="flex flex-wrap gap-2">
              {['Finland', 'Moldova', 'Iceland', 'San Marino', 'Croatia'].map(c => (
                <span key={c} className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">{c}</span>
              ))}
            </div>
          </div>
          <p className="text-sm mt-4">
            This is where sweepstake drama lives. Someone draws a wildcard, writes themselves off — then watches their country go viral and surge up the leaderboard.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Why this matters for sweepstakes</h2>
          <p className="text-sm mb-4">
            A balanced sweepstake needs all three tiers. Eurovision naturally delivers this distribution across 35 countries — which is why it works so well as a format.
          </p>
          <div className="bg-light rounded-xl p-5 space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="font-semibold text-pitch w-24 shrink-0">Favourites</span>
              <span>Create credibility — someone is always in contention</span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-pitch w-24 shrink-0">Mid-tier</span>
              <span>Sustained engagement throughout the night</span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-pitch w-24 shrink-0">Wildcards</span>
              <span>The chaos factor that keeps everyone watching</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">The public vote factor</h2>
          <p className="text-sm mb-4">
            Eurovision scoring is split between jury votes and public votes. This creates significant volatility.
          </p>
          <p className="text-sm mb-4">
            A country can rank highly with the juries, then surge further with the public — or collapse unexpectedly when the televote diverges from expert opinion. It happens every year.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Sweepstake implication:</strong> No lead is safe until the final votes are read. That is exactly why Eurovision sweepstakes stay competitive until the very end — and why the final reveal is always worth watching.
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">The semi-finals dimension</h2>
          <p className="text-sm mb-4">
            Not all 35 countries make the Grand Final. Semi-final qualification adds a first layer of sweepstake drama — if your country does not qualify, your journey ends early.
          </p>
          <p className="text-sm">
            With playdrawr, semi-final qualification is tracked automatically. Participants can see which countries are through and which are eliminated from the moment results are posted.
          </p>
        </section>

      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl p-8 text-center" style={{ background: '#040241' }}>
        <p className="text-white font-heading text-xl font-bold mb-2">Run your Eurovision sweepstake with live scoring</p>
        <p className="text-white/60 text-sm mb-6">35 countries, random draw, real-time leaderboard. Free.</p>
        <Link
          href="/signup"
          className="inline-block font-bold px-8 py-3 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: '#F10F59', color: '#fff' }}
        >
          Create your sweepstake →
        </Link>
      </div>
    </main>
  )
}
