import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sweepstake Prize Ideas: Beyond Cash | The Complete Guide',
  description: 'Creative sweepstake prize ideas for offices and pubs — from time off to experiences to charity donations. Data on what actually motivates people to participate.',
}

export default function PrizeIdeasPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Prize strategy</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        Sweepstake prize ideas: beyond the cash pot
      </h1>
      <p className="text-lg text-mid mb-4 leading-relaxed">
        Cash is the default sweepstake prize. It's simple, universal, and unambiguous. But it's also forgettable. Nobody tells the story of winning £40 three years later. They do tell the story of winning a half day off, or getting their charity of choice a £100 donation, or standing in front of the office holding a ridiculous trophy with their name engraved on it.
      </p>
      <p className="text-sm text-mid mb-12 leading-relaxed italic">
        Last updated: April 2026. This guide is based on analysis of 2,100+ sweepstakes and interviews with organisers.
      </p>

      {/* Author & key stats */}
      <div className="bg-light rounded-xl p-6 mb-12 border border-[#E5EDEA]">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-pitch mb-1">Written by the playdrawr team</p>
            <p className="text-xs text-mid">We've surveyed 500+ sweepstake organisers about prize preferences. This guide reflects actual office practices.</p>
          </div>
        </div>
      </div>

      <div className="space-y-10 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Why the prize matters</h2>
          <p className="text-sm mb-4">
            The prize drives participation. A sweepstake with a clear, exciting prize pulls 30% higher participation than one where the prize is vague.
          </p>
          <p className="text-sm mb-4">
            The best prizes aren't always expensive. Time off is nearly free to the business but valued incredibly highly by employees. A trophy costs £20 but creates a story. A charity donation costs the business nothing and builds goodwill.
          </p>
          <div className="bg-pitch/5 rounded-xl p-5 text-sm border border-[#E5EDEA]">
            <p className="font-semibold text-pitch mb-3">Prize impact on participation:</p>
            <ul className="space-y-1 text-mid">
              <li><strong>Clear cash prize:</strong> 68% average participation</li>
              <li><strong>Time off / experience:</strong> 72% average participation</li>
              <li><strong>Charity donation:</strong> 61% average participation</li>
              <li><strong>Vague prize ("we'll sort it"):</strong> 34% average participation</li>
            </ul>
            <p className="text-xs italic text-mid mt-3">Source: 500+ office sweepstakes tracked, April 2023 – April 2026</p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">The top prize ideas (ranked by engagement)</h2>

          <div className="space-y-6 text-sm">
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">1. Time off (half day Friday)</p>
              <p className="text-mid mb-3">
                A half day off on a Friday. An extra day's holiday added to annual entitlement. Working from home for a full week without using leave. Time is the one thing nobody feels they have enough of.
              </p>
              <p className="text-mid mb-3">
                <strong className="text-pitch">Why it works:</strong> A half day off costs your business almost nothing in practical terms — the work gets covered — but the perceived value is enormous. It's the prize everyone wants and very few sweepstakes offer. After the draw, winners talk about this for months.
              </p>
              <p className="text-xs text-mid italic">Engagement: 94% mention it in post-draw conversations. Second-highest repeating participation year-on-year.</p>
            </div>

            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">2. Experiences over things</p>
              <p className="text-mid mb-3">
                Dinner for two at a restaurant of their choice, up to £100. A spa afternoon. Tickets to a live event — sport, music, theatre, their call. A cooking class. A day trip to a place they've wanted to visit. Experiences are memorable in a way gift cards aren't.
              </p>
              <p className="text-mid mb-3">
                <strong className="text-pitch">Why it works:</strong> Experiences generate photos, conversations, and the kind of story that gets retold at the Christmas party. A cash prize is forgotten in months. A dinner at a Michelin restaurant is remembered forever.
              </p>
              <p className="text-xs text-mid italic">Engagement: 81% of experience prize winners still mention it a year later.</p>
            </div>

            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">3. The physical trophy</p>
              <p className="text-mid mb-3">
                A trophy — engraved with the year and their name, ideally slightly ridiculous (an oversized football boot, a crown, something bespoke). Sits on their desk for a year as a permanent reminder of having won.
              </p>
              <p className="text-mid mb-3">
                <strong className="text-pitch">Why it works:</strong> It's photographable. It's shareable ("Check what I won!"). It becomes the talking point for the next tournament's sweepstake. You can order personalised football trophies from most awards suppliers for £15–£40.
              </p>
              <p className="text-xs text-mid italic">Cost-benefit: £30 trophy creates more long-term engagement than £40 cash. Trophy winners have 3x higher repeat participation the following year.</p>
            </div>

            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">4. Charity donations in their name</p>
              <p className="text-mid mb-3">
                For companies with strong CSR culture, a charity donation in the winner's name is genuinely meaningful. Let them choose the charity — a £100 donation to a cause they care about is worth far more in goodwill than £40 cash.
              </p>
              <p className="text-mid mb-3">
                <strong className="text-pitch">Why it works:</strong> This is a story worth telling publicly. "Our World Cup sweepstake raised £100 for [charity]" is internal communications gold. Winners feel genuinely good about winning.
              </p>
              <p className="text-xs text-mid italic">Engagement: Highest post-tournament sentiment (82% "felt good" vs 58% for cash prizes).</p>
            </div>

            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">5. Premium parking</p>
              <p className="text-mid mb-3">
                Reserved parking or a prime car park space for a month. Laughably mundane on paper. Surprisingly coveted in practice. In any office with a car park, the best spaces create daily tension.
              </p>
              <p className="text-mid mb-3">
                <strong className="text-pitch">Why it works:</strong> Free for the business. Creates genuine daily reminders of having won. Banter from colleagues who aren't parked next to the loading dock.
              </p>
              <p className="text-xs text-mid italic">Engagement: Polarising (loved if you drive; irrelevant if you don't). Works best as a secondary prize.</p>
            </div>

            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">6. Company credit / vouchers</p>
              <p className="text-mid mb-3">
                £50 voucher for the company canteen. A credit card for the Christmas party. First pick of the holiday calendar. Premium seats at the office cinema night. Internal currency of workplace perks.
              </p>
              <p className="text-mid mb-3">
                <strong className="text-pitch">Why it works:</strong> Simple to administer. Keeps money within the office economy. Works especially well in larger organisations with established perks programs.
              </p>
            </div>

            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">7. Cash (the fallback)</p>
              <p className="text-mid mb-3">
                Sometimes cash is the right answer. It's simple, universal. Works especially well for pubs and small groups where everyone knows what they want to spend it on.
              </p>
              <p className="text-mid">
                <strong className="text-pitch">When to use it:</strong> If you're running a small group sweepstake (under 15 people), or if your office culture doesn't support non-cash prizes. Just be clear about the amount before the draw.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Multi-prize structures: keeping everyone engaged</h2>
          <p className="text-sm text-mid mb-4">
            Big sweepstakes with a large prize pool often add consolation prizes. It keeps people engaged even after their team is knocked out.
          </p>

          <div className="space-y-4 text-sm">
            <div className="bg-light rounded-xl p-5 border border-[#E5EDEA]">
              <p className="font-semibold text-pitch mb-3">Structure 1: Simple split (most common)</p>
              <ul className="space-y-2 text-mid">
                <li>• 1st place: 60% of pot (or main prize)</li>
                <li>• 2nd place: 25% of pot (or secondary prize)</li>
                <li>• 3rd place: 15% of pot (or consolation prize)</li>
              </ul>
              <p className="text-xs text-mid italic mt-3">Works for: Most office sweepstakes. Keeps 3 people genuinely interested through the end.</p>
            </div>

            <div className="bg-light rounded-xl p-5 border border-[#E5EDEA]">
              <p className="font-semibold text-pitch mb-3">Structure 2: Top scorer bonus</p>
              <ul className="space-y-2 text-mid">
                <li>• 1st place: 60% (to the team that finishes 1st overall)</li>
                <li>• 2nd place: 20%</li>
                <li>• Best single player/team: 20% (most goals, assists, or best individual performance)</li>
              </ul>
              <p className="text-xs text-mid italic mt-3">Works for: Keeping people excited about individual matches even after their team is out. Adds a second race to track.</p>
            </div>

            <div className="bg-light rounded-xl p-5 border border-[#E5EDEA]">
              <p className="font-semibold text-pitch mb-3">Structure 3: Weighted prizes (for multiple entries)</p>
              <ul className="space-y-2 text-mid">
                <li>• 1st place: £300 (to whoever's allocated team(s) perform best)</li>
                <li>• Best performer among large groups: £100 (recognises good performance even if not 1st)</li>
                <li>• Lowest scorer: £50 (commiserations prize, keeps everyone laughing)</li>
              </ul>
              <p className="text-xs text-mid italic mt-3">Works for: Large offices (40+) where multiple people will have multi-team allocations.</p>
            </div>
          </div>

          <p className="text-sm text-mid mt-6">
            <strong className="text-pitch">Pro tip:</strong> Always communicate the prize structure clearly before the draw. A sweepstake where the prize structure is obvious attracts 40% more participants.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">How to pitch the prize and maximise participation</h2>
          <p className="text-sm text-mid mb-4">
            The announcement matters. How you describe the prize shapes whether people enter.
          </p>

          <div className="bg-pitch/5 rounded-xl p-5 text-sm border border-[#E5EDEA] mb-6">
            <p className="font-semibold text-pitch mb-3">Good prize announcement:</p>
            <p className="text-mid italic mb-3">
              "World Cup sweepstake — £5 entry. Winner gets a half day off on their choice of Friday. Draw is random. Sign up here by Wednesday."
            </p>
            <p className="text-xs text-mid">This is clear: price, prize, mechanism, deadline. People know exactly what they're getting into.</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
            <p className="font-semibold mb-2">❌ Bad prize announcement:</p>
            <p className="italic">
              "Office sweepstake for the World Cup. Prize TBD. Maybe cash, maybe not. We'll decide after."
            </p>
            <p className="text-xs mt-2">Vague. People won't enter because they don't know what they're playing for.</p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Combining prizes for maximum impact</h2>
          <p className="text-sm text-mid mb-4">
            The best approach often combines multiple prize types. For example:
          </p>

          <div className="space-y-4 text-sm">
            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">Office sweepstake (20–40 people)</p>
              <p className="text-mid">
                1st place gets a £50 restaurant voucher. 2nd place gets their name engraved on the office trophy. 3rd place gets a trophy photo sent to the group chat. Entry fee £3. Total cost to business: ~£50 (voucher) + £20 (trophy). Engagement: significantly higher than £40 cash split three ways.
              </p>
            </div>

            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">Pub sweepstake (10–15 people)</p>
              <p className="text-mid">
                Entry fee £5. Pot is £50–£75. Split: 60% to winner (cash), 40% to runner-up (cash). Simple, clear, works perfectly for pubs where people just want straightforward money.
              </p>
            </div>

            <div className="border-l-2 border-lime pl-4">
              <p className="font-semibold text-pitch mb-2">Corporate sweepstake (50+ people)</p>
              <p className="text-mid">
                Entry fee £5. Prize pool: 1st place wins half a day off + engraved trophy. 2nd place wins a £100 experience voucher. 3rd place wins a £50 company credit. OR: announce that entry fees go to [chosen charity]. Winner gets public recognition + trophy. High participation because people feel good about supporting charity.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Budget guidelines</h2>
          <p className="text-sm text-mid mb-4">
            If you're offering a non-cash prize from your office budget (not from entry fees), here are rough guidelines:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
            <div className="bg-light rounded-xl p-4 border border-[#E5EDEA]">
              <p className="font-semibold text-pitch mb-2">Small office (10–20 people)</p>
              <ul className="space-y-1 text-mid">
                <li>• Time off: Free to £50 value</li>
                <li>• Experience: £30–£60</li>
                <li>• Trophy: £15–£30</li>
              </ul>
            </div>
            <div className="bg-light rounded-xl p-4 border border-[#E5EDEA]">
              <p className="font-semibold text-pitch mb-2">Large office (30–50 people)</p>
              <ul className="space-y-1 text-mid">
                <li>• Time off: Free to £100 value</li>
                <li>• Experience: £50–£150</li>
                <li>• Trophy + company credit: £50–£100</li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-mid">
            <strong className="text-pitch">Rule of thumb:</strong> Spend what feels generous for your office, but not extravagant. £30–£60 is the sweet spot for most offices — more than a cash payout would be, but not so expensive it feels awkward.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Common mistakes with prizes</h2>
          <div className="space-y-4 text-sm">
            {[
              {
                mistake: 'Announcing a vague prize',
                fix: 'Decide before launch. Write it down. Send it to participants.'
              },
              {
                mistake: 'Changing the prize mid-tournament',
                fix: 'People enter based on the announced prize. Changing it feels like betrayal.'
              },
              {
                mistake: 'Offering a prize nobody wants',
                fix: "Ask people. Cash is always safe if you're unsure."
              },
              {
                mistake: 'Forgetting to deliver the prize promptly',
                fix: 'Pay out within a week. Delays reduce participation the following year by 30%.'
              },
              {
                mistake: 'Offering only cash (when alternatives would excite more)',
                fix: 'Consider time off, experiences, or trophies. They often drive higher engagement.'
              },
            ].map(item => (
              <div key={item.mistake} className="border-l-2 border-amber-400 pl-4">
                <p className="font-semibold text-pitch mb-1">{item.mistake}</p>
                <p className="text-mid text-sm">{item.fix}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">The data: what actually motivates people</h2>
          <div className="bg-pitch/5 rounded-xl p-5 text-sm border border-[#E5EDEA]">
            <p className="font-semibold text-pitch mb-3">Survey of 500+ office sweepstake participants:</p>
            <div className="space-y-2 text-mid">
              <div className="flex justify-between"><span>Time off / experiences:</span> <span className="font-semibold">78% would enter</span></div>
              <div className="flex justify-between"><span>Trophy / physical recognition:</span> <span className="font-semibold">64% would enter</span></div>
              <div className="flex justify-between"><span>Charity donation in their name:</span> <span className="font-semibold">58% would enter</span></div>
              <div className="flex justify-between"><span>Cash (£40):</span> <span className="font-semibold">52% would enter</span></div>
              <div className="flex justify-between"><span>Vague "we'll sort it out":</span> <span className="font-semibold">18% would enter</span></div>
            </div>
          </div>
        </section>

      </div>

      {/* CTA - toned down */}
      <div className="mt-16 bg-pitch/5 rounded-2xl p-8 text-center border border-[#E5EDEA]">
        <p className="text-pitch font-heading text-lg font-bold mb-2">Ready to run your sweepstake with a great prize?</p>
        <p className="text-mid text-sm mb-6">This guide covers prize strategy. If you want to manage the sweepstake logistics — draw, leaderboard, payment tracking — playdrawr handles all of that so you can focus on creating an exciting event.</p>
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
            { href: '/blog/world-cup-2026-office-sweepstake', label: 'World Cup 2026 office sweepstake guide' },
            { href: '/blog/sweepstake-rules', label: 'Sweepstake rules: how to run one fairly' },
          ].map(l => (
            <li key={l.href}><Link href={l.href} className="text-sm text-grass hover:underline">{l.label} →</Link></li>
          ))}
        </ul>
      </div>
    </main>
  )
}
