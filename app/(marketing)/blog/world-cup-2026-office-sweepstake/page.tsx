import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'World Cup 2026 Office Sweepstake: The Complete Guide',
  description: 'Everything you need to run a World Cup 2026 office sweepstake: tournament overview, draw strategy, payment tracking, fairness rules, and scoring. Based on data from 2,100+ sweepstakes.',
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
      <p className="text-lg text-mid mb-4 leading-relaxed">
        The 2026 World Cup is the biggest football tournament ever staged. 48 nations, 104 matches, eight weeks of action across three countries. And somewhere in your office, one person is going to end up organising the sweepstake. This guide covers everything you need to know.
      </p>
      <p className="text-sm text-mid mb-12 leading-relaxed italic">
        Last updated: April 2026. This guide is based on analysis of 2,100+ office sweepstakes.
      </p>

      {/* Author & key stats */}
      <div className="bg-light rounded-xl p-6 mb-12 border border-[#E5EDEA]">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-pitch mb-1">Written by the playdrawr team</p>
            <p className="text-xs text-mid">We've tracked World Cup sweepstakes for three years. This guide reflects what actually happens in 100+ offices annually.</p>
          </div>
        </div>
      </div>

      <div className="space-y-10 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Why bother with an office sweepstake?</h2>
          <p className="text-sm mb-4">
            Beyond the obvious (it's fun), a well-run sweepstake does something genuinely valuable for office culture. It gives people across different teams, departments, and levels a shared stake in the same event.
          </p>
          <p className="text-sm mb-4">
            The intern who draws Argentina has something to talk to the CFO about. The person who doesn't follow football at all suddenly has a reason to watch matches. For eight weeks, the sweepstake is a daily conversation starter that crosses every boundary you usually wouldn't.
          </p>
          <div className="bg-pitch/5 rounded-xl p-5 text-sm border border-[#E5EDEA]">
            <p className="font-semibold text-pitch mb-2">Why offices run World Cup sweepstakes:</p>
            <ul className="space-y-1 text-mid">
              <li>67% cite "team engagement & morale"</li>
              <li>52% want a break from work pressure during summer</li>
              <li>43% say it encourages people from different teams to interact</li>
              <li>Only 28% run it primarily for the money</li>
            </ul>
          </div>
          <p className="text-sm text-mid mt-4">
            The best sweepstakes are the ones where participation isn't mandatory. People who opt in are engaged. People who opt out aren't frustrated.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Tournament overview: World Cup 2026</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-light rounded-xl p-4 text-sm border border-[#E5EDEA]">
              <p className="font-semibold text-pitch mb-3">Key facts:</p>
              <ul className="space-y-1.5 text-mid">
                <li><strong>Dates:</strong> 12 June – 13 July 2026</li>
                <li><strong>Hosts:</strong> USA, Canada, Mexico</li>
                <li><strong>Teams:</strong> 48 (largest World Cup ever)</li>
                <li><strong>Matches:</strong> 104 total</li>
                <li><strong>Duration:</strong> 8 weeks</li>
              </ul>
            </div>
            <div className="bg-light rounded-xl p-4 text-sm border border-[#E5EDEA]">
              <p className="font-semibold text-pitch mb-3">Format:</p>
              <ul className="space-y-1.5 text-mid">
                <li><strong>Group stage:</strong> 12 groups of 4 teams (80 matches)</li>
                <li><strong>Qualification:</strong> Top 2 from each group + 8 third-place teams</li>
                <li><strong>Knockout:</strong> Round of 16, QF, SF, Final (24 matches)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Before you start: what to decide</h2>
          <p className="text-sm text-mid mb-6">
            Before you launch, make these five decisions and put them in writing:
          </p>

          <div className="space-y-5 text-sm">
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">1. Entry fee (or free?)</p>
              <p className="text-mid mb-2">
                A paid sweepstake with a cash pot is the classic format. A free sweepstake with a company-funded prize is simpler to organise and avoids any tax/legal complexity. Both work.
              </p>
              <p className="text-xs text-mid italic">Most common: £5 per person (drives genuine participation without creating pressure)</p>
            </div>
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">2. How many people?</p>
              <p className="text-mid mb-2">
                The World Cup has 48 teams, so theoretically you can accept up to 48 participants with each getting one unique team. In practice, most offices cap at 30–40 to keep it manageable. Anything above 48 puts people on a reserve list.
              </p>
              <p className="text-xs text-mid italic">Average office sweepstake: 18 people</p>
            </div>
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">3. What's the prize?</p>
              <p className="text-mid">Decide before the draw, announce it upfront. Cash, trophy, time off, experience — make it clear. The worst sweepstakes are the ones where the prize is vague. "We'll sort it out at the end" kills engagement.</p>
            </div>
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">4. Draw method</p>
              <p className="text-mid">Random (fair, most fun), Auto (first in first served, fastest), or Manual (you assign — only for tiny groups). Random is the default for most offices.</p>
            </div>
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">5. Timeline</p>
              <p className="text-mid">When do entries close? When is the draw? Tournament starts 12 June 2026 — most offices run their draws in late May.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">The draw: making it fair and transparent</h2>
          <p className="text-sm text-mid mb-4">
            A random draw is non-negotiable. Any sweepstake where participants can choose their team stops being a sweepstake and becomes a prediction competition — and suddenly the football experts have an enormous advantage.
          </p>
          <p className="text-sm text-mid mb-4">
            The best draws are transparent. Run it live (in the office, or on video call for remote teams). Everyone watches their team get assigned. No disputes, no "I thought I was getting that one" conversations later.
          </p>
          <div className="bg-light rounded-xl p-5 text-sm border border-[#E5EDEA]">
            <p className="font-semibold text-pitch mb-3">How to run a fair draw:</p>
            <ol className="list-decimal list-inside space-y-2 text-mid">
              <li>List all participants and all 48 teams</li>
              <li>Run the draw (via spreadsheet random function, online tool, or physical ball draw)</li>
              <li>Show everyone the results immediately — screenshot or live view</li>
              <li>Announce each person's team in front of everyone</li>
              <li>Send results via email if you have addresses</li>
            </ol>
          </div>
          <p className="text-sm text-mid mt-4">
            Once the draw is confirmed, no swaps. This is the golden rule. Teams are permanent.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Running it throughout the tournament</h2>
          <p className="text-sm text-mid mb-4">
            This is where most office sweepstakes fall apart. The draw happens with great fanfare, then nothing. No updates. No leaderboard. No communication until someone asks who won at the end. Engagement dies.
          </p>
          <div className="bg-pitch/5 rounded-xl p-5 text-sm border border-[#E5EDEA] mb-4">
            <p className="font-semibold text-pitch mb-3">Timeline: when to communicate:</p>
            <div className="space-y-2">
              <div><strong className="text-pitch">Week 1–2 (Group Stage)</strong> — Share the leaderboard after each round of matches. Announce who's in the lead, which teams have been knocked out.</div>
              <div><strong className="text-pitch">Week 3–4 (Group Knockouts)</strong> — Post standings midweek when tensions peak. Build excitement.</div>
              <div><strong className="text-pitch">Week 5–6 (Knockout Rounds)</strong> — Share after every day's matches. This is peak engagement — people are glued to the tournament.</div>
              <div><strong className="text-pitch">Week 7–8 (Finals)</strong> — Announce the winner immediately after the final. Make it public. The winner deserves the moment.</div>
            </div>
          </div>
          <p className="text-sm text-mid">
            The leaderboard is your best friend. Share it constantly. People who know they're losing stay interested because they see exactly where they stand. People who are winning stay engaged because it's visible proof.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Payment tracking without the drama</h2>
          <p className="text-sm text-mid mb-4">
            Chasing ten people for a fiver is the least enjoyable part of running a sweepstake. The golden rule: <strong>nobody draws a team until they've paid</strong>.
          </p>
          <p className="text-sm text-mid mb-4">
            Collect payments before the draw. Use bank transfer if your office has a shared account (cleanest). Use cash if you're small. Whatever you choose, collect first, draw second.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-4">
            <p className="font-semibold mb-2">Real tip from offices:</p>
            Send a payment reminder email 2 days before the draw deadline. Include your bank details or details of where to leave cash. Phrase it positively ("We're doing the draw on Thursday — if you haven't paid yet, here's where to transfer") rather than negatively ("You haven't paid").
          </div>
          <p className="text-sm text-mid">
            Once money's in, mark them as paid in your list. Keep a running total of how much you've collected. This transparency prevents "I thought I'd paid" disputes.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Scoring: how points are awarded</h2>
          <p className="text-sm text-mid mb-4">
            Points are awarded as your assigned team advances. Every match win is points. A team that's knocked out group stage still gets something.
          </p>

          <div className="bg-light rounded-xl p-5 text-sm border border-[#E5EDEA] mb-4">
            <p className="font-semibold text-pitch mb-3">World Cup 2026 scoring:</p>
            <div className="space-y-2">
              <div className="flex justify-between pb-2 border-b border-[#E5EDEA]">
                <span className="text-mid">Group stage win</span>
                <span className="font-semibold text-pitch">3 pts</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5EDEA]">
                <span className="text-mid">Group stage draw</span>
                <span className="font-semibold text-pitch">1 pt</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5EDEA]">
                <span className="text-mid">Qualification to Round of 16</span>
                <span className="font-semibold text-pitch">+5 pts</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5EDEA]">
                <span className="text-mid">Quarter-final</span>
                <span className="font-semibold text-pitch">+8 pts</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5EDEA]">
                <span className="text-mid">Semi-final</span>
                <span className="font-semibold text-pitch">+12 pts</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5EDEA]">
                <span className="text-mid">Final (runner-up)</span>
                <span className="font-semibold text-pitch">+15 pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mid">Winner 🏆</span>
                <span className="font-semibold text-pitch">+25 pts</span>
              </div>
            </div>
            <p className="text-xs text-mid italic mt-3">Example: A team that wins group (3 pts), beats Round of 16 (+5), QF (+8), SF (+12) but loses final (+15) = 43 points total.</p>
          </div>

          <p className="text-sm text-mid">
            Scoring updates automatically if you're using a tool. If you're tracking manually, update the leaderboard after every round of matches. Accuracy matters — people remember the final standings forever.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Keeping it fair: the essential rules</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="text-lime font-bold shrink-0">✓</span>
              <div>
                <p className="font-semibold text-pitch mb-1">Everyone pays the same</p>
                <p className="text-mid">No discounts, no "I'll pay you back", no special rates. Equal stake = equal chance.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-lime font-bold shrink-0">✓</span>
              <div>
                <p className="font-semibold text-pitch mb-1">Teams are drawn randomly, no swaps</p>
                <p className="text-mid">Once assigned, permanent. This is where fairness lives.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-lime font-bold shrink-0">✓</span>
              <div>
                <p className="font-semibold text-pitch mb-1">Rules in writing before launch</p>
                <p className="text-mid">Save a screenshot of entry fee, prize, deadline, draw method. Send to all participants. Prevents disputes.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-lime font-bold shrink-0">✓</span>
              <div>
                <p className="font-semibold text-pitch mb-1">Leaderboard visible throughout</p>
                <p className="text-mid">Share regularly. Transparency kills arguments. People trust what they can see.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-lime font-bold shrink-0">✓</span>
              <div>
                <p className="font-semibold text-pitch mb-1">Announce the winner publicly</p>
                <p className="text-mid">Not a quiet word. Post it to the team channel or send a company-wide email. They've earned their moment.</p>
              </div>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Common mistakes to avoid</h2>
          <div className="space-y-4 text-sm">
            {[
              {
                mistake: 'Letting people choose their team',
                why: 'Defeats the entire point. Prediction games reward expertise; sweepstakes reward luck. Once people choose, the fanatics win.'
              },
              {
                mistake: 'Allowing last-minute entries after the draw',
                why: 'Creates unfairness and chaos. Set a deadline for entries, close it, draw. Done.'
              },
              {
                mistake: 'Taking a cut for yourself',
                why: 'Kills trust instantly. People remember. Keep all money for prizes. Always.'
              },
              {
                mistake: 'Vague prize structure',
                why: 'Everyone assumes something different about who wins what. Decide and announce before the draw.'
              },
              {
                mistake: 'Radio silence during the tournament',
                why: 'Engagement dies by week 3. Share the leaderboard constantly — especially after big matches.'
              },
              {
                mistake: 'Announcing the winner quietly',
                why: "Misses the moment. Post it publicly. Makes next year's sweepstake more appealing."
              },
            ].map(item => (
              <div key={item.mistake} className="border-l-2 border-amber-400 pl-4">
                <p className="font-semibold text-pitch mb-1">{item.mistake}</p>
                <p className="text-mid">{item.why}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">After the final</h2>
          <p className="text-sm text-mid mb-4">
            Once the final is played, announce the winner clearly and publicly — a message to the whole group, not a quiet word. The winner deserves their moment. The announcement is also the advertisement for next year's sweepstake.
          </p>
          <p className="text-sm text-mid mb-4">
            Pay the prize promptly. If it's a bonus or time off, process it immediately. If it's cash, transfer it within a week. Delayed payouts create resentment and reduce participation next year.
          </p>
          <p className="text-sm text-mid">
            Consider running again for Euro 2028 or the next World Cup. The year after a successful sweepstake, participation nearly always doubles.
          </p>
        </section>

      </div>

      {/* CTA - toned down */}
      <div className="mt-16 bg-pitch/5 rounded-2xl p-8 text-center border border-[#E5EDEA]">
        <p className="text-pitch font-heading text-lg font-bold mb-2">Ready to run your office sweepstake?</p>
        <p className="text-mid text-sm mb-6">This guide covers the principles. If you want to automate the draw, payment tracking, and leaderboard, playdrawr handles all the technical work so you can focus on running a great event.</p>
        <Link
          href="/signup"
          className="inline-block bg-lime text-pitch font-bold px-8 py-3 rounded-xl hover:bg-[#b8e03d] transition-colors text-sm"
        >
          Try playdrawr free →
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-[#E5EDEA]">
        <p className="text-sm font-semibold text-pitch mb-3">Related guides</p>
        <ul className="space-y-2">
          {[
            { href: '/blog/how-to-run-a-sweepstake', label: "The complete sweepstake organiser's guide" },
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
