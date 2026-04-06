import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Responsible Gambling — playdrawr',
  description: 'Playdrawr is a sweepstake tool for entertainment purposes only. No gambling services are provided.',
}

export default function ResponsibleGamblingPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-grass hover:underline mb-8 block">← Back to playdrawr</Link>

      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-2">Responsible Gambling</h1>
      <p className="text-mid mb-10">Last updated: April 2026</p>

      <div className="prose prose-sm max-w-none space-y-10">

        <section>
          <h2 className="font-heading text-xl font-bold text-pitch mb-3">Platform Position</h2>
          <p className="text-mid leading-relaxed">
            Playdrawr does not offer gambling services. We provide tools to run sweepstakes for entertainment purposes only,
            and may display links to licensed third-party betting providers. No gambling functionality exists on this platform.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-pitch mb-3">Age Restriction</h2>
          <p className="text-mid leading-relaxed">
            Our platform is intended for users aged 18 and over. We do not knowingly promote gambling or sweepstakes
            to individuals under the age of 18. By joining or creating a sweepstake on playdrawr, you confirm you are
            18 or older.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-pitch mb-3">Third-Party Responsibility</h2>
          <p className="text-mid leading-relaxed">
            Any betting services linked from playdrawr are operated by independently licensed third parties.
            Playdrawr accepts no responsibility for third-party content. Users should review their terms and
            conditions before using any linked service, and always gamble responsibly.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-pitch mb-3">Support Resources</h2>
          <p className="text-mid leading-relaxed mb-4">
            If gambling is affecting you or someone you know, free confidential support is available:
          </p>
          <div className="bg-light rounded-xl p-6 space-y-3">
            <div>
              <p className="font-semibold text-pitch">BeGambleAware</p>
              <a
                href="https://www.begambleaware.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-grass hover:underline text-sm"
              >
                www.begambleaware.org
              </a>
            </div>
            <div>
              <p className="font-semibold text-pitch">National Gambling Helpline (UK)</p>
              <a href="tel:08088020133" className="text-grass hover:underline text-sm">0808 8020 133</a>
              <p className="text-xs text-mid mt-0.5">Free, confidential, available 24/7</p>
            </div>
            <div>
              <p className="font-semibold text-pitch">GamCare</p>
              <a
                href="https://www.gamcare.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-grass hover:underline text-sm"
              >
                www.gamcare.org.uk
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-pitch mb-3">Our Commitment</h2>
          <p className="text-mid leading-relaxed">
            We aim to promote responsible behaviour and avoid misleading or aggressive promotion of betting
            services. If you have concerns about how any content on playdrawr is presented, please{' '}
            <Link href="/contact" className="text-grass hover:underline">contact us</Link>.
          </p>
        </section>

      </div>
    </main>
  )
}
