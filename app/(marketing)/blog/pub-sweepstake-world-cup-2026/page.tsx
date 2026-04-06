import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Run a Pub World Cup Sweepstake 2026 | playdrawr',
  description: 'A complete guide for pub landlords running a World Cup 2026 sweepstake. Set up, collect entries, track payments, and keep regulars engaged all tournament long.',
}

export default function PubSweepstakePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Pub guide</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        How to run a World Cup pub sweepstake in 2026
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        Pubs and sweepstakes go together like football and a cold pint. But running one properly — taking entries, managing the draw, tracking who&apos;s paid, keeping the standings visible — is more work than it looks when you&apos;ve got 60 regulars all wanting to know where they stand.
      </p>

      <div className="space-y-8 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Why the pub sweepstake matters</h2>
          <p>A well-run sweepstake keeps regulars coming back throughout the eight weeks of the tournament. Someone who drew Brazil needs to be in to watch Brazil games. Someone with a points lead wants to celebrate at the bar. Someone trailing needs to drown their sorrows.</p>
          <p>The sweepstake extends the commercial opportunity of the World Cup well beyond the opening weekend. It gives you a reason to communicate with regulars throughout the tournament, run specials on match nights, and build genuine community around the event.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Setting it up</h2>
          <p>You have two options: the traditional paper draw or a digital sweepstake. Most pubs still run paper draws out of habit — but there are real advantages to going digital in 2026.</p>
          <p>A paper draw means manually updating a standings board, fielding questions about who has which team, and remembering who has and hasn&apos;t paid. A digital draw means a live leaderboard that updates automatically, a single link you can put on your social media and your pub&apos;s WhatsApp group, and payment tracking built in.</p>
          <p>playdrawr is free for up to 48 participants — enough for most pub sweepstakes.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Taking entries</h2>
          <p>Open entries 2–3 weeks before the tournament kicks off. Give people time to pay before the draw date. Set a hard deadline — no entries accepted after the draw.</p>
          <div className="bg-light rounded-xl p-5 mt-3 space-y-2 text-sm">
            <p>Post on your socials and WhatsApp group that the sweepstake is open.</p>
            <p>Take entries over the bar — name and payment in exchange for a place in the draw.</p>
            <p>Track entries in playdrawr as you take them.</p>
            <p>Run the draw the evening before the tournament starts — make it an event.</p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">The entry fee</h2>
          <p>Pub sweepstakes typically charge more than office ones — £5–£10 per entry is standard, with some larger pubs going to £20 for a bigger prize pot. With 48 entries at £10 that&apos;s a £480 pot — enough to make it genuinely exciting.</p>
          <p>Consider splitting the prize: 70% to the winner, 20% to the runner-up, 10% to whoever draws the top scorer&apos;s nation. Three prizes from one sweepstake — three people who have a reason to stay interested until the final.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Making the draw night an event</h2>
          <p>The draw night is your first commercial opportunity. Promote it. Put it on your socials. Run a special. Make the draw feel like an occasion — a live draw with names being called out over the bar creates more atmosphere than an email with results.</p>
          <p>With playdrawr, you can run the digital draw live on a screen behind the bar. Each team assignment appears as it&apos;s generated. The reactions are the entertainment.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Keeping regulars engaged throughout the tournament</h2>
          <p>With playdrawr&apos;s share link, every regular can check the leaderboard from their phone without needing to come in and look at a board. That said — print out the leaderboard and stick it up behind the bar anyway. The physical board drives conversations. The digital link drives check-ins outside opening hours.</p>
          <p>Post leaderboard updates on your socials after big match nights. &quot;After the quarter-finals, Dave&apos;s England is leading our sweepstake by 12 points&quot; is content that writes itself and drives engagement.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">The prize</h2>
          <p>Cash is the simplest prize. But consider adding a physical element — a trophy or engraved glass that the winner gets to display. It&apos;s memorable, photogenic for socials, and creates a talking point.</p>
          <p>Some pubs fund a non-cash prize themselves — a free tab up to £50, a meal for two, the first round at the final watch party. A company-funded prize means you keep the entry pot and use it for your own promotion, while still giving the winner something worth having.</p>
        </section>

      </div>

      <div className="bg-pitch rounded-2xl p-8 text-center mt-12">
        <h2 className="font-heading text-2xl font-bold text-white mb-2">Set up your pub sweepstake</h2>
        <p className="text-white/60 text-sm mb-6">Free for up to 48 participants. Digital draw, live leaderboard, payment tracking.</p>
        <Link href="/signup" className="inline-block bg-lime text-pitch font-bold px-8 py-3 rounded-xl hover:bg-[#b8e03d] transition-colors">
          Create your sweepstake free →
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-[#E5EDEA]">
        <p className="text-sm font-semibold text-pitch mb-3">Related guides</p>
        <ul className="space-y-2">
          {[
            { href: '/how-it-works', label: 'How playdrawr works — step by step' },
            { href: '/blog/sweepstake-rules', label: 'Sweepstake rules: how to run one fairly' },
          ].map(l => (
            <li key={l.href}><Link href={l.href} className="text-sm text-grass hover:underline">{l.label} →</Link></li>
          ))}
        </ul>
      </div>
    </main>
  )
}
