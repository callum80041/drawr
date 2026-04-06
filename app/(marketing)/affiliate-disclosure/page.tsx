import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — playdrawr',
  description: 'How playdrawr uses affiliate links and what that means for you.',
}

export default function AffiliateDisclosurePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-grass hover:underline mb-8 block">← Back to playdrawr</Link>

      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-2">Affiliate Disclosure</h1>
      <p className="text-mid mb-10">Last updated: April 2026</p>

      <div className="space-y-8 text-mid leading-relaxed">

        <section>
          <h2 className="font-heading text-xl font-bold text-pitch mb-3">What are affiliate links?</h2>
          <p>
            Some links on playdrawr may be affiliate links. This means we may earn a commission if you sign up
            or make a purchase through these links, at no additional cost to you.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-pitch mb-3">What we link to</h2>
          <p>
            We only promote services that are relevant to our users — primarily licensed UK betting and sports
            providers. Any linked service is operated independently of playdrawr. We do not control their
            products, pricing, or terms.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-pitch mb-3">Our editorial independence</h2>
          <p>
            Affiliate relationships do not influence which content appears on playdrawr or how it is presented.
            We do not accept payment to promote specific outcomes, teams, or services editorially.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-pitch mb-3">Responsible gambling</h2>
          <p>
            All linked betting services are intended for users aged 18 and over. If gambling is affecting you,
            visit{' '}
            <a
              href="https://www.begambleaware.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-grass hover:underline"
            >
              BeGambleAware.org
            </a>{' '}
            or call the National Gambling Helpline on{' '}
            <a href="tel:08088020133" className="text-grass hover:underline">0808 8020 133</a>.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-pitch mb-3">Questions?</h2>
          <p>
            If you have any questions about our affiliate relationships, please{' '}
            <Link href="/contact" className="text-grass hover:underline">get in touch</Link>.
          </p>
        </section>

      </div>
    </main>
  )
}
