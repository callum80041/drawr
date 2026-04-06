import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Run a World Cup Sweepstake | playdrawr',
  description: 'Run a World Cup 2026 sweepstake in minutes. Random draw, live standings, leaderboard — shared with one link. Free for up to 48 people. No spreadsheets needed.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-2xl font-bold text-pitch tracking-tight mb-3">{title}</h2>
      <div className="text-mid leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-sm font-bold text-pitch">{num}</span>
      </div>
      <div>
        <h3 className="font-heading font-bold text-pitch mb-1">{title}</h3>
        <p className="text-mid leading-relaxed text-sm">{children}</p>
      </div>
    </div>
  )
}

export default function HowItWorksPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-grass hover:underline mb-8 block">← Back to playdrawr</Link>

      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        How to run a World Cup sweepstake (the easy way)
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        Every office, pub, and group chat runs a sweepstake when a major tournament comes around. But running one properly — fairly assigning teams, tracking the standings, chasing payments, keeping the leaderboard updated through eight weeks of matches — is a lot more work than it looks. This is how to do it right.
      </p>

      <Section title="What is a sweepstake?">
        <p>
          A sweepstake is a competition where participants are randomly assigned a competitor — in this case, one of the 48 nations playing in the 2026 World Cup. Everyone pays an equal entry fee (or it runs for free), and whoever is assigned the team that wins the tournament takes the pot.
        </p>
        <p>
          The random draw is the whole point. It levels the playing field completely — a football obsessive is no more likely to draw England than someone who doesn't know the offside rule. That's why sweepstakes work across an entire office, not just the football fans.
        </p>
      </Section>

      <Section title="How many people can enter?">
        <p>
          With 48 teams in the 2026 World Cup, you can run a sweepstake for up to 48 people — one team each. With larger groups, participants can be assigned multiple teams, meaning more than one person can win based on who draws the eventual champions.
        </p>
        <p>
          Most office sweepstakes run with between 10 and 50 people. playdrawr handles any size group automatically — the draw assigns teams evenly across however many participants you add.
        </p>
      </Section>

      <Section title="Setting the entry fee">
        <p>
          The entry fee is entirely up to you. Most UK office sweepstakes run at £2–£5 per person. With 48 entries at £5, that's a £240 pot. You don't have to charge anything at all — many workplaces run a free sweepstake with a non-cash prize from the company.
        </p>
        <p>
          There's no right answer. The sweepstake works just as well with a £10 prize as with a £500 one — what makes it engaging is the shared stake in the tournament, not the amount of money.
        </p>
      </Section>

      <div className="bg-light rounded-2xl p-8 mb-10">
        <h2 className="font-heading text-2xl font-bold text-pitch tracking-tight mb-6">Step by step</h2>
        <div className="space-y-6">
          <Step num={1} title="Create your sweepstake">
            Go to playdrawr.co.uk and create a free account. Name your sweepstake — usually something like "[Company name] World Cup 2026" — and set your entry fee if you're collecting one. Takes under two minutes.
          </Step>
          <Step num={2} title="Add your participants">
            Add everyone's name. You can add email addresses too if you want playdrawr to send them their team assignment directly. With 48 World Cup nations, you can have up to 48 participants on the free plan — one team each.
          </Step>
          <Step num={3} title="Run the draw">
            Hit the draw button. playdrawr uses a cryptographically fair randomisation to assign all 48 World Cup teams across your participants. You can re-run the draw as many times as you like before confirming it.
          </Step>
          <Step num={4} title="Share the link">
            Once you confirm the draw, playdrawr generates a shareable link. Send it to everyone — they can see their assigned teams, the full group stage standings, the knockout bracket, and the live leaderboard. No login needed for participants.
          </Step>
          <Step num={5} title="Let the tournament do the rest">
            playdrawr updates automatically from live match data. Group stage standings, knockout results, and the leaderboard update as results come in — you don't need to do anything.
          </Step>
        </div>
      </div>

      <Section title="Tracking payments">
        <p>
          playdrawr has built-in payment tracking. Mark each participant as paid or unpaid with a single click. See the total pot collected and how much is still outstanding. No money moves through the platform — you collect however you normally would (cash, bank transfer, whatever works for your group) and playdrawr just helps you keep track of who's sorted and who still owes.
        </p>
      </Section>

      <Section title="The rules">
        <p>Keep the sweepstake rules simple:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>One entry fee per person, paid before the draw</li>
          <li>Teams are assigned randomly — no swaps or preferences</li>
          <li>Whoever's team wins the tournament wins the pot</li>
          <li>If a participant has multiple teams, their best-performing team counts</li>
        </ul>
        <p>
          playdrawr's leaderboard tracks points throughout the tournament (group stage wins, knockout progression, reaching the final, winning it) so you can follow who's ahead even before a winner is decided.
        </p>
      </Section>

      {/* CTA */}
      <div className="bg-pitch rounded-2xl p-8 text-center mt-12">
        <h2 className="font-heading text-2xl font-bold text-white mb-2">Ready to start?</h2>
        <p className="text-white/60 text-sm mb-6">Free for up to 48 participants. Takes three minutes.</p>
        <Link
          href="/signup"
          className="inline-block bg-lime text-pitch font-bold px-8 py-3 rounded-xl hover:bg-[#b8e03d] transition-colors"
        >
          Create your free sweepstake →
        </Link>
      </div>

      {/* Related */}
      <div className="mt-12 pt-8 border-t border-[#E5EDEA]">
        <p className="text-sm font-semibold text-pitch mb-3">Related guides</p>
        <ul className="space-y-2">
          {[
            { href: '/blog/sweepstake-rules', label: 'Sweepstake rules: how to run one fairly' },
            { href: '/blog/world-cup-2026-office-sweepstake', label: 'The complete office sweepstake guide' },
            { href: '/blog/sweepstake-prize-ideas', label: 'Sweepstake prize ideas beyond cash' },
          ].map(l => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-grass hover:underline">{l.label} →</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
