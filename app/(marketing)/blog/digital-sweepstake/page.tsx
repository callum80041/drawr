import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Why Digital Sweepstakes Are Better | playdrawr',
  description: 'Stop using spreadsheets and paper. Run sweepstakes online with automatic scoring, live leaderboards, and zero admin.',
}

export default function DigitalSweepstakePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Sweepstake tools</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        Why digital sweepstakes outperform paper every time
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        Paper-based sweepstakes persist due to habit, not effectiveness. Once you run one digitally, the comparison is immediate — and you will not go back.
      </p>

      <div className="space-y-10 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">The problems with paper and spreadsheets</h2>
          <p className="text-sm mb-4">
            The traditional approach — paper slips, WhatsApp messages, and a shared spreadsheet — has real limitations that only become visible once the tournament or event starts.
          </p>
          <div className="space-y-3 text-sm">
            {[
              {
                problem: 'Manual errors',
                detail: 'Duplicate entries, missed participants, or incorrect team assignments. All fixable, but all time-consuming and occasionally causing disputes.',
              },
              {
                problem: 'No real-time visibility',
                detail: 'Participants only know the standings when someone manually updates a spreadsheet. Between updates, nobody knows where they are.',
              },
              {
                problem: 'Organiser burden',
                detail: 'The person who set it up has to track results, update scores, and answer queries throughout a long tournament.',
              },
              {
                problem: 'Poor scalability',
                detail: 'Works for 10 people. Starts breaking down at 20. Becomes chaotic at 30+.',
              },
              {
                problem: 'No audit trail',
                detail: 'WhatsApp messages get buried. Paper slips go missing. Disputes are hard to resolve without a clear record.',
              },
            ].map(item => (
              <div key={item.problem} className="border-l-2 border-red-200 pl-4">
                <p className="font-semibold text-pitch mb-1">{item.problem}</p>
                <p className="text-mid">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">What a digital sweepstake tool solves</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { title: 'Instant random draw', desc: 'Cryptographically fair. No manual pulling from a hat, no disputes about the method.' },
              { title: 'Live leaderboard', desc: 'Updates automatically as results come in. Every participant sees the same thing in real time.' },
              { title: 'Shareable link', desc: 'One URL, no login required. Drop it in a group chat — everyone is immediately connected.' },
              { title: 'Payment tracking', desc: 'Mark who has paid. See the running pot total at a glance without a separate spreadsheet.' },
              { title: 'Automatic scoring', desc: 'Results feed into the leaderboard without any manual input from the organiser.' },
              { title: 'Works at any scale', desc: '5 participants or 500 — the system handles it the same way without additional effort.' },
            ].map(item => (
              <div key={item.title} className="bg-[#F0FAF4] border border-[#C3E5D2] rounded-xl p-4">
                <p className="font-semibold text-pitch mb-1">{item.title}</p>
                <p className="text-mid">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">The operational efficiency gap</h2>
          <p className="text-sm mb-4">
            The core difference is not features — it is time. Running a paper sweepstake for a major tournament typically involves:
          </p>
          <div className="bg-light rounded-xl p-5 space-y-2 text-sm mb-4">
            {[
              '2–4 hours setting up lists, chasing entries, and managing payment',
              '30+ minutes per week updating the standings',
              'Multiple messages answering participant queries',
              'Significant time at the end calculating final positions',
            ].map(item => (
              <div key={item} className="flex gap-2">
                <span className="text-red-500 font-bold shrink-0">—</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-sm mb-4">
            A digital tool reduces setup to under five minutes and eliminates ongoing admin almost entirely.
          </p>
          <p className="text-sm">
            The organiser&apos;s job changes from active manager to passive observer — which is how it should be.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Direct comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E5EDEA]">
                  <th className="text-left py-2 pr-4 font-semibold text-pitch"></th>
                  <th className="text-left py-2 pr-4 font-semibold text-pitch">Paper / spreadsheet</th>
                  <th className="text-left py-2 font-semibold text-pitch">Digital (playdrawr)</th>
                </tr>
              </thead>
              <tbody className="text-mid">
                {[
                  { feature: 'Setup time', paper: '1–2 hours', digital: 'Under 5 minutes' },
                  { feature: 'Draw method', paper: 'Manual', digital: 'Automatic, randomised' },
                  { feature: 'Live standings', paper: 'Manual updates', digital: 'Real-time, automatic' },
                  { feature: 'Participant access', paper: 'Screenshot / PDF', digital: 'Shareable link, no login' },
                  { feature: 'Payment tracking', paper: 'Separate spreadsheet', digital: 'Built-in' },
                  { feature: 'Scale', paper: 'Breaks at 20+', digital: 'No practical limit' },
                  { feature: 'Cost', paper: 'Free (but takes time)', digital: 'Free' },
                ].map(row => (
                  <tr key={row.feature} className="border-b border-[#E5EDEA]">
                    <td className="py-2 pr-4 font-medium text-pitch">{row.feature}</td>
                    <td className="py-2 pr-4 text-red-500">{row.paper}</td>
                    <td className="py-2 text-grass font-medium">{row.digital}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Supports for both World Cup and Eurovision</h2>
          <p className="text-sm mb-4">
            The same platform handles both tournament formats — football and song contest — with appropriate scoring for each. World Cup sweepstakes track group stage results, knockout rounds, and the final. Eurovision sweepstakes track semi-final qualification and real Grand Final points.
          </p>
          <p className="text-sm">
            No configuration needed — select the tournament type when creating and the right scoring system applies automatically.
          </p>
        </section>

      </div>

      {/* CTA */}
      <div className="mt-16 bg-pitch rounded-2xl p-8 text-center">
        <p className="text-white font-heading text-xl font-bold mb-2">Try a digital sweepstake with playdrawr</p>
        <p className="text-white/60 text-sm mb-6">World Cup 2026 or Eurovision 2026. Free forever. Takes three minutes.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="inline-block bg-lime text-pitch font-bold px-8 py-3 rounded-xl hover:bg-[#b8e03d] transition-colors"
          >
            Create your sweepstake →
          </Link>
          <Link
            href="/s/demoeurovision"
            className="inline-block font-bold px-8 py-3 rounded-xl transition-opacity hover:opacity-80"
            style={{ background: '#F10F59', color: '#fff' }}
          >
            🎤 Eurovision demo
          </Link>
        </div>
      </div>
    </main>
  )
}
