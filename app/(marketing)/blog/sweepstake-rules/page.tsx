import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sweepstake Rules UK: How to Run One Fairly | playdrawr',
  description: 'Simple, fair sweepstake rules for your office or pub. What counts as a win, how to handle ties, entry fees, and what happens if a team withdraws. UK guide.',
}

export default function SweepstakeRulesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">UK rules guide</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        Sweepstake rules: how to run one fairly (UK guide)
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        A good sweepstake runs on clear, agreed rules. Set them before the draw, share them with everyone, and there&apos;ll be no arguments when the final whistle blows.
      </p>

      <div className="space-y-8 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">The basic rules (keep these fixed)</h2>
          <div className="space-y-2">
            {[
              'Entry fees are paid before the draw — no exceptions. Once a team is assigned, it can\'t be swapped.',
              'Teams are assigned randomly. No preferences, no trading.',
              'Whoever is assigned the winning team wins the pot (or the agreed prize).',
              'The draw is final once confirmed.',
            ].map((rule, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-lime flex items-center justify-center shrink-0 text-xs font-bold text-pitch mt-0.5">{i + 1}</span>
                <p className="text-sm">{rule}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm">playdrawr enforces rule 1 by keeping the draw locked until the organiser confirms it, and rule 2 by using cryptographically random assignment. Once confirmed, teams can&apos;t be reassigned.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">What counts as winning</h2>
          <p>In a standard World Cup sweepstake, the person assigned the team that wins the tournament wins the pot. Some sweepstakes add consolation prizes for the finalist, semi-finalists, or the team that scores the most goals. This is entirely optional but worth considering if your group is large — it keeps more people invested through the latter rounds.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">What happens with more participants than teams</h2>
          <p>With 48 World Cup nations and, say, 60 office participants, some people will have two or three teams. The standard rule is: whoever has the best-performing team among their allocation wins.</p>
          <p>playdrawr handles this automatically — the leaderboard tracks points per participant, summed across all their assigned teams.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Entry fee rules</h2>
          <p>The most important rule: nobody draws a team until they&apos;ve paid.</p>
          <div className="bg-light rounded-xl p-5 mt-3 space-y-2 text-sm">
            <p><strong className="text-pitch">Office sweepstake (casual):</strong> £2–£5 per person</p>
            <p><strong className="text-pitch">Pub sweepstake (competitive):</strong> £5–£10 per person</p>
            <p><strong className="text-pitch">Friends group (enthusiastic):</strong> £10–£20 per person</p>
          </div>
          <p className="mt-3 text-sm">Whatever you set, make it the same for everyone. Equal stake, equal chance.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Point scoring (if you use it)</h2>
          <p>A points-based leaderboard keeps the sweepstake interesting throughout the tournament. Most UK sweepstakes use something like:</p>
          <div className="bg-light rounded-xl p-5 mt-3 space-y-2 text-sm">
            {[
              ['Group stage win', '3 points'],
              ['Group stage draw', '1 point'],
              ['Reaching Round of 16', '5 bonus points'],
              ['Reaching Quarter-finals', '10 bonus points'],
              ['Reaching Semi-finals', '20 bonus points'],
              ['Reaching the Final', '40 bonus points'],
              ['Winning the tournament', '80 bonus points'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-mid">{label}</span>
                <span className="font-semibold text-pitch">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm">This is exactly the scoring system playdrawr uses — built in, automatic, updated after every match.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Tiebreakers</h2>
          <p>Decide your tiebreaker in advance:</p>
          <ul className="list-disc list-inside space-y-1 text-sm mt-2">
            <li>Earlier draw timestamp (playdrawr records this automatically)</li>
            <li>Goal difference of their assigned team</li>
            <li>Whoever&apos;s team went furthest in the knockout rounds</li>
            <li>A play-off (flip a coin, arm wrestle, whatever suits your office)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Free-to-enter sweepstakes</h2>
          <p>You don&apos;t have to charge entry. A sweepstake works just as well with a company-funded prize. If there&apos;s no money involved, there are no legal complications around prize competitions in the UK. Paid-entry sweepstakes where the prize comes from the entry pool are generally considered social entertainment and not regulated gambling, but if in any doubt, keep the entry fee modest and the prize organiser-funded.</p>
        </section>

      </div>

      <div className="bg-pitch rounded-2xl p-8 text-center mt-12">
        <h2 className="font-heading text-2xl font-bold text-white mb-2">Rules, draw, and leaderboard — all built in</h2>
        <p className="text-white/60 text-sm mb-6">playdrawr handles the draw, scoring, and standings automatically.</p>
        <Link href="/signup" className="inline-block bg-lime text-pitch font-bold px-8 py-3 rounded-xl hover:bg-[#b8e03d] transition-colors">
          Start your sweepstake free →
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-[#E5EDEA]">
        <p className="text-sm font-semibold text-pitch mb-3">Related guides</p>
        <ul className="space-y-2">
          {[
            { href: '/how-it-works', label: 'How playdrawr works — step by step' },
            { href: '/blog/world-cup-2026-office-sweepstake', label: 'The complete office sweepstake guide' },
          ].map(l => (
            <li key={l.href}><Link href={l.href} className="text-sm text-grass hover:underline">{l.label} →</Link></li>
          ))}
        </ul>
      </div>
    </main>
  )
}
