import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Run a Eurovision Pub Sweepstake | playdrawr',
  description: 'Increase engagement and dwell time with a Eurovision pub sweepstake. Full guide for pub landlords and bar managers.',
}

export default function PubEurovisionSweepstakePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Pub guide</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        Eurovision pub sweepstake: how to maximise the night
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        Eurovision already drives footfall. A sweepstake converts casual viewers into invested participants — and invested participants stay longer, order more, and come back for the final result.
      </p>

      <div className="space-y-10 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Why pubs benefit from a sweepstake</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {[
              { value: '↑', label: 'Dwell time', desc: 'Customers stay until the last vote — not just until their drink is finished.' },
              { value: '↑', label: 'Return visits', desc: 'Repeat customers come back for the semi-finals and Grand Final as separate events.' },
              { value: '↑', label: 'Group size', desc: 'A sweepstake gives people a reason to bring others — your regulars recruit new customers.' },
            ].map(item => (
              <div key={item.label} className="bg-light rounded-xl p-4 text-center">
                <p className="font-heading text-2xl font-black text-grass mb-1">{item.value}</p>
                <p className="font-semibold text-pitch text-sm mb-1">{item.label}</p>
                <p className="text-xs text-mid">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Setup: what you need before the night</h2>
          <div className="space-y-4 text-sm">
            {[
              {
                title: 'Create the sweepstake',
                desc: 'Set it up on playdrawr with a name like "The Crown Eurovision 2026". Takes five minutes. Set the entry fee upfront.',
              },
              {
                title: 'Promote it in advance',
                desc: 'Post on social media and add a notice behind the bar at least a week before. "Eurovision Sweepstake Night — £5 entry, winner takes the pot." That\'s all you need.',
              },
              {
                title: 'Decide the entry format',
                desc: 'Either: collect entries on the night with a cash box and add names yourself, or share the playdrawr join link in your social posts so people enter beforehand.',
              },
              {
                title: 'Set a draw time',
                desc: 'Announce when the draw happens — typically 30 minutes before the show starts. Creates an event within the event.',
              },
            ].map((item, i) => (
              <div key={item.title} className="flex gap-4">
                <span className="font-heading text-3xl text-lime/30 font-black leading-none shrink-0 w-8">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="font-semibold text-pitch mb-1">{item.title}</p>
                  <p className="text-mid">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Entry fee and prize structure</h2>
          <p className="text-sm mb-4">
            Pubs typically run at higher entry points than office sweepstakes — the environment supports it.
          </p>
          <div className="bg-light rounded-xl p-5 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Entry fee</span>
              <span className="font-semibold text-pitch">£5–£10 per person</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Winner</span>
              <span className="font-semibold text-pitch">70% of pot</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Runner-up</span>
              <span className="font-semibold text-pitch">20% of pot</span>
            </div>
            <div className="flex justify-between items-center">
              <span>3rd place / last place forfeit</span>
              <span className="font-semibold text-pitch">10% of pot</span>
            </div>
          </div>
          <p className="text-sm mt-4">
            Some pubs take a small percentage (10–15%) for administration. If so, state this clearly upfront — transparency avoids any awkwardness when the pot is paid out.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Running the night</h2>
          <div className="space-y-4 text-sm">
            {[
              { time: 'Pre-show', action: 'Run the live draw at the bar. Project or read out the assignments. The reveal is its own moment of engagement.' },
              { time: 'Semi-finals', action: 'Display the playdrawr leaderboard on a screen. Share the public link via QR code or your social stories.' },
              { time: 'During voting', action: 'Announce leaderboard changes as they happen — "Steve\'s just moved into first place with Latvia." Provokes immediate reaction.' },
              { time: 'Final vote', action: 'The last vote reveals the winner. Make it a moment — announce it to the room before the winner comes forward.' },
            ].map(item => (
              <div key={item.time} className="flex gap-4 border-l-2 border-lime pl-4">
                <span className="font-semibold text-pitch w-20 shrink-0">{item.time}</span>
                <span className="text-mid">{item.action}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">The leaderboard as a display tool</h2>
          <p className="text-sm mb-4">
            playdrawr generates a public link that anyone can open on their phone. Cast it to a TV or projector for real-time visibility across the pub.
          </p>
          <p className="text-sm">
            No login required for customers. They open the link, see the leaderboard, and follow along. You can also display a QR code pointing to the live link — print it or display it on a screen.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Semi-finals as a second event</h2>
          <p className="text-sm mb-4">
            Eurovision has two semi-finals (Tuesday and Thursday) before the Grand Final on Saturday. Each is its own opportunity for a pub night.
          </p>
          <p className="text-sm">
            Run the draw before the semi-finals. Anyone whose country does not qualify is eliminated. The remaining participants compete for the Grand Final prize. This triples the number of dedicated evenings — and footfall.
          </p>
        </section>

      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl p-8 text-center" style={{ background: '#040241' }}>
        <p className="text-white font-heading text-xl font-bold mb-2">Set up your pub sweepstake</p>
        <p className="text-white/60 text-sm mb-6">Free to create. Share one link. Leaderboard updates automatically on the night.</p>
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
