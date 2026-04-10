import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Eurovision Office Sweepstake Ideas | playdrawr',
  description: 'Run a Eurovision sweepstake at work with minimal effort and maximum engagement. Full guide for office organisers.',
}

export default function EurovisionOfficeSweepstakePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Office sweepstake</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        Eurovision office sweepstake: low effort, high engagement
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        Few initiatives deliver as much engagement for as little effort. Eurovision is inclusive, short, and gives everyone something to talk about — even people who have never watched before.
      </p>

      <div className="space-y-10 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Why it works so well at work</h2>
          <div className="bg-light rounded-xl p-5 space-y-3 text-sm">
            {[
              { icon: '✓', title: 'Inclusive', desc: 'No musical expertise required. Everyone starts equal.' },
              { icon: '✓', title: 'Short duration', desc: 'One night, one result. No weeks of ongoing attention required.' },
              { icon: '✓', title: 'Shared experience', desc: 'The whole office watches the same thing at the same time — rare for any event.' },
              { icon: '✓', title: 'Low stakes', desc: 'A £2–£5 entry fee keeps it fun without financial pressure.' },
            ].map(item => (
              <div key={item.title} className="flex gap-3">
                <span className="text-grass font-bold shrink-0 w-5">{item.icon}</span>
                <div>
                  <span className="font-semibold text-pitch">{item.title}: </span>
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Execution strategy</h2>
          <div className="space-y-6 text-sm">
            <div>
              <p className="font-semibold text-pitch mb-3 flex items-center gap-2">
                <span className="bg-lime text-pitch text-xs px-2 py-0.5 rounded font-bold">Before the event</span>
              </p>
              <div className="space-y-2 pl-4 border-l-2 border-lime">
                <p>— Announce the sweepstake at least a week before. People forget.</p>
                <p>— Set a clear entry deadline (day before the first semi-final).</p>
                <p>— Collect entry fees before running the draw — not after.</p>
                <p>— Share the draw result via the playdrawr link. No screenshots needed.</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-pitch mb-3 flex items-center gap-2">
                <span className="bg-lime text-pitch text-xs px-2 py-0.5 rounded font-bold">On the night</span>
              </p>
              <div className="space-y-2 pl-4 border-l-2 border-lime">
                <p>— Share the live leaderboard link in Slack, Teams, or WhatsApp.</p>
                <p>— Call out position changes as they happen — it keeps people engaged.</p>
                <p>— The leaderboard updates automatically. Your job is just to watch.</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-pitch mb-3 flex items-center gap-2">
                <span className="bg-lime text-pitch text-xs px-2 py-0.5 rounded font-bold">After</span>
              </p>
              <div className="space-y-2 pl-4 border-l-2 border-lime">
                <p>— Announce the winner publicly — in the same channel where you promoted it.</p>
                <p>— Pay out the same day if possible.</p>
                <p>— The banter carries over to Monday.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Entry fee and prize setup</h2>
          <p className="text-sm mb-4">
            For offices, £2–£5 is the standard. Keep it accessible — the point is participation, not the pot size.
          </p>
          <div className="bg-light rounded-xl p-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Small team (under 10)</span>
              <span className="font-semibold text-pitch">£2–£3 each</span>
            </div>
            <div className="flex justify-between">
              <span>Standard office (10–30)</span>
              <span className="font-semibold text-pitch">£3–£5 each</span>
            </div>
            <div className="flex justify-between">
              <span>Large office (30+)</span>
              <span className="font-semibold text-pitch">£2–£3, split prize</span>
            </div>
          </div>
          <p className="text-sm mt-4">
            For offices with expense budgets, consider funding the prize externally — then the entry fees go to a team charity pot. Works well as a CSR activity.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Engagement impact</h2>
          <p className="text-sm mb-4">
            What actually happens when you run one:
          </p>
          <div className="space-y-3 text-sm">
            {[
              'Increased team interaction across departments that do not normally talk',
              'Informal communication — people message each other about their countries',
              'Higher participation rates than most voluntary engagement initiatives',
              'Conversation that carries through the week after the event',
            ].map(item => (
              <div key={item} className="flex gap-3 border-l-2 border-lime pl-4">
                <span className="text-grass font-bold shrink-0">→</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-sm mt-4">
            The reason is simple: everyone has a stake in the same event at the same time. That shared investment creates genuine interaction.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Remote and hybrid offices</h2>
          <p className="text-sm mb-4">
            Eurovision office sweepstakes work equally well for distributed teams. The draw runs online, the leaderboard is a shareable link, and watching Eurovision together over video call is increasingly common.
          </p>
          <p className="text-sm">
            With playdrawr, participants just need the link — no account, no download, no friction. People in different offices or working from home can follow the same leaderboard in real time.
          </p>
        </section>

      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl p-8 text-center" style={{ background: '#040241' }}>
        <p className="text-white font-heading text-xl font-bold mb-2">Create your office sweepstake</p>
        <p className="text-white/60 text-sm mb-6">Share a link, run the draw, watch the leaderboard update itself. Free.</p>
        <Link
          href="/signup"
          className="inline-block font-bold px-8 py-3 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: '#F10F59', color: '#fff' }}
        >
          Create your sweepstake →
        </Link>
      </div>
    </main>
  )
}
