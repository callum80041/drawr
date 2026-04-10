import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Eurovision Sweepstake Ideas (Creative Formats) | playdrawr',
  description: 'Creative Eurovision sweepstake ideas to make your event more engaging. Light variations that improve the night without overcomplicating it.',
}

export default function EurovisionSweepstakeIdeasPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Sweepstake ideas</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        Eurovision sweepstake ideas that actually improve engagement
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        The standard format works well. But if you want more than a basic sweepstake, there are a handful of light variations that genuinely improve the night without overcomplicating things.
      </p>

      <div className="space-y-10 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Key principle first</h2>
          <div className="bg-light border border-[#E5EDEA] rounded-xl p-5 text-sm">
            <p className="font-semibold text-pitch mb-2">Enhance, do not complicate.</p>
            <p>
              Every idea below adds one thing. The moment you stack multiple variations on top of each other, you have a scoring system nobody can follow on the night. Pick one, explain it clearly, and stick to it.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Idea 1: Last place forfeit</h2>
          <p className="text-sm mb-4">
            The participant with the lowest points at the end of the Grand Final takes a forfeit — buys the first round, makes the teas for a week, picks up the next office cake order.
          </p>
          <p className="text-sm mb-4">
            The effect: everyone is invested even when their country is out of the running. A last-place race is as interesting as a first-place race, and it keeps all participants engaged until the final votes.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Note:</strong> Agree the forfeit before the draw. Ambiguity on the night leads to disputes.
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Idea 2: Bonus prediction category</h2>
          <p className="text-sm mb-4">
            Before the Grand Final, everyone submits a prediction: who wins the public vote? Who wins the jury vote? First country eliminated?
          </p>
          <p className="text-sm mb-4">
            Run this alongside the main sweepstake — correct predictions earn bonus points. It creates a secondary competition that keeps people engaged even if their drawn country is already eliminated.
          </p>
          <div className="bg-light rounded-xl p-5 text-sm space-y-2">
            <p className="font-semibold text-pitch mb-1">Suggested bonus categories:</p>
            {[
              'Overall winner prediction (+5 pts)',
              'Public vote winner prediction (+3 pts)',
              'First country eliminated prediction (+2 pts)',
            ].map(item => (
              <div key={item} className="flex gap-2">
                <span className="text-grass font-bold">→</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Idea 3: Best performance bonus</h2>
          <p className="text-sm mb-4">
            After the Grand Final, the group votes on the best costume, most memorable performance, or weirdest staging moment. The participant whose country wins the popular vote gets a small bonus.
          </p>
          <p className="text-sm">
            This one requires a quick group poll after the show — but it extends the event beyond the scoreboard and creates conversation about performances rather than just results.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Idea 4: Team-based entries</h2>
          <p className="text-sm mb-4">
            For large offices (30+ people), pair participants up. Each pair shares two countries — their combined score determines the winner.
          </p>
          <p className="text-sm mb-4">
            This format works particularly well when you have an odd number of participants, or when some people want to join without committing to a solo entry.
          </p>
          <div className="bg-light rounded-xl p-5 text-sm">
            <p className="font-semibold text-pitch mb-2">How to run it:</p>
            <p>Create the sweepstake normally, then manually pair people once countries are assigned. The playdrawr leaderboard shows individual scores — just add them manually for teams.</p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Idea 5: Semi-final survival round</h2>
          <p className="text-sm mb-4">
            Make the semi-finals matter separately. Anyone whose country is eliminated in the semis is &quot;knocked out&quot; of the sweepstake. Those remaining in the Grand Final compete for the main prize.
          </p>
          <p className="text-sm">
            This creates two events — semi-final night and Grand Final night — and doubles the sweepstake engagement across the week. Works best for groups watching both shows together.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">What to avoid adding</h2>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 space-y-2 text-sm text-red-700">
            {[
              'Multiple simultaneous bonus categories — nobody will track them',
              'Post-draw country trading — breaks the fairness principle',
              'Scoring based on personal taste ratings — completely unverifiable',
              'Rule variations announced after the draw starts',
            ].map(item => (
              <div key={item} className="flex gap-2">
                <span className="font-bold">✕</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl p-8 text-center" style={{ background: '#040241' }}>
        <p className="text-white font-heading text-xl font-bold mb-2">Run your custom sweepstake on playdrawr</p>
        <p className="text-white/60 text-sm mb-6">Free. 35 countries ready. Takes three minutes to set up.</p>
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
