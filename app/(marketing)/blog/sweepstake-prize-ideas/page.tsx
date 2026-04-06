import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sweepstake Prize Ideas: Beyond the Cash Pot | playdrawr',
  description: 'Creative sweepstake prize ideas for offices and pubs — from half days off to company donations. The best prizes create stories, not just payouts. UK guide.',
}

export default function PrizeIdeasPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Prize ideas</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        Sweepstake prize ideas: the best rewards aren&apos;t always cash
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        Cash is the default sweepstake prize. It&apos;s simple, universal, and unambiguous. But it&apos;s also forgettable. Nobody tells the story of winning £40 in the office sweepstake three years later. They do tell the story of winning a half day off, or getting their charity of choice a £100 donation, or standing in front of the office holding a ridiculous trophy.
      </p>

      <div className="space-y-8 text-mid leading-relaxed">

        {[
          {
            title: 'Time off (the most universally coveted prize)',
            body: 'A half day off on a Friday. An extra day\'s holiday added to their entitlement. Working from home for a full week without using leave. Time is the one thing nobody feels they have enough of. A half day off costs the business almost nothing in practical terms — the work gets done — but the perceived value is enormous. It\'s the prize everyone wants and very few sweepstakes offer.',
          },
          {
            title: 'Experiences over things',
            body: 'Dinner for two at a restaurant of their choice, up to £100. A spa afternoon. Tickets to a live event — sport, music, theatre, their call. A cooking class. A day trip. Experiences are memorable in a way that a gift card isn\'t. They generate photos, conversations, and the kind of story that gets retold at the Christmas party.',
          },
          {
            title: 'Charity donations in their name',
            body: 'For companies with a strong CSR culture, a charity donation in the winner\'s name is genuinely meaningful. Let them choose the charity — a £100 donation to a cause they care about is worth far more in goodwill than £40 in their pocket. This is also a story worth telling publicly — "Our World Cup sweepstake raised £100 for [charity]" is internal comms that money can\'t buy.',
          },
          {
            title: 'The physical trophy',
            body: 'A physical trophy — engraved, personalised, ideally slightly ridiculous — creates a permanent reminder of the sweepstake every time it sits on someone\'s desk. It\'s photographable, shareable, and becomes the talking point for the next tournament. You can order personalised football trophies from most awards suppliers for £15–£40.',
          },
          {
            title: 'Premium parking',
            body: 'Reserved parking or a prime car park space for a month. Laughably mundane on paper. Surprisingly coveted in practice. In any office with a car park, the best spaces create a genuine daily reminder of having won. Free, creates its own banter, costs the business nothing.',
          },
          {
            title: 'Company credit',
            body: 'A voucher for the company canteen. A £50 company credit card for the work Christmas party. First pick of the holiday calendar for the next period. The internal currency of workplace perks.',
          },
        ].map(({ title, body }) => (
          <section key={title}>
            <h2 className="font-heading text-2xl font-bold text-pitch mb-3">{title}</h2>
            <p>{body}</p>
          </section>
        ))}

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">The runner-up consolation</h2>
          <p>Big sweepstakes with a large prize pot often add consolation prizes. A simple structure: 70% to the winner, 20% to the runner-up, 10% to whoever draws the top scorer&apos;s nation. Three prizes from one sweepstake — three people who have a reason to stay interested until the final.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">How to announce the prize before the draw</h2>
          <p>Whatever you choose, communicate it clearly before anyone enters. A sweepstake where the prize is vague or uncertain gets lower engagement than one where everyone knows exactly what they&apos;re playing for.</p>
        </section>

      </div>

      <div className="bg-pitch rounded-2xl p-8 text-center mt-12">
        <h2 className="font-heading text-2xl font-bold text-white mb-2">Set up your sweepstake with a custom prize</h2>
        <p className="text-white/60 text-sm mb-6">Free for up to 48 participants. Takes three minutes.</p>
        <Link href="/signup" className="inline-block bg-lime text-pitch font-bold px-8 py-3 rounded-xl hover:bg-[#b8e03d] transition-colors">
          Create your sweepstake free →
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-[#E5EDEA]">
        <p className="text-sm font-semibold text-pitch mb-3">Related guides</p>
        <ul className="space-y-2">
          {[
            { href: '/blog/world-cup-2026-office-sweepstake', label: 'The complete office sweepstake guide' },
            { href: '/blog/sweepstake-rules', label: 'Sweepstake rules: how to run one fairly' },
          ].map(l => (
            <li key={l.href}><Link href={l.href} className="text-sm text-grass hover:underline">{l.label} →</Link></li>
          ))}
        </ul>
      </div>
    </main>
  )
}
