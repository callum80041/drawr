import Link from 'next/link'

const steps = [
  {
    number: '1',
    title: 'Create your sweepstake',
    body: 'From your dashboard, hit "New sweepstake". Give it a name, choose your tournament (World Cup or Eurovision), set an optional entry fee, and pick your assignment mode.',
  },
  {
    number: '2',
    title: 'Add participants',
    body: 'Head to the Participants tab. Add each person by name (and optionally their email). If you have an entry fee, you can track who\'s paid with one tap. Share your unique join link so participants can add themselves — anyone over the free-plan cap of 48 goes to a reserve list automatically.',
  },
  {
    number: '3',
    title: 'Run the draw',
    body: 'Once everyone is in, go to the Draw tab and hit "Run draw". Teams or countries are assigned randomly (or manually if you chose that mode). Each participant gets a confirmation email with their assignment. This step is permanent — assignments can\'t be reshuffled afterwards.',
  },
  {
    number: '4',
    title: 'Share the leaderboard',
    body: 'Copy your public leaderboard link from the dashboard and share it in your group chat. Anyone can view it — no login needed. The leaderboard updates live as results come in.',
  },
  {
    number: '5',
    title: 'Scores update automatically',
    body: 'Drawr pulls in tournament results and updates every participant\'s score in real time. Check the leaderboard at any point to see who\'s winning. When the tournament ends, the winner is crowned automatically.',
  },
]

const faqs = [
  {
    q: 'Which tournaments does Drawr support?',
    a: 'Currently FIFA World Cup 2026 and Eurovision Song Contest 2026. Each has its own scoring system — World Cup uses match results through the knockout stages, Eurovision uses a qualification bonus plus the actual Grand Final jury and televote points.',
  },
  {
    q: 'Can I enter myself as a participant?',
    a: 'Yes — on the Participants tab, click "Add myself" in the top-right corner of the add-participant form. It pre-fills your name and email so you\'re in with one tap.',
  },
  {
    q: 'What happens if someone drops out?',
    a: 'Remove them from the Participants tab. If you have a reserve list, promote the next person on it — they\'ll get an email confirming their spot. You can then re-run the draw for that slot if needed.',
  },
  {
    q: 'How do participants see the leaderboard?',
    a: 'Share the public leaderboard link (on your main dashboard card or the overview tab). No login is required — anyone with the link can view it.',
  },
  {
    q: 'How do I collect entry fees?',
    a: 'Drawr tracks payments — it doesn\'t collect money on your behalf. Ask participants to pay you directly (bank transfer, cash, whatever works). Then mark them as paid in the Participants tab. You can also chase all unpaid participants with one email.',
  },
  {
    q: 'What\'s the difference between assignment modes?',
    a: 'Random: teams or countries are drawn at random when you run the draw. Auto: participants are assigned as they join (first come, first served). Manual: you assign each team or country yourself.',
  },
  {
    q: 'Can I change settings after the draw is run?',
    a: 'Most settings (name, entry fee, prize type, payout structure) can be changed any time. Assignment mode is locked once the draw has been run, since teams or countries are already allocated.',
  },
  {
    q: 'How does the top-3 payout work?',
    a: 'If you choose "1st, 2nd & 3rd", the prize pot is split across the top three finishers. The exact split is up to you to decide and communicate to participants — Drawr shows the standings so you know who finishes where.',
  },
  {
    q: 'What is the free plan limit?',
    a: 'Free sweepstakes support up to 48 participants. Anyone beyond that goes on the reserve list. Upgrade to Pro for unlimited participants.',
  },
]

