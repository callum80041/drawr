import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'World Cup Sweepstake for Remote Teams | playdrawr',
  description: 'Running a World Cup sweepstake for a remote or hybrid team? One shareable link, no login needed, automatic standings. Works perfectly across offices and home.',
}

export default function RemoteTeamSweepstakePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Remote teams</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        How to run a World Cup sweepstake for a remote or hybrid team
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        The office sweepstake tradition doesn&apos;t disappear just because half your team works from home. It does need a different approach — one that works across locations, doesn&apos;t rely on physical draw slips, and keeps everyone connected without a group email chain that goes on for three days.
      </p>

      <div className="space-y-8 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">The challenge with remote sweepstakes</h2>
          <p>Traditional sweepstakes rely on being in the same place: passing a hat around, collecting cash over a desk, writing names on a whiteboard. None of that translates to a hybrid team without someone spending a disproportionate amount of time chasing people on Slack and trying to make a spreadsheet work across time zones.</p>
          <p>The digital sweepstake solves this completely. One person sets it up. Everyone gets a link. Nobody needs to be in the same building — or even the same country.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Setting up a remote-friendly sweepstake</h2>
          <p>Create your sweepstake on playdrawr. Add everyone by name — include email addresses so the system notifies participants of their team assignment automatically.</p>
          <p>Run the draw at a set time and share it publicly — drop the link in your main team Slack channel, your team WhatsApp group, and your company all-hands update. The share link works on any device, no login needed. Someone checks it on their commute at 7am, someone else checks it from their home office at 9am — same leaderboard, same draw, same experience.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Making it feel like an event remotely</h2>
          <p>The hardest part of a remote sweepstake isn&apos;t the logistics — it&apos;s the atmosphere. You can recreate the draw night energy digitally:</p>
          <ul className="list-disc list-inside space-y-2 text-sm mt-3">
            <li>Run a short Zoom or Teams call for the draw reveal — share your screen and let people watch the teams being assigned live</li>
            <li>Drop a message in Slack when draw results are ready: &quot;Results are in — [link] — who drew England?&quot;</li>
            <li>Create a dedicated sweepstake channel in Slack or Teams where people can post reactions and talk football for eight weeks</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Payment for remote teams</h2>
          <p>Without being able to collect cash at a desk, you have a few options:</p>
          <ul className="list-disc list-inside space-y-1 text-sm mt-2">
            <li>Bank transfer to the organiser&apos;s personal account before the draw</li>
            <li>A shared payment app like Monzo or Revolut</li>
            <li>Company-funded prize (zero payment faff, just a prize from the business)</li>
          </ul>
          <p className="mt-3">playdrawr&apos;s payment tracking lets you mark each participant as paid or unpaid regardless of how they pay. When everyone has paid, run the draw.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-3">Keeping remote participants engaged throughout the tournament</h2>
          <p>playdrawr&apos;s leaderboard is live and shareable — anyone can check standings at any time from anywhere. Post weekly leaderboard updates in your team channel. Announce when teams get knocked out. Celebrate quarter-final qualifications.</p>
          <p>Eight weeks of sporadic football chat is one of the better forms of low-effort team building available to remote managers — and the sweepstake is the structure that makes it happen naturally.</p>
        </section>

      </div>

      <div className="bg-pitch rounded-2xl p-8 text-center mt-12">
        <h2 className="font-heading text-2xl font-bold text-white mb-2">Create your free remote team sweepstake</h2>
        <p className="text-white/60 text-sm mb-6">One link. No logins for participants. Works anywhere.</p>
        <Link href="/signup" className="inline-block bg-lime text-pitch font-bold px-8 py-3 rounded-xl hover:bg-[#b8e03d] transition-colors">
          Get started free →
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-[#E5EDEA]">
        <p className="text-sm font-semibold text-pitch mb-3">Related guides</p>
        <ul className="space-y-2">
          {[
            { href: '/how-it-works', label: 'How playdrawr works — step by step' },
            { href: '/blog/world-cup-2026-office-sweepstake', label: 'The complete office sweepstake guide' },
          ].map(l => (
            <li key={l.href}><Link href={l.href} className="text-sm text-grass hover:underline">{l.label} →</Link></li>
          ))}
        </ul>
      </div>
    </main>
  )
}
