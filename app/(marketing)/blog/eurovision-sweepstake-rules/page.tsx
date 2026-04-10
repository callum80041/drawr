import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Eurovision Sweepstake Rules UK | playdrawr',
  description: 'Simple Eurovision sweepstake rules for offices, pubs, and friends. Keep it fair, keep it fun.',
}

export default function EurovisionSweepstakeRulesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Rules guide</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        Eurovision sweepstake rules: keep it simple and fair
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        A good sweepstake depends on clear rules set before the draw. Set them once, agree on them, and do not change them on the night.
      </p>

      <div className="space-y-10 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Core rules — these should not change</h2>
          <div className="bg-light rounded-xl p-5 space-y-3 text-sm">
            {[
              { num: '1', rule: 'One country per participant', detail: 'Unless there are more participants than countries, in which case some people get two.' },
              { num: '2', rule: 'Countries assigned randomly', detail: 'No choosing, no trading before the draw. The randomness is the point.' },
              { num: '3', rule: 'No swaps after the draw', detail: 'Once the draw runs, assignments are final. Makes it fairer and removes all negotiation.' },
              { num: '4', rule: 'Highest score wins', detail: 'Based on the real Eurovision Grand Final scoreboard — jury plus public televote.' },
            ].map(item => (
              <div key={item.num} className="flex gap-4">
                <span className="w-6 h-6 rounded-full bg-lime flex items-center justify-center shrink-0 text-xs font-bold text-pitch">{item.num}</span>
                <div>
                  <p className="font-semibold text-pitch">{item.rule}</p>
                  <p className="text-mid mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Optional rule variations</h2>
          <p className="text-sm mb-4">
            You can extend the format if your group wants more engagement — but only add these if everyone agrees upfront.
          </p>
          <div className="space-y-4 text-sm">
            {[
              {
                title: 'Runner-up prizes',
                desc: '2nd and 3rd place get a share of the pot. Works well for larger groups (10+ participants).',
              },
              {
                title: 'Bonus for public vote winner',
                desc: 'The country that scores highest in the public televote gives their participant a small bonus. Adds a secondary competition.',
              },
              {
                title: 'Bonus for jury vote winner',
                desc: 'Same idea — separate bonus for the jury favourite. Encourages watching both scoring rounds carefully.',
              },
              {
                title: 'Semi-final bonus',
                desc: 'A small points bonus for countries that qualify from the semi-finals. playdrawr includes this by default.',
              },
            ].map(item => (
              <div key={item.title} className="border-l-2 border-lime pl-4">
                <p className="font-semibold text-pitch mb-1">{item.title}</p>
                <p className="text-mid">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">What to avoid</h2>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 space-y-2 text-sm text-red-700">
            {[
              'Letting people choose their country — destroys the fairness principle',
              'Mid-event rule changes — creates disputes and resentment',
              'Overly complex scoring systems — nobody will follow them on the night',
              'Paying out before the final vote is read — results can shift dramatically',
            ].map(item => (
              <div key={item} className="flex gap-3">
                <span className="shrink-0 font-bold">✕</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Tiebreakers</h2>
          <p className="text-sm mb-4">
            In rare cases where two participants finish with identical scores, decide your tiebreaker before the draw. Options:
          </p>
          <div className="bg-light rounded-xl p-5 space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="text-grass font-bold shrink-0">→</span>
              <span><strong className="text-pitch">Final Eurovision ranking</strong> — whichever country finished higher in the official results</span>
            </div>
            <div className="flex gap-3">
              <span className="text-grass font-bold shrink-0">→</span>
              <span><strong className="text-pitch">Earliest entry time</strong> — whoever joined the sweepstake first</span>
            </div>
          </div>
          <p className="text-sm mt-4">
            Keep it predefined. The worst outcome is a dispute over a rule that was not agreed in advance.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Entry fee rules</h2>
          <p className="text-sm mb-4">
            The most important rule of any sweepstake: nobody draws a country until they have paid.
          </p>
          <p className="text-sm mb-4">
            Once someone has a country, they have no incentive to hand over the money. Collect first, draw second.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Recommended:</strong> Mark participants as paid in playdrawr before running the draw. The payment summary shows your running total vs outstanding at a glance.
          </div>
        </section>

      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl p-8 text-center" style={{ background: '#040241' }}>
        <p className="text-white font-heading text-xl font-bold mb-2">Start your sweepstake with built-in rules</p>
        <p className="text-white/60 text-sm mb-6">Random draw, live leaderboard, real Eurovision scoring. Free.</p>
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