export default function HelpPage() {
  return (
    <div className="px-4 md:px-10 py-8 max-w-3xl">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-pitch tracking-tight mb-1">
        Help &amp; setup guide
      </h1>
      <p className="text-mid text-sm mb-10">Everything you need to run a smooth sweepstake.</p>

      {/* Setup steps */}
      <section className="mb-12">
        <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-6">Getting started</h2>
        <ol className="space-y-4">
          {steps.map(step => (
            <li key={step.number} className="flex gap-4 bg-white rounded-xl border border-[#E5EDEA] p-5">
              <span className="shrink-0 w-8 h-8 rounded-full bg-lime flex items-center justify-center font-heading font-bold text-pitch text-sm">
                {step.number}
              </span>
              <div>
                <p className="font-semibold text-pitch text-sm mb-1">{step.title}</p>
                <p className="text-sm text-mid leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Scoring explainer */}
      <section className="mb-12">
        <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-1">How scoring works</h2>
        <p className="text-sm text-mid mb-4">Each tournament has its own scoring system. Points are awarded automatically as results come in.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* World Cup */}
          <div className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
            <div className="bg-pitch px-4 py-3 flex items-center gap-2">
              <span className="text-base">⚽</span>
              <p className="font-heading font-bold text-white text-sm">World Cup 2026</p>
            </div>
            <ul className="divide-y divide-[#E5EDEA] text-sm">
              <li className="flex justify-between px-4 py-2.5"><span className="text-mid">Group stage win</span><span className="font-semibold text-pitch">3 pts</span></li>
              <li className="flex justify-between px-4 py-2.5"><span className="text-mid">Group stage draw</span><span className="font-semibold text-pitch">1 pt</span></li>
              <li className="flex justify-between px-4 py-2.5"><span className="text-mid">Reach Round of 16</span><span className="font-semibold text-pitch">+5 pts</span></li>
              <li className="flex justify-between px-4 py-2.5"><span className="text-mid">Reach Quarter-final</span><span className="font-semibold text-pitch">+8 pts</span></li>
              <li className="flex justify-between px-4 py-2.5"><span className="text-mid">Reach Semi-final</span><span className="font-semibold text-pitch">+12 pts</span></li>
              <li className="flex justify-between px-4 py-2.5"><span className="text-mid">Runner-up</span><span className="font-semibold text-pitch">+15 pts</span></li>
              <li className="flex justify-between px-4 py-2.5"><span className="text-mid">Win the World Cup 🏆</span><span className="font-semibold text-pitch">+25 pts</span></li>
            </ul>
          </div>

          {/* Eurovision */}
          <div className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#1B0744' }}>
              <span className="text-base">🎤</span>
              <p className="font-heading font-bold text-white text-sm">Eurovision 2026</p>
            </div>
            <ul className="divide-y divide-[#E5EDEA] text-sm">
              <li className="flex justify-between px-4 py-2.5"><span className="text-mid">Qualifies for Grand Final</span><span className="font-semibold text-pitch">10 pts</span></li>
              <li className="flex justify-between px-4 py-2.5"><span className="text-mid">Finishes top 3</span><span className="font-semibold text-pitch">+20 pts</span></li>
              <li className="flex justify-between px-4 py-2.5"><span className="text-mid">Wins Eurovision 🏆</span><span className="font-semibold text-pitch">+50 pts</span></li>
              <li className="px-4 py-2.5 bg-[#F5F0FF]">
                <p className="text-xs text-mid leading-relaxed">Auto-qualified countries (Big 5 + host) start with 10 pts. Max possible: 60 pts.</p>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Payment tracking */}
      <section className="mb-12">
        <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-3">Tracking payments</h2>
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-5 space-y-3">
          <p className="text-sm text-mid leading-relaxed">
            Drawr doesn&apos;t process payments — you collect money directly from participants. Use the Participants tab to mark who has paid.
          </p>
          <ul className="space-y-2 text-sm text-mid">
            <li className="flex gap-2">
              <span className="text-grass shrink-0">✓</span>
              Tap the paid toggle next to any participant to mark them paid instantly.
            </li>
            <li className="flex gap-2">
              <span className="text-grass shrink-0">✓</span>
              Use &ldquo;Mark all paid&rdquo; to bulk-confirm everyone at once.
            </li>
            <li className="flex gap-2">
              <span className="text-grass shrink-0">✓</span>
              &ldquo;Chase all unpaid&rdquo; sends a friendly payment reminder email to everyone who hasn&apos;t paid yet (requires their email address).
            </li>
            <li className="flex gap-2">
              <span className="text-grass shrink-0">✓</span>
              The payment summary at the top shows your total collected vs outstanding at a glance.
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-6">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map(faq => (
            <div key={faq.q} className="bg-white rounded-xl border border-[#E5EDEA] p-5">
              <p className="font-semibold text-pitch text-sm mb-1.5">{faq.q}</p>
              <p className="text-sm text-mid leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Support CTA */}
      <section>
        <div className="bg-pitch rounded-xl p-6 text-center">
          <p className="font-heading font-bold text-white text-lg mb-1">Still stuck?</p>
          <p className="text-white/60 text-sm mb-4">Drop us a message and we&apos;ll get back to you quickly.</p>
          <a
            href="mailto:hello@playdrawr.co.uk"
            className="inline-block bg-lime text-pitch font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors"
          >
            Email support
          </a>
        </div>
      </section>

      {/* Back link */}
      <div className="mt-8">
        <Link href="/dashboard" className="text-sm text-mid hover:text-grass transition-colors">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  )
}
