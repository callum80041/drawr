import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'World Cup 2026 Office Sweepstake: The Complete Guide',
  description: 'Everything you need to run a perfect World Cup 2026 office sweepstake. Draw, rules, prizes, payment tracking — and a free tool that does the hard work for you.',
}

export default function OfficeSweepstakePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Office sweepstake</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        World Cup 2026 office sweepstake: the complete guide
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        The 2026 World Cup is the biggest football tournament ever staged. 48 nations, 104 matches, eight weeks of action across three countries. And somewhere in your office, one person is going to end up organising the sweepstake. This guide covers everything.
      </p>

      <div className="prose-content space-y-8 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Why bother with an office sweepstake?</h2>
          <p>Beyond the obvious answer — it&apos;s fun — a well-run sweepstake does something genuinely valuable for office culture. It gives people across different teams, levels, and departments a shared stake in the same event. The intern who draws Argentina has something to talk to the CEO about. The person who doesn&apos;t follow football at all suddenly has a reason to watch matches.</p>
          <p>For eight weeks, the sweepstake is a daily conversation starter that crosses every usual boundary in the workplace. That&apos;s worth more than most team-building activities cost.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Before you start: what to decide</h2>
          <p>Before you take a single entry, make three decisions:</p>
          <p><strong className="text-pitch">Entry fee or free?</strong> A paid sweepstake with a cash pot is the classic format. A free sweepstake with a company-funded prize is simpler to organise and has no legal complexity. Both work.</p>
          <p><strong className="text-pitch">How many people?</strong> The 2026 World Cup has 48 teams, so up to 48 participants can each have a team. Larger groups can have multiple teams each — playdrawr handles this automatically.</p>
          <p><strong className="text-pitch">What&apos;s the prize?</strong> Decide before the draw, announce it upfront. Cash, time off, experience, trophy — make it clear before anyone enters.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">The draw</h2>
          <p>A random draw is non-negotiable. Any sweepstake where participants can choose their team stops being a sweepstake and starts being a prediction competition — and suddenly the football fans have an enormous advantage.</p>
          <p>With playdrawr, the draw is cryptographically random and completely transparent. Everyone can see their assigned team the moment the draw is confirmed. No disputes about fairness, no arguments about who got what.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Running it throughout the tournament</h2>
          <p>This is where most office sweepstakes fall apart. The draw happens with great fanfare, and then nothing — no updates, no leaderboard, no communication until someone asks who won at the end.</p>
          <p>Keep it alive: share the leaderboard link after every round of matches. Announce who&apos;s been knocked out. Post group stage standings mid-tournament. Build up to the knockout rounds with a leaderboard update. playdrawr does the scoring automatically — you just share the link and let people check.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Payment without the hassle</h2>
          <p>Chasing eight or ten people for a fiver is the least enjoyable part of running a sweepstake. The golden rule: nobody draws a team until they&apos;ve paid.</p>
          <p>Collect payments before the draw — by bank transfer, cash, or however your office normally handles it. playdrawr&apos;s payment tracker lets you mark each person as paid or unpaid with one click, see the total pot in real time, and know exactly who still owes.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Keeping it fair</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Everyone pays the same entry fee</li>
            <li>Teams are drawn randomly, no swaps</li>
            <li>Rules are communicated in writing before the draw</li>
            <li>The leaderboard is visible to everyone throughout the tournament</li>
          </ul>
          <p>playdrawr covers all of this by default. The share link gives every participant full visibility of the standings, their teams, and the group tables.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">After the final</h2>
          <p>Announce the winner clearly and publicly — a message to the whole group, not just a quiet word. The winner deserves their moment. The announcement is also the advertisement for next year&apos;s sweepstake.</p>
          <p>If you&apos;re using playdrawr, the leaderboard will clearly show the final standings once all matches are played. No manual calculation, no spreadsheet, no arguments.</p>
        </section>

      </div>

      <div className="bg-pitch rounded-2xl p-8 text-center mt-12">
        <h2 className="font-heading text-2xl font-bold text-white mb-2">Get started</h2>
        <p className="text-white/60 text-sm mb-6">Free for up to 48 participants. Takes three minutes.</p>
        <Link href="/signup" className="inline-block bg-lime text-pitch font-bold px-8 py-3 rounded-xl hover:bg-[#b8e03d] transition-colors">
          Create your free sweepstake →
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-[#E5EDEA]">
        <p className="text-sm font-semibold text-pitch mb-3">Related guides</p>
        <ul className="space-y-2">
          {[
            { href: '/how-it-works', label: 'How playdrawr works — step by step' },
            { href: '/blog/sweepstake-prize-ideas', label: 'Sweepstake prize ideas beyond cash' },
            { href: '/blog/sweepstake-rules', label: 'Sweepstake rules: how to run one fairly' },
          ].map(l => (
            <li key={l.href}><Link href={l.href} className="text-sm text-grass hover:underline">{l.label} →</Link></li>
          ))}
        </ul>
      </div>
    </main>
  )
}
