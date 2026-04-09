import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Run a Sweepstake: Complete Setup Guide | playdrawr',
  description: 'Step-by-step guide to running a sweepstake — creating it, adding participants, running the draw, tracking payments, and sharing the leaderboard. Free tool included.',
}

export default function HowToRunASweepstakePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-grass hover:underline mb-8 block">← All guides</Link>

      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-mid">Setup guide</span>
      </div>
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-4 leading-tight">
        How to run a sweepstake: the complete guide
      </h1>
      <p className="text-lg text-mid mb-12 leading-relaxed">
        From setting it up to sharing the leaderboard — everything you need to run a sweepstake that actually works. Takes about three minutes with the right tool.
      </p>

      <div className="space-y-10 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Step 1: Create your sweepstake</h2>
          <p className="text-sm mb-4">
            Start by giving your sweepstake a name — something obvious like "World Cup 2026 Office Draw" or "The Lads&apos; Sweepstake". Then decide on two things before you do anything else:
          </p>
          <div className="bg-light rounded-xl p-5 space-y-3 text-sm">
            <div>
              <p className="font-semibold text-pitch mb-1">Entry fee</p>
              <p>How much each person pays to enter. There&apos;s no right answer — £5 keeps it casual, £10–£20 creates genuine excitement. Set it the same for everyone: equal stake, equal chance. If it&apos;s just for fun, you can skip the fee entirely.</p>
            </div>
            <div>
              <p className="font-semibold text-pitch mb-1">What you&apos;re playing for</p>
              <p>A money pot (entry fees go to the winner) or prizes (a trophy, a bottle, a day off). Both work — prizes often create better stories.</p>
            </div>
          </div>
          <p className="text-sm mt-4">
            With playdrawr, you set these in under a minute and can change most of them any time before the draw.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Step 2: Add participants</h2>
          <p className="text-sm mb-4">
            You have two options here — add people yourself, or share a join link and let them sign up.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-lime flex items-center justify-center shrink-0 text-xs font-bold text-pitch mt-0.5">A</span>
              <div>
                <p className="font-semibold text-pitch mb-1">Add manually</p>
                <p className="text-mid">Type in each person&apos;s name (and optionally their email). Good for smaller groups where you&apos;re coordinating everything yourself. You can add yourself too — just hit &quot;Add myself&quot; in the participants tab.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-lime flex items-center justify-center shrink-0 text-xs font-bold text-pitch mt-0.5">B</span>
              <div>
                <p className="font-semibold text-pitch mb-1">Share a join link</p>
                <p className="text-mid">Drop your unique link into a group chat and let people add themselves. They enter their name and email — you see them appear instantly. The best option for offices, pubs, and remote teams.</p>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-5 text-sm text-amber-800">
            <strong>Reserve list tip:</strong> If you have more people than spots (free plan supports up to 48), anyone beyond the cap goes on a reserve list automatically. You can promote them in if someone drops out.
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Step 3: Collect entry fees before the draw</h2>
          <p className="text-sm mb-4">
            This is the most important rule of any sweepstake: <strong className="text-pitch">nobody draws a team until they&apos;ve paid</strong>. Once someone has a team, they have no incentive to hand over the money.
          </p>
          <p className="text-sm mb-4">
            Drawr doesn&apos;t process payments — you collect directly (bank transfer, cash, whatever your group uses). Use the Participants tab to mark who has paid as money comes in. The payment summary at the top shows your running total vs outstanding at a glance.
          </p>
          <p className="text-sm">
            If you&apos;ve added emails, you can also send a payment reminder to all unpaid participants in one click — useful the night before the draw.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Step 4: Run the draw</h2>
          <p className="text-sm mb-4">
            Once everyone is in and paid, head to the Draw tab and hit &quot;Run draw&quot;. Teams are assigned randomly — every participant gets one (or more, if you have more participants than teams). The draw is permanent once confirmed, so make sure you&apos;re happy with the participant list first.
          </p>
          <p className="text-sm mb-4">
            If you&apos;ve collected emails, every participant gets an automatic confirmation with their team. No need to screenshot results and paste them into a group chat.
          </p>
          <div className="bg-light rounded-xl p-5 text-sm space-y-2">
            <p className="font-semibold text-pitch">Assignment modes</p>
            <div className="flex gap-2"><span className="text-grass font-medium w-16 shrink-0">Random</span><span>Teams drawn at random when you run the draw. The classic approach.</span></div>
            <div className="flex gap-2"><span className="text-grass font-medium w-16 shrink-0">Auto</span><span>Teams assigned as participants join — first in, first served.</span></div>
            <div className="flex gap-2"><span className="text-grass font-medium w-16 shrink-0">Manual</span><span>You assign each team yourself. Useful for very small groups or special formats.</span></div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Step 5: Share the leaderboard</h2>
          <p className="text-sm mb-4">
            Once the draw is done, share your public leaderboard link in your group chat. Anyone can view it — no account or login needed. It shows each participant, their assigned team, and a running points total that updates as results come in.
          </p>
          <p className="text-sm">
            The leaderboard keeps the sweepstake alive throughout the tournament. People check it after every match, which keeps the banter going even when their team had an early exit.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">How scoring works</h2>
          <p className="text-sm mb-4">
            Points are awarded based on how far your assigned team advances. The further they go, the more you earn — so even an early group stage exit scores something.
          </p>
          <div className="bg-light rounded-xl p-5 text-sm space-y-2">
            {[
              ['Group stage win', '3 pts'],
              ['Group stage draw', '1 pt'],
              ['Round of 16', '+5 pts'],
              ['Quarter-final', '+8 pts'],
              ['Semi-final', '+12 pts'],
              ['Runner-up', '+15 pts'],
              ['Winner 🏆', '+20 pts'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-mid">{label}</span>
                <span className="font-semibold text-pitch">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-sm mt-3">Points may vary slightly by tournament format. Drawr updates scores automatically as results come in.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-pitch mb-4">Common questions</h2>
          <div className="space-y-5 text-sm">
            {[
              {
                q: 'What if there are more participants than teams?',
                a: 'Some people get two teams. The leaderboard tracks points per participant summed across all their teams, so whoever has the best-performing allocation wins.',
              },
              {
                q: 'What if someone drops out after the draw?',
                a: "Their team stays in the draw — you can remove them from the participants list and either leave the slot empty or promote someone from your reserve list. You'll need to manually re-assign the team if you promote someone.",
              },
              {
                q: 'Do participants need to create an account?',
                a: "No. Participants just need the join link to sign up, and the leaderboard link to follow the standings. No login required for either.",
              },
              {
                q: "Can I change the entry fee after the draw?",
                a: "Yes — settings like name, entry fee, and prize type can be updated any time. Assignment mode is the only thing that locks once the draw is run.",
              },
              {
                q: 'What is the payout for 1st, 2nd and 3rd?',
                a: "That's up to you. Drawr shows who finishes where — the typical split is something like 60/25/15 but you can agree whatever works for your group.",
              },
            ].map(item => (
              <div key={item.q} className="border-l-2 border-lime pl-4">
                <p className="font-semibold text-pitch mb-1">{item.q}</p>
                <p className="text-mid">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* CTA */}
      <div className="mt-16 bg-pitch rounded-2xl p-8 text-center">
        <p className="text-white font-heading text-xl font-bold mb-2">Ready to run yours?</p>
        <p className="text-white/60 text-sm mb-6">Free for up to 48 participants. Takes three minutes to set up.</p>
        <Link
          href="/signup"
          className="inline-block bg-lime text-pitch font-bold px-8 py-3 rounded-xl hover:bg-[#b8e03d] transition-colors"
        >
          Create your sweepstake →
        </Link>
      </div>
    </main>
  )
}
