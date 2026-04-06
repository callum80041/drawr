import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'World Cup 2026 Teams: All 48 Nations | playdrawr',
  description: 'All 48 teams in the 2026 World Cup — group stage draw, key players, and which nations are favourites to win your sweepstake pot. Updated throughout the tournament.',
}

export default function TeamGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Teams guide</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        World Cup 2026: all 48 teams and what they mean for your sweepstake
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        The 2026 World Cup is the biggest in history. For the first time, 48 nations are competing — up from 32 in previous tournaments — which means more matches, more upsets, and more sweepstake drama.
      </p>

      <div className="space-y-8 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Why 48 teams changes everything for sweepstakes</h2>
          <p>A 32-team World Cup means a lot of sweepstake participants drawing relative unknowns and having little reason to watch. With 48 nations, the field is bigger but the top-heavy nature of international football means there are still clear favourites, mid-tier genuine contenders, and long shots — which creates a much more interesting sweepstake spread.</p>
          <p>More teams also means more people can have a team each. A 48-person sweepstake — the maximum on playdrawr&apos;s free plan — gives every participant one nation. At a 20-person office, each person gets two teams on average, increasing the chance that someone in your sweepstake has a genuine contender.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">The favourites — dream draws</h2>
          <p>These are the teams every sweepstake participant wants to draw. If you land one of these, expect the office to envy you immediately.</p>
          <div className="space-y-3 mt-4">
            {[
              { name: 'France', desc: 'Arguably the most complete squad in the tournament. Strong throughout the pitch, experienced in knockout football, and perpetual World Cup contenders since their 2018 triumph.' },
              { name: 'England', desc: 'Co-hosting nations often have a tournament boost, and England have been building consistently. Drawing the Three Lions in a UK office sweepstake generates instant noise.' },
              { name: 'Brazil', desc: 'The most decorated football nation in history. Always dangerous, always a conversation starter, always a crowd-pleaser when their name is drawn.' },
              { name: 'Argentina', desc: 'Reigning world champions. Drawing Argentina might be the highest-value ticket in any 2026 sweepstake.' },
              { name: 'Spain', desc: 'Technical, consistent, and perennial contenders. A smart draw for anyone who likes an each-way bet on tournament football.' },
              { name: 'Germany', desc: 'Rebuilding but dangerous, with the depth to go deep in any knockout tournament.' },
            ].map(t => (
              <div key={t.name} className="bg-light rounded-xl p-4">
                <p className="font-semibold text-pitch mb-1">{t.name}</p>
                <p className="text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">The mid-tier — interesting draws</h2>
          <p>These nations won&apos;t win outright but could surprise, go deep in the knockout rounds, and keep their sweepstake owner engaged well into July.</p>
          <p className="text-sm bg-light rounded-xl p-4">
            Portugal, Netherlands, Belgium, Uruguay, Colombia, Morocco, Japan, USA (as hosts), Mexico (as hosts), Canada (as hosts), Croatia, Denmark, Switzerland, Senegal, South Korea, Australia.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">The long shots — sweepstake wildcards</h2>
          <p>Every great sweepstake has someone drawing a team with a 100/1 chance of winning — and every tournament throws up an underdog story. These are the nations that keep the sweepstake alive for people who&apos;d otherwise have nothing to watch after the group stage.</p>
          <p className="text-sm bg-light rounded-xl p-4">
            Ecuador, Chile, Iran, Saudi Arabia, Ghana, Nigeria, Cameroon, Tunisia, Algeria, Turkey, Ukraine, Poland, Serbia, Romania, Czech Republic, Slovakia, Scotland, Wales, Costa Rica, Panama, New Zealand.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">The host nation advantage</h2>
          <p>The 2026 World Cup is co-hosted by the USA, Mexico, and Canada — all three nations qualify automatically. Home crowds, home altitude in some Mexican venues, and the patriotic fervour that comes with a home tournament make all three worth more than their seedings suggest.</p>
          <p>Drawing the USA, Mexico, or Canada is a solid sweepstake ticket. None are favourites but all three could be dangerous in the knockout rounds.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Which team should you hope to draw?</h2>
          <p>Honestly, this is the beauty of the sweepstake — you don&apos;t get to choose. But if you want to know what makes a good draw: any team from the top 20 FIFA rankings gives you a genuine chance of staying relevant into the knockout rounds. Any team from the top 10 is a proper sweepstake contender.</p>
          <p>And then there&apos;s the chaos factor — the tournament always produces a surprise semi-finalist. In 2022 it was Morocco. In 2018 it was Croatia. In 2026 it&apos;ll be someone nobody expected. That&apos;s the draw that wins the pub sweepstake.</p>
        </section>

      </div>

      <div className="bg-pitch rounded-2xl p-8 text-center mt-12">
        <h2 className="font-heading text-2xl font-bold text-white mb-2">Track your team throughout the tournament</h2>
        <p className="text-white/60 text-sm mb-6">Once you&apos;ve run your draw on playdrawr, every participant gets a live leaderboard tracking their team&apos;s progress.</p>
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
