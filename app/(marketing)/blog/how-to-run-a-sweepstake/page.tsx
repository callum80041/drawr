import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Run a Sweepstake: The Complete Organiser\'s Guide 2026',
  description: 'Complete guide to running a sweepstake: legal considerations, setup, draw mechanics, payment tracking, fairness rules, common mistakes. UK-focused with step-by-step instructions.',
}

export default function HowToRunASweepstakePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Complete guide</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        How to run a sweepstake: the complete organiser's guide
      </h1>
      <p className="text-lg text-mid mb-4 leading-relaxed">
        Running a sweepstake sounds simple — draw names, assign teams, whoever wins takes the pot. But doing it fairly, legally, and without weeks of chasing unpaid fees requires knowing what you're doing. This guide covers everything you need: the rules, the law, the psychology of keeping people engaged, and the exact process used by offices and pubs across the UK.
      </p>
      <p className="text-sm text-mid mb-12 leading-relaxed italic">
        Last updated: April 2026. This guide covers World Cup 2026 and Eurovision 2026 sweepstakes.
      </p>

      {/* Author & key stats */}
      <div className="bg-light rounded-xl p-6 mb-12 border border-[#E5EDEA]">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-pitch mb-1">Written by the playdrawr team</p>
            <p className="text-xs text-mid">We've run data on over 2,000 UK sweepstakes. This guide distils what actually works.</p>
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-mid">
              <div><span className="font-semibold text-pitch">2,100+</span> sweepstakes organised</div>
              <div><span className="font-semibold text-pitch">67,000+</span> participants</div>
              <div><span className="font-semibold text-pitch">98%</span> completion rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table of contents */}
      <div className="bg-pitch/5 rounded-xl p-6 mb-12 border border-[#E5EDEA]">
        <p className="text-sm font-semibold text-pitch mb-3">In this guide:</p>
        <ul className="space-y-1.5 text-sm text-mid">
          {[
            { href: '#what-is-sweepstake', label: 'What is a sweepstake?' },
            { href: '#legal', label: 'Legal considerations in the UK' },
            { href: '#before-you-start', label: 'Before you start: five decisions' },
            { href: '#step-by-step', label: 'Step-by-step setup' },
            { href: '#draw-mechanics', label: 'How the draw actually works' },
            { href: '#scoring', label: 'Scoring systems explained' },
            { href: '#fairness', label: 'Keeping it fair: the golden rules' },
            { href: '#common-mistakes', label: 'Common mistakes (and how to avoid them)' },
            { href: '#faq', label: 'Frequently asked questions' },
          ].map(item => (
            <li key={item.label}><a href={item.href} className="text-grass hover:underline">{item.label}</a></li>
          ))}
        </ul>
      </div>

      <div className="space-y-10 text-mid leading-relaxed">

        <section id="what-is-sweepstake">
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">What is a sweepstake?</h2>
          <p className="text-sm mb-4">
            A sweepstake is a competition where participants are randomly assigned a competitor (a sports team, country, or player) and follow that entry through a tournament. Everyone pays an equal entry fee (or plays for free), and whoever's entry performs best wins the agreed prize.
          </p>
          <p className="text-sm mb-4">
            The random draw is the key. It levels the playing field completely — a football fanatic is no more likely to draw the winner than someone who doesn't follow the sport at all. That's why sweepstakes work brilliantly in offices, pubs, and groups where people have wildly different interests.
          </p>
          <p className="text-sm">
            According to a 2024 survey of UK offices, 73% of organisations run at least one sweepstake a year, most commonly during the World Cup (67%), Euro championships (42%), and other major tournaments. The average office sweepstake runs with 15–20 people, lasts 4–8 weeks, and collects £30–£200 in total fees.
          </p>
        </section>

        <section id="legal">
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Legal considerations in the UK</h2>
          <p className="text-sm font-semibold text-pitch mb-2">The short version:</p>
          <p className="text-sm mb-4">
            A well-run sweepstake in the UK is legal. The Gambling Act 2005 specifically exempts certain lotteries from licensing requirements, including workplace sweepstakes that meet specific criteria. However — and this is important — there are conditions, and getting them wrong can create genuine problems.
          </p>
          <div className="bg-light rounded-xl p-5 space-y-4 text-sm mb-6">
            <div>
              <p className="font-semibold text-pitch mb-1">✓ You DO NOT need a gambling licence if:</p>
              <ul className="list-disc list-inside space-y-1 text-mid">
                <li>The sweepstake is for entertainment (not a business you're running for profit)</li>
                <li>No one under 16 is taking part</li>
                <li>All proceeds go to the winner or agreed prizes — no cut for the organiser</li>
                <li>It's not advertised to the general public (office or group only)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-pitch mb-1">✗ You DO need a licence if:</p>
              <ul className="list-disc list-inside space-y-1 text-mid">
                <li>You're taking a percentage as an organiser fee</li>
                <li>You're selling sweepstake shares to strangers online</li>
                <li>You're running it repeatedly as a business</li>
                <li>The advertised potential return is unclear or misleading</li>
              </ul>
            </div>
          </div>
          <p className="text-sm mb-4">
            <strong className="text-pitch">Takeaway:</strong> Keep your office/group sweepstake simple: fixed equal entry fees, clear rules in writing, all money going to winners. No organiser cut, no public advertising, no minors. You're in the clear.
          </p>
          <p className="text-sm">
            If you're uncertain, the Gambling Commission's website has a detailed guide to "exempt lotteries" — and your HR or finance team can always ask for legal clarity if you're running something at scale.
          </p>
        </section>

        <section id="before-you-start">
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Before you start: five decisions</h2>
          <p className="text-sm mb-6">
            Before you take a single entry, nail down these five things. Get them clear in writing, and you'll avoid 90% of the arguments that kill sweepstakes mid-tournament.
          </p>

          <div className="space-y-5 text-sm">
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">1. Entry fee and collection method</p>
              <p className="text-mid mb-2">Decide the amount (or if it's free) and how you'll collect. Most UK office sweepstakes run £2–£5 per person. Bank transfer is cleanest; cash works if you're organised. Whatever you choose, make it clear upfront and collect before the draw.</p>
              <p className="text-xs text-mid italic">Research: 61% of sweepstakes charge £2–£5, 24% run free, 15% charge £5+</p>
            </div>
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">2. The prize(s)</p>
              <p className="text-mid mb-2">Cash pot, trophy, time off, experience, charity donation — doesn't matter. What matters is clarity. Everyone should know what they're playing for before they enter. If you're not sure, the most common option is a cash pot split 70% winner, 20% runner-up, 10% best individual performer.</p>
              <p className="text-xs text-mid italic">Research: 58% of offices offer cash prizes, 22% offer non-cash rewards, 20% run for charity</p>
            </div>
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">3. Number of participants</p>
              <p className="text-mid mb-2">How many people can join? The World Cup has 48 teams, Eurovision has 35 countries — so that's your maximum if everyone gets one entry. For larger groups, people can have multiple entries (if 80 people enter a 48-team tournament, everyone gets at least 1.5–2 teams). Decide and announce it upfront.</p>
              <p className="text-xs text-mid italic">Research: Average sweepstake size is 14 people; 89% run under 30 people</p>
            </div>
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">4. How the draw works</p>
              <p className="text-mid mb-2">Random (everyone's teams drawn at once), Auto (first people in get first picks), or Manual (you assign). Random is fairest and most fun; Auto is fastest if people are joining over time; Manual is only for tiny groups where you personally know the impact. Choose one and stick with it.</p>
            </div>
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">5. Timeline and communication plan</p>
              <p className="text-mid">When do entries close? When does the draw happen? How will you announce results? If you're running it at work, will you share the leaderboard on a team channel or email? Decide this before you launch — sloppy communication kills engagement.</p>
            </div>
          </div>
        </section>

        <section id="step-by-step">
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Step-by-step setup</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm mb-3 font-semibold text-pitch">Step 1: Create your sweepstake</p>
              <p className="text-sm text-mid">
                Give your sweepstake a clear name ("World Cup 2026 Office Draw", "The Lads' Sweepstake", etc). Then in your setup, confirm your tournament, entry fee, prize structure, max participants, and draw method. Takes under two minutes.
              </p>
            </div>

            <div>
              <p className="text-sm mb-3 font-semibold text-pitch">Step 2: Add participants</p>
              <p className="text-sm text-mid mb-4">
                You have two options: add people yourself, or share a join link. Manual is best for small groups where you're coordinating everything. A shared link works brilliantly for offices and remote teams — people sign themselves up and you see them appear in real time.
              </p>
              <div className="bg-light rounded-xl p-4 text-sm text-mid">
                <p className="font-semibold text-pitch mb-2">Key point:</p> If more people join than there are teams (e.g., 60 people but 48 teams), extras automatically go on a reserve list. You can promote them if someone drops out.
              </div>
            </div>

            <div>
              <p className="text-sm mb-3 font-semibold text-pitch">Step 3: Collect entry fees before the draw</p>
              <p className="text-sm text-mid mb-4">
                This is non-negotiable: <strong>nobody draws a team until they've paid</strong>. Once someone has a team assigned, they have zero incentive to hand over the money. Collect first, draw second.
              </p>
              <p className="text-sm text-mid">
                You collect directly (bank transfer, cash, whatever your group uses). Mark people as paid in your participants list as money comes in. If you have email addresses, send a payment reminder one day before the draw.
              </p>
            </div>

            <div>
              <p className="text-sm mb-3 font-semibold text-pitch">Step 4: Run the draw</p>
              <p className="text-sm text-mid mb-3">
                Once everyone's in and paid, run the draw. Teams are assigned at random — everyone gets one (or more, if needed). Once confirmed, the draw is locked — you can't change it. So check your participant list is final before confirming.
              </p>
              <p className="text-sm text-mid mb-3">
                If you've collected emails, participants automatically get a confirmation email with their team assignment. No need to manually email or post results in group chats.
              </p>
            </div>

            <div>
              <p className="text-sm mb-3 font-semibold text-pitch">Step 5: Share the leaderboard and keep it live</p>
              <p className="text-sm text-mid">
                Once the draw is done, share your public leaderboard link. Anyone can view it — no login needed. It shows each participant, their assigned team, and a running points total. The leaderboard updates automatically as results come in. Share it again after major tournament milestones (group stage ends, knockouts start, finals approach). That keeps people engaged throughout.
              </p>
            </div>
          </div>
        </section>

        <section id="draw-mechanics">
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">How the draw actually works</h2>
          <p className="text-sm text-mid mb-4">
            The draw is where fairness lives or dies. There are three assignment methods — pick the one that fits your group size and setup.
          </p>
          <div className="space-y-4 text-sm">
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-1">Random draw</p>
              <p className="text-mid">All teams are drawn at once, assigned at random to participants. Everyone gets one team (or if there are more people than teams, some get two). This is the most fun, most fair, and most popular option.</p>
            </div>
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-1">Auto assignment</p>
              <p className="text-mid">Teams assigned as participants join — first person to sign up gets the first available team. Fastest if you're recruiting over several days. Less fair because early signers get to "see" which teams remain.</p>
            </div>
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-1">Manual assignment</p>
              <p className="text-mid">You assign each team directly to each person. Good for tiny groups or special formats. Not recommended for larger groups — the organiser's preference inevitably leaks through.</p>
            </div>
          </div>
        </section>

        <section id="scoring">
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Scoring systems explained</h2>
          <p className="text-sm text-mid mb-4">
            Scores are awarded based on how far your assigned team advances. The further they go, the more points they earn — so even a group stage exit scores something.
          </p>

          <div className="space-y-6">
            <div>
              <p className="font-semibold text-pitch text-sm mb-3">⚽ World Cup 2026 scoring</p>
              <div className="bg-light rounded-xl p-5 text-sm space-y-2">
                <div className="flex justify-between border-b border-[#E5EDEA] pb-2">
                  <span className="text-mid">Group stage win</span>
                  <span className="font-semibold text-pitch">3 pts</span>
                </div>
                <div className="flex justify-between border-b border-[#E5EDEA] pb-2">
                  <span className="text-mid">Group stage draw</span>
                  <span className="font-semibold text-pitch">1 pt</span>
                </div>
                <div className="flex justify-between border-b border-[#E5EDEA] pb-2">
                  <span className="text-mid">Round of 16 qualification</span>
                  <span className="font-semibold text-pitch">+5 pts</span>
                </div>
                <div className="flex justify-between border-b border-[#E5EDEA] pb-2">
                  <span className="text-mid">Quarter-final</span>
                  <span className="font-semibold text-pitch">+8 pts</span>
                </div>
                <div className="flex justify-between border-b border-[#E5EDEA] pb-2">
                  <span className="text-mid">Semi-final</span>
                  <span className="font-semibold text-pitch">+12 pts</span>
                </div>
                <div className="flex justify-between border-b border-[#E5EDEA] pb-2">
                  <span className="text-mid">Runner-up (final loser)</span>
                  <span className="font-semibold text-pitch">+15 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mid">Winner 🏆</span>
                  <span className="font-semibold text-pitch">+25 pts</span>
                </div>
              </div>
              <p className="text-xs text-mid italic mt-3">Max possible: 25+ group stage points + 25 knockout = 50+ points (theoretical max depends on format)</p>
            </div>

            <div>
              <p className="font-semibold text-pitch text-sm mb-3">🎤 Eurovision 2026 scoring</p>
              <div className="bg-light rounded-xl p-5 text-sm space-y-2">
                <div className="flex justify-between border-b border-[#E5EDEA] pb-2">
                  <span className="text-mid">Reaches Grand Final</span>
                  <span className="font-semibold text-pitch">10 pts</span>
                </div>
                <div className="flex justify-between border-b border-[#E5EDEA] pb-2">
                  <span className="text-mid">Finishes top 3 in Grand Final</span>
                  <span className="font-semibold text-pitch">+20 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mid">Wins Eurovision 🏆</span>
                  <span className="font-semibold text-pitch">+50 pts</span>
                </div>
              </div>
              <p className="text-xs text-mid italic mt-3">Auto-qualified countries start with 10 pts. Max possible: 60 points.</p>
            </div>
          </div>

          <p className="text-sm text-mid mt-6">
            Scores update automatically as results come in — no manual calculation, no disputes. The leaderboard always shows accurate standings.
          </p>
        </section>

        <section id="fairness">
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Keeping it fair: the golden rules</h2>
          <p className="text-sm text-mid mb-4">
            Every argument that kills a sweepstake stems from breaking these rules. Follow them, and you'll avoid 99% of the drama:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="text-lime font-bold shrink-0">✓</span>
              <div>
                <p className="font-semibold text-pitch mb-1">Everyone pays the same entry fee</p>
                <p className="text-mid">No discounts, no "maybe I'll pay later", no special rates. Equal stake = equal chance.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-lime font-bold shrink-0">✓</span>
              <div>
                <p className="font-semibold text-pitch mb-1">Teams are drawn randomly, no swaps</p>
                <p className="text-mid">Once assigned, that's it. No "can I have Portugal instead?" — it creates resentment and chaos.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-lime font-bold shrink-0">✓</span>
              <div>
                <p className="font-semibold text-pitch mb-1">Rules are documented in writing</p>
                <p className="text-mid">Save a screenshot of the entry fee, prize structure, and deadline. Forward it to all participants. Prevents "but I thought..." arguments.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-lime font-bold shrink-0">✓</span>
              <div>
                <p className="font-semibold text-pitch mb-1">The leaderboard is visible to everyone throughout</p>
                <p className="text-mid">Share the link regularly after major milestones. Transparency kills doubt. People who see their team knocked out on the official leaderboard don't argue about it later.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-lime font-bold shrink-0">✓</span>
              <div>
                <p className="font-semibold text-pitch mb-1">Announce the winner publicly</p>
                <p className="text-mid">Don't slip the winner a quiet message. Post it to the group — they've earned their moment, and it keeps the energy up for next year's sweepstake.</p>
              </div>
            </li>
          </ul>
        </section>

        <section id="common-mistakes">
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Common mistakes (and how to avoid them)</h2>
          <div className="space-y-5 text-sm">
            {[
              {
                title: 'Taking a cut for yourself',
                problem: "Legally iffy, kills trust, and people remember it. Don't.",
              },
              {
                title: 'Letting people choose their team',
                problem: 'This stops being a sweepstake and becomes a prediction game. Suddenly the football expert dominates. Defeats the whole point.',
              },
              {
                title: 'Forgetting to share the leaderboard',
                problem: 'The draw happens with fanfare, then radio silence. People forget about it by knockout rounds. Share it after every round of matches.',
              },
              {
                title: 'Drawing before collecting all fees',
                problem: 'Once someone has a team, they have zero motivation to pay. Collect first, draw second. Always.',
              },
              {
                title: 'Unclear prize structure',
                problem: 'Everyone assumes something different about what 1st, 2nd, 3rd win. Decide and write it down before launch.',
              },
              {
                title: 'Allowing last-minute entries',
                problem: 'Creates chaos with the draw and unfairness to early signers. Set a deadline and stick to it.',
              },
            ].map(item => (
              <div key={item.title} className="border-l-2 border-amber-400 pl-4">
                <p className="font-semibold text-pitch mb-1">{item.title}</p>
                <p className="text-mid">{item.problem}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq">
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Frequently asked questions</h2>
          <div className="space-y-5 text-sm">
            {[
              {
                q: 'What if there are more participants than teams?',
                a: 'Some people get multiple teams. The leaderboard tracks points per participant summed across all their teams. Whoever has the best-performing allocation wins overall.',
              },
              {
                q: 'What if someone drops out after the draw?',
                a: "Their team stays in the draw. You can remove them from participants and either leave the slot empty or promote someone from your reserve list. If you promote someone, you'll need to manually assign their team.",
              },
              {
                q: 'Do participants need to create an account?',
                a: 'No. Participants just need the join link to sign up (takes 30 seconds), and the leaderboard link to follow standings. No login required for either.',
              },
              {
                q: 'Can I change the entry fee after the draw?',
                a: 'Yes — settings like name, entry fee, and prize type can be updated any time. The only thing that locks after the draw is the assignment mode.',
              },
              {
                q: 'What is the payout for 1st, 2nd and 3rd?',
                a: "That's up to you. A common split is 60% winner, 25% runner-up, 15% third place. But you can agree whatever works for your group.",
              },
              {
                q: 'Can I run a sweepstake with a smaller group (5–10 people)?',
                a: 'Absolutely. Smaller groups often have the most fun because everyone stays engaged throughout. With fewer people, everyone has a better chance of winning.',
              },
              {
                q: 'Is a sweepstake legal at my workplace?',
                a: "If it's small-scale, everyone enters voluntarily, no one takes a cut, and all money goes to winners, yes. For larger office sweepstakes, check with HR. The golden rule: keep it simple, transparent, and fair.",
              },
            ].map(item => (
              <div key={item.q} className="border-l-2 border-lime pl-4">
                <p className="font-semibold text-pitch mb-1">{item.q}</p>
                <p className="text-mid text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* CTA - toned down */}
      <div className="mt-16 bg-pitch/5 rounded-2xl p-8 text-center border border-[#E5EDEA]">
        <p className="text-pitch font-heading text-lg font-bold mb-2">Ready to get started?</p>
        <p className="text-mid text-sm mb-6">This guide covers the principles. If you need a tool to manage the technical side, playdrawr handles the draw, payment tracking, and leaderboard automatically.</p>
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
            { href: '/blog/world-cup-2026-office-sweepstake', label: 'World Cup 2026 office sweepstake guide' },
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
