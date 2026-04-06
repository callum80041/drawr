import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — playdrawr',
  description: 'How playdrawr collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="mb-10">
        <p className="text-xs font-medium text-grass uppercase tracking-widest mb-3">Legal</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-pitch tracking-tight leading-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-mid text-sm">Last updated: April 2026</p>
      </div>

      <div className="prose-custom space-y-8 text-[15px] leading-relaxed text-pitch/80">

        <p>
          playdrawr (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy.
          This policy explains what data we collect, why we collect it, and what we do with it.
          Short version: very little, for good reason, and we never sell it.
        </p>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">1. Who we are</h2>
          <p>
            playdrawr is an online sweepstake platform for football tournaments, operating at{' '}
            <strong className="text-pitch">playdrawr.co.uk</strong>. If you have any questions about
            this policy, contact us at{' '}
            <a href="mailto:headcoach@playdrawr.co.uk" className="text-grass underline underline-offset-2">
              headcoach@playdrawr.co.uk
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">2. What data we collect</h2>
          <p><strong className="text-pitch">If you create an account (organiser):</strong></p>
          <ul className="list-disc list-inside space-y-1.5 text-pitch/70 ml-2">
            <li>Your email address and name, provided at signup</li>
            <li>Sweepstake data you create (names, entry fees, participant lists)</li>
            <li>Authentication tokens managed securely by Supabase</li>
          </ul>
          <p><strong className="text-pitch">If you are added as a participant:</strong></p>
          <ul className="list-disc list-inside space-y-1.5 text-pitch/70 ml-2">
            <li>Your name and, if provided by the organiser, your email address</li>
            <li>Your assigned team and points score</li>
          </ul>
          <p><strong className="text-pitch">Automatically:</strong></p>
          <ul className="list-disc list-inside space-y-1.5 text-pitch/70 ml-2">
            <li>Standard server logs (IP address, browser type, pages visited) — retained for up to 30 days</li>
            <li>No advertising tracking cookies. No third-party analytics beyond what Vercel collects for hosting.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">3. How we use your data</h2>
          <p>We use your data to:</p>
          <ul className="list-disc list-inside space-y-1.5 text-pitch/70 ml-2">
            <li>Run and manage your sweepstakes</li>
            <li>Send transactional emails — draw results, participant invites, and leaderboard updates after matchdays</li>
            <li>Respond to support enquiries</li>
            <li>Improve the service</li>
          </ul>
          <p>
            We do <strong className="text-pitch">not</strong> send marketing emails, newsletters, or
            promotional messages. If we ever email you, it&apos;s because something happened in your
            sweepstake that&apos;s worth knowing about.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">4. Who we share data with</h2>
          <p>
            We do not sell, rent, or trade your personal data. We use the following third-party services
            to operate the platform:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-pitch/70 ml-2">
            <li><strong className="text-pitch">Supabase</strong> — database and authentication (data stored in EU region)</li>
            <li><strong className="text-pitch">Vercel</strong> — hosting and edge infrastructure</li>
            <li><strong className="text-pitch">Resend</strong> — transactional email delivery</li>
          </ul>
          <p>
            Each of these providers processes data only as needed to deliver the service and under
            appropriate data processing agreements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">5. Data retention</h2>
          <p>
            We retain your account data for as long as your account is active. Sweepstake data is
            retained for 12 months after the associated tournament ends, then deleted.
            You can request deletion of your account and all associated data at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">6. Your rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul className="list-disc list-inside space-y-1.5 text-pitch/70 ml-2">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
            <li>Object to or restrict how we process your data</li>
            <li>Data portability — receive your data in a machine-readable format</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{' '}
            <a href="mailto:headcoach@playdrawr.co.uk" className="text-grass underline underline-offset-2">
              headcoach@playdrawr.co.uk
            </a>. We will respond within 30 days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">7. Cookies</h2>
          <p>
            We use a single session cookie to keep you logged in as an organiser. No tracking cookies,
            no advertising cookies. If you&apos;re just viewing a participant leaderboard, no cookies
            are set at all.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">8. Security</h2>
          <p>
            All data is encrypted in transit (HTTPS) and at rest. Authentication is handled by
            Supabase with industry-standard security practices. We do not store passwords in plain text.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">9. Changes to this policy</h2>
          <p>
            If we make material changes, we&apos;ll update the date at the top of this page. We won&apos;t
            email you every time we fix a typo, but we will notify you if anything significant changes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">10. Contact</h2>
          <p>
            Questions about this policy?{' '}
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
