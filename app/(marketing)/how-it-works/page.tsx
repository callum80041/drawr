import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Run a Sweepstake | playdrawr',
  description: 'Run a World Cup 2026 or Eurovision 2026 sweepstake in minutes. Random draw, live leaderboard, automatic scoring — shared with one link. Free for up to 48 people.',
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
        How to run a sweepstake (the easy way)
      </h1>
      <p className="text-lg text-mid mb-10 leading-relaxed">
        Whether it&apos;s the World Cup or Eurovision, every office, pub, and group chat loves a sweepstake. But running one properly — fairly assigning teams or countries, tracking the standings, chasing payments, keeping the leaderboard updated — is more work than it looks. Here&apos;s how to do it right.
      </p>

      {/* Tournament cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="rounded-xl border border-[#E5EDEA] bg-light p-5">
          <p className="text-xl mb-2">⚽</p>
          <p className="font-heading font-bold text-pitch mb-1">FIFA World Cup 2026</p>
          <p className="text-sm text-mid leading-relaxed">USA, Canada &amp; Mexico · June–July 2026 · 48 teams · Group stage + knockout rounds</p>
          <Link href="/worldcup" className="inline-block mt-3 text-xs font-semibold text-grass hover:underline">World Cup sweepstake guide →</Link>
        </div>
        <div className="rounded-xl border border-[#E5EDEA] bg-light p-5">
          <p className="text-xl mb-2">🎤</p>
          <p className="font-heading font-bold text-pitch mb-1">Eurovision Song Contest 2026</p>
          <p className="text-sm text-mid leading-relaxed">Vienna, Austria · 13–17 May 2026 · 35 countries · Semi-finals + Grand Final</p>
          <Link href="/eurovision" className="inline-block mt-3 text-xs font-semibold text-grass hover:underline">Eurovision sweepstake guide →</Link>
        </div>
      </div>

      <Section title="What is a sweepstake?">
        <p>
          A sweepstake is a competition where participants are randomly assigned a competitor — a team or a country — and then follow that entry through the tournament. Everyone pays an equal entry fee (or it runs for free), and whoever is assigned the winner at the end takes the pot.
        </p>
        <p>
          The random draw is the whole point. It levels the playing field completely — a die-hard fan is no more likely to draw the winner than someone who barely follows the competition. That&apos;s why sweepstakes work across an entire office, not just the enthusiasts.
        </p>
      </Section>

      <Section title="How many people can enter?">
        <p>
          It depends on the tournament. The World Cup has 48 teams and Eurovision has 35 countries — so you can run a sweepstake for up to that many people with one entry each. With larger groups, participants can be assigned multiple entries, so more than one person can win.
        </p>
        <p>
          Most sweepstakes run with between 10 and 50 people. playdrawr handles any group size automatically — the draw assigns teams or countries evenly across however many participants you add.
        </p>
      </Section>

      <Section title="Setting the entry fee">
        <p>
          The entry fee is entirely up to you. Most UK office sweepstakes run at £2–£5 per person. There&apos;s no right answer — the sweepstake works just as well with a token prize as with a bigger pot. What makes it engaging is the shared stake in the tournament, not the money.
        </p>
        <p>
          You can also run it completely free — many workplaces do a non-cash prize or just bragging rights.
        </p>
      </Section>

      <div className="bg-light rounded-2xl p-8 mb-10">
        <h2 className="font-heading text-2xl font-bold text-pitch tracking-tight mb-6">Step by step</h2>
        <div className="space-y-6">
          <Step num={1} title="Create your sweepstake">
            Go to playdrawr.co.uk and create a free account. Choose your tournament — World Cup or Eurovision — name your sweepstake, and set an entry fee if you&apos;re collecting one. Takes under two minutes.
          </Step>
          <Step num={2} title="Add your participants">
            Add everyone by name. You can add email addresses too if you want playdrawr to send them their assignment directly. The free plan supports up to 48 participants — anyone beyond that joins a reserve list automatically.
          </Step>
          <Step num={3} title="Run the draw">
            Hit the draw button. playdrawr randomly assigns all teams or countries across your participants. You can re-run as many times as you like before confirming — once confirmed, assignments are locked.
          </Step>
          <Step num={4} title="Share the link">
            Once you confirm the draw, playdrawr generates a shareable leaderboard link. Send it to everyone — they can see their assignment and the live standings. No login needed for participants.
          </Step>
          <Step num={5} title="Let the tournament do the rest">
            playdrawr updates automatically from live results. Standings and the leaderboard update as results come in — you don&apos;t need to do anything.
          </Step>
        </div>
      </div>

      {/* Scoring section */}
      <Section title="How scoring works">
        <p>Points are awarded automatically as the tournament progresses. Each tournament has its own system:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          <div className="rounded-xl border border-[#E5EDEA] overflow-hidden text-sm">
            <div className="bg-pitch px-4 py-2.5 flex items-center gap-2">
              <span>⚽</span>
              <span className="font-semibold text-white">World Cup</span>
            </div>
            <ul className="divide-y divide-[#E5EDEA]">
              {[
                ['Group win', '3 pts'], ['Group draw', '1 pt'],
                ['Round of 16', '+5 pts'], ['Quarter-final', '+8 pts'],
                ['Semi-final', '+12 pts'], ['Runner-up', '+15 pts'], ['Winner 🏆', '+25 pts'],
              ].map(([label, pts]) => (
                <li key={label} className="flex justify-between px-4 py-2 text-mid">
                  <span>{label}</span><span className="font-semibold text-pitch">{pts}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[#E5EDEA] overflow-hidden text-sm">
            <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: '#1B0744' }}>
              <span>🎤</span>
              <span className="font-semibold text-white">Eurovision</span>
            </div>
            <ul className="divide-y divide-[#E5EDEA]">
              {[
                ['Reaches Grand Final', '10 pts'],
                ['Finishes top 3', '+20 pts'],
                ['Wins Eurovision 🏆', '+50 pts'],
              ].map(([label, pts]) => (
                <li key={label} className="flex justify-between px-4 py-2 text-mid">
                  <span>{label}</span><span className="font-semibold text-pitch">{pts}</span>
                </li>
              ))}
              <li className="px-4 py-2 bg-[#F5F0FF]">
                <span className="text-xs text-mid">Auto-qualified countries start with 10 pts. Max: 60 pts.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Tracking payments">
        <p>
          playdrawr has built-in payment tracking. Mark each participant as paid or unpaid with a single click. See the total pot collected and how much is still outstanding. No money moves through the platform — you collect however you normally would, and playdrawr just helps you keep track of who&apos;s sorted and who still owes.
        </p>
      </Section>

      <Section title="The rules">
        <p>Keep it simple:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>One entry fee per person, paid before the draw</li>
          <li>Teams or countries are assigned randomly — no swaps or preferences</li>
          <li>Whoever&apos;s entry wins the tournament wins the pot</li>
          <li>If a participant has multiple entries, their best-performing one counts</li>
        </ul>
        <p>
          playdrawr&apos;s leaderboard tracks points throughout so you can follow who&apos;s ahead even before a winner is decided.
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
            { href: '/blog/eurovision-sweepstake-guide', label: 'The complete Eurovision sweepstake guide' },
            { href: '/blog/world-cup-2026-office-sweepstake', label: 'The complete World Cup office sweepstake guide' },
            { href: '/blog/sweepstake-rules', label: 'Sweepstake rules: how to run one fairly' },
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
