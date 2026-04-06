import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — playdrawr',
  description: 'The rules of the game. playdrawr terms of service.',
}

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="mb-10">
        <p className="text-xs font-medium text-grass uppercase tracking-widest mb-3">Legal</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-pitch tracking-tight leading-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-mid text-sm">Last updated: April 2026</p>
      </div>

      <div className="space-y-8 text-[15px] leading-relaxed text-pitch/80">

        <p>
          Welcome to playdrawr. By using this service you agree to the following terms.
          They&apos;re written in plain English. Please read them — they&apos;re not that long
          and there&apos;s no trick question at the end.
        </p>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">1. What playdrawr is</h2>
          <p>
            playdrawr is a sweepstake management platform for football tournaments. It lets organisers
            create sweepstakes, randomly assign teams to participants, and share a live leaderboard.
            It is a social tool for friends, families, and workplaces — not a gambling service.
          </p>
          <p>
            Any money collected between participants is handled entirely between those participants.
            playdrawr does not process payments, hold funds, or take any cut of prize pots.
            We are not a bookmaker. We are not regulated as one. Please don&apos;t try to use us as one.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">2. Your account</h2>
          <p>
            To create a sweepstake you need an account. You are responsible for keeping your login
            credentials secure and for any activity that occurs under your account.
            You must be 18 or over to create an account.
          </p>
          <p>
            You agree to provide accurate information when signing up. One account per person, please —
            we&apos;re not running a loyalty scheme.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">3. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-1.5 text-pitch/70 ml-2">
            <li>Use playdrawr for any unlawful purpose</li>
            <li>Add participants without their knowledge or consent</li>
            <li>Use offensive, discriminatory, or abusive names for participants or sweepstakes</li>
            <li>Attempt to manipulate, reverse-engineer, or disrupt the service</li>
            <li>Use the platform to run commercial gambling operations</li>
            <li>Automate sweepstake creation or participant addition in bulk without permission</li>
          </ul>
          <p>
            We reserve the right to remove any content or suspend any account that violates these terms,
            without prior notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">4. The draw</h2>
          <p>
            Team assignments are made by a random algorithm. We cannot adjust, influence, or re-run
            draws on your behalf. The randomness is the product. If you drew a strong team, great.
            If you drew a team that&apos;s had a difficult qualifying campaign, we&apos;re sorry —
            but that is genuinely not something we can help with.
          </p>
          <p>
            Organisers can choose to redo a draw or reassign teams manually before the tournament starts.
            Once a tournament is underway, reassigning teams is at the organiser&apos;s discretion —
            not ours.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">5. Scoring and leaderboards</h2>
          <p>
            Scores are calculated automatically from official match results. We use a third-party data
            provider and aim to update results promptly, but we cannot guarantee real-time accuracy.
            playdrawr is not responsible for delays, errors, or omissions in match data.
          </p>
          <p>
            Scores displayed on playdrawr are for entertainment purposes. We accept no liability for
            financial decisions made on the basis of leaderboard positions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">6. Availability</h2>
          <p>
            We aim to keep playdrawr available at all times, but we make no guarantee of uninterrupted
            service. We may perform maintenance, upgrades, or changes at any time. We will try to do
            this at sensible hours and not during a quarter-final.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">7. Free service</h2>
          <p>
            playdrawr is currently free to use. We reserve the right to introduce paid features in
            the future. If we do, existing free features will remain free, and we will give reasonable
            notice before any changes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">8. Limitation of liability</h2>
          <p>
            playdrawr is provided &quot;as is&quot;. To the fullest extent permitted by law, we exclude
            all warranties and accept no liability for any loss or damage arising from your use of the
            service — including, but not limited to, disputes between sweepstake participants, missed
            notifications, or the England team being knocked out on penalties. Again.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">9. Governing law</h2>
          <p>
            These terms are governed by the laws of England and Wales. Any disputes will be subject
            to the exclusive jurisdiction of the English courts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">10. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. The date at the top of this page reflects
            the most recent update. Continued use of playdrawr after changes are posted constitutes
            acceptance of the new terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">11. Contact</h2>
          <p>
            Questions about these terms?{' '}
            <a href="/contact" className="text-grass underline underline-offset-2">Use our contact form</a>{' '}
            or email{' '}
            <a href="mailto:headcoach@playdrawr.co.uk" className="text-grass underline underline-offset-2">
              headcoach@playdrawr.co.uk
            </a>.
          </p>
        </section>

      </div>
    </div>
  )
}
