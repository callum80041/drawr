import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Eurovision Sweepstake: How to Run One Easily | playdrawr',
  description: 'Run a Eurovision sweepstake in minutes. Random draw, live leaderboard, and automatic scoring. Free and simple with playdrawr.',
}

export default function EurovisionSweepstakeGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Eurovision sweepstake</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        Eurovision sweepstake: how to run one properly
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        Eurovision is one of the biggest shared TV events of the year. A sweepstake changes it from passive viewing into something genuinely competitive. Here is exactly how to run one.
      </p>

      <div className="space-y-10 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Why a Eurovision sweepstake works</h2>
          <p className="text-sm mb-4">
            Offices, pubs, and group chats all tune in at the same time — but most people are only half invested. A sweepstake changes that completely.
          </p>
          <p className="text-sm mb-4">
            Instead of passively watching, everyone has a country. Every vote matters. Every &quot;douze points&quot; becomes personal. Suddenly, the entire night becomes competitive, social, and far more engaging.
          </p>
          <p className="text-sm">
            Most sweepstakes are still run using paper lists, WhatsApp messages, or basic spreadsheets. These break down quickly — duplicate entries, confusion over who has which country, and no easy way to track results as voting happens live.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">What is a Eurovision sweepstake?</h2>
          <p className="text-sm mb-4">
            A Eurovision sweepstake is a simple competition:
          </p>
          <div className="bg-light rounded-xl p-5 space-y-2 text-sm">
            {[
              'Each participant is randomly assigned a country',
              'The contest runs as normal',
              'The participant with the highest scoring country wins',
            ].map(item => (
              <div key={item} className="flex gap-3">
                <span className="text-grass font-bold shrink-0">—</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-sm mt-4">
            The randomness is critical. It removes bias and ensures fairness. Nobody can choose Sweden or avoid weaker entries — which keeps it fun across mixed groups.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Why Eurovision works perfectly for sweepstakes</h2>
          <p className="text-sm mb-4">
            Eurovision is arguably better suited to sweepstakes than football tournaments.
          </p>
          <div className="bg-light rounded-xl p-5 space-y-2 text-sm">
            {[
              'It is a single-night event — instant payoff',
              'There are clear, measurable points',
              'Jury vs public voting creates unpredictability',
              'Frequent momentum swings keep the leaderboard moving',
            ].map(item => (
              <div key={item} className="flex gap-3">
                <span className="text-grass font-bold shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-sm mt-4">
            This creates a fast-paced, high-engagement sweepstake that does not require weeks of tracking.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">How to run a Eurovision sweepstake (step by step)</h2>

          <div className="space-y-6 text-sm">
            {[
              {
                step: 'Step 1',
                title: 'Create your sweepstake',
                body: 'Set up your sweepstake using playdrawr. Name it clearly and decide whether you are charging an entry fee before you do anything else.',
              },
              {
                step: 'Step 2',
                title: 'Add participants',
                body: 'Input names manually or allow people to join via a shared link. The join link works best for offices, pubs, and large group chats — drop it in and people add themselves.',
              },
              {
                step: 'Step 3',
                title: 'Run the random draw',
                body: 'Countries are assigned randomly. This is essential to keep the competition fair. No one can choose — which removes any arguments about who got the favourites.',
              },
              {
                step: 'Step 4',
                title: 'Share the link',
                body: 'Everyone can view their assigned country, the full list of participants, and live standings during voting. No login required.',
              },
              {
                step: 'Step 5',
                title: 'Let the voting do the work',
                body: 'As Eurovision scoring happens, the leaderboard updates automatically. No manual tracking required on the night.',
              },
            ].map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-16 shrink-0">
                  <span className="inline-block bg-lime text-pitch text-xs font-bold px-2 py-0.5 rounded">{item.step}</span>
                </div>
                <div>
                  <p className="font-semibold text-pitch mb-1">{item.title}</p>
                  <p className="text-mid">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Entry fee considerations</h2>
          <p className="text-sm mb-4">
            Most UK sweepstakes use:
          </p>
          <div className="bg-light rounded-xl p-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Casual groups (office, friends)</span>
              <span className="font-semibold text-pitch">£2–£5</span>
            </div>
            <div className="flex justify-between">
              <span>Pubs or larger groups</span>
              <span className="font-semibold text-pitch">£5–£10</span>
            </div>
            <div className="flex justify-between">
              <span>Just for fun</span>
              <span className="font-semibold text-pitch">Free</span>
            </div>
          </div>
          <p className="text-sm mt-4">
            You can also run it completely free with a prize funded separately. The important thing is to agree the amount before the draw — not after.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Best format for prizes</h2>
          <p className="text-sm mb-4">
            Keep it simple:
          </p>
          <div className="bg-light rounded-xl p-5 space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="font-bold text-pitch shrink-0">1st place:</span>
              <span>Winner — highest points when the votes are in</span>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-pitch shrink-0">Optional:</span>
              <span>2nd and 3rd place prizes for larger groups</span>
            </div>
          </div>
          <p className="text-sm mt-4">
            Avoid overcomplicating the prize structure. Eurovision already has enough moving parts.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Why digital sweepstakes outperform manual ones</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="font-semibold text-red-700 mb-2">Manual (paper / spreadsheet)</p>
              <ul className="space-y-1 text-red-600">
                <li>— Time-consuming</li>
                <li>— Error-prone</li>
                <li>— Manual result tracking</li>
                <li>— No visibility for participants</li>
              </ul>
            </div>
            <div className="bg-[#F0FAF4] border border-[#C3E5D2] rounded-xl p-4">
              <p className="font-semibold text-pitch mb-2">Digital (playdrawr)</p>
              <ul className="space-y-1 text-mid">
                <li>✓ Instant draw</li>
                <li>✓ Live leaderboard</li>
                <li>✓ Shareable link</li>
                <li>✓ Zero admin on the night</li>
              </ul>
            </div>
          </div>
          <p className="text-sm mt-4">
            The difference is operational friction. Removing it increases participation and keeps the night running smoothly.
          </p>
        </section>

      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl p-8 text-center" style={{ background: '#040241' }}>
        <p className="text-white font-heading text-xl font-bold mb-2">Create your Eurovision sweepstake</p>
        <p className="text-white/60 text-sm mb-6">Free. 35 countries ready to draw. Takes three minutes.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="inline-block font-bold px-8 py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: '#F10F59', color: '#fff' }}
          >
            Create your sweepstake →
          </Link>
          <Link
            href="/s/demoeurovision"
            className="inline-block font-bold px-8 py-3 rounded-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
          >
            View live demo
          </Link>
        </div>
      </div>
    </main>
  )
}
