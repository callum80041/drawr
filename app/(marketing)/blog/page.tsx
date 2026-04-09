import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sweepstake Guides & Tips | playdrawr',
  description: 'How to run a World Cup 2026 sweepstake — guides for offices, pubs, and remote teams. Rules, prizes, and everything you need.',
}

const posts = [
  {
    href: '/blog/how-to-run-a-sweepstake',
    tag: 'Setup guide',
    title: 'How to run a sweepstake: the complete guide',
    desc: 'From creating it to sharing the leaderboard — everything you need, step by step.',
  },
  {
    href: '/blog/world-cup-2026-office-sweepstake',
    tag: 'Office sweepstake',
    title: 'World Cup 2026 office sweepstake: the complete guide',
    desc: 'Everything you need to run a perfect office sweepstake — draw, rules, prizes, and payment tracking.',
  },
  {
    href: '/blog/sweepstake-rules',
    tag: 'Rules',
    title: 'Sweepstake rules: how to run one fairly (UK guide)',
    desc: 'Simple, fair rules for your office or pub. Entry fees, tiebreakers, what counts as winning.',
  },
  {
    href: '/blog/world-cup-2026-teams',
    tag: 'Teams guide',
    title: 'World Cup 2026: all 48 teams and what they mean for your sweepstake',
    desc: 'Favourites, wildcards, and which nations are the dream draw.',
  },
  {
    href: '/blog/pub-sweepstake-world-cup-2026',
    tag: 'Pub guide',
    title: 'How to run a World Cup pub sweepstake in 2026',
    desc: 'A complete guide for pub landlords — entries, draw night, keeping regulars engaged all tournament.',
  },
  {
    href: '/blog/remote-team-sweepstake',
    tag: 'Remote teams',
    title: 'How to run a World Cup sweepstake for a remote or hybrid team',
    desc: 'One shareable link, no logins, automatic standings. Works across any location.',
  },
  {
    href: '/blog/sweepstake-prize-ideas',
    tag: 'Prize ideas',
    title: 'Sweepstake prize ideas: the best rewards aren\'t always cash',
    desc: 'Half days off, trophies, charity donations — the prizes that create stories, not just payouts.',
  },
]

export default function BlogIndexPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-heading text-4xl font-black text-pitch tracking-tight mb-3">Guides</h1>
      <p className="text-mid mb-12">Everything you need to run a World Cup 2026 sweepstake.</p>

      <div className="space-y-4">
        {posts.map(post => (
          <Link
            key={post.href}
            href={post.href}
            className="block bg-white rounded-xl border border-[#E5EDEA] p-6 hover:border-grass transition-colors group"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-mid">{post.tag}</span>
            <h2 className="font-heading text-lg font-bold text-pitch mt-1 mb-2 group-hover:text-grass transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-mid">{post.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-pitch rounded-2xl p-8 text-center">
        <p className="text-white font-heading text-xl font-bold mb-2">Ready to run your sweepstake?</p>
        <p className="text-white/60 text-sm mb-6">Free for up to 48 participants. Takes three minutes.</p>
        <Link href="/signup" className="inline-block bg-lime text-pitch font-bold px-8 py-3 rounded-xl hover:bg-[#b8e03d] transition-colors">
          Create your sweepstake →
        </Link>
      </div>
    </main>
  )
}
