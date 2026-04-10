import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sweepstake Guides & Tips | playdrawr',
  description: 'How to run a World Cup 2026 or Eurovision 2026 sweepstake — guides for offices, pubs, and remote teams. Rules, prizes, and everything you need.',
}

const eurovisionPosts = [
  {
    href: '/blog/eurovision-sweepstake-guide',
    tag: 'Eurovision guide',
    title: 'Eurovision sweepstake: how to run one properly',
    desc: 'Random draw, live leaderboard, real scoring. Everything you need to run a Eurovision sweepstake from scratch.',
  },
  {
    href: '/blog/eurovision-countries-guide',
    tag: 'Eurovision guide',
    title: 'Eurovision countries: favourites, outsiders, and sweepstake strategy',
    desc: 'Favourites, mid-tier contenders, and wildcards — and why the split makes Eurovision perfect for sweepstakes.',
  },
  {
    href: '/blog/eurovision-sweepstake-rules',
    tag: 'Rules',
    title: 'Eurovision sweepstake rules: keep it simple and fair',
    desc: 'Core rules, optional extras, tiebreakers, and what to avoid. Set once, agreed upfront, no mid-event disputes.',
  },
  {
    href: '/blog/eurovision-office-sweepstake',
    tag: 'Office sweepstake',
    title: 'Eurovision office sweepstake: low effort, high engagement',
    desc: 'Inclusive, short, and no expertise required. Why Eurovision is one of the best office engagement activities going.',
  },
  {
    href: '/blog/eurovision-sweepstake-ideas',
    tag: 'Ideas',
    title: 'Eurovision sweepstake ideas that actually improve engagement',
    desc: 'Last place forfeits, prediction overlays, semi-final survival rounds — light variations that enhance without overcomplicating.',
  },
  {
    href: '/blog/pub-eurovision-sweepstake',
    tag: 'Pub guide',
    title: 'Eurovision pub sweepstake: how to maximise the night',
    desc: 'More dwell time, repeat visits, higher engagement. Full guide for pub landlords and bar managers.',
  },
  {
    href: '/blog/digital-sweepstake',
    tag: 'Tools guide',
    title: 'Why digital sweepstakes outperform paper every time',
    desc: 'The operational efficiency gap between paper and digital — and why you will not go back once you run one online.',
  },
]

const wcPosts = [
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
      <p className="text-mid mb-12">Everything you need to run a World Cup 2026 or Eurovision 2026 sweepstake.</p>

      {/* Eurovision section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">🎤</span>
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#5A22A9' }}>Eurovision 2026</h2>
        </div>
        <div className="space-y-3">
          {eurovisionPosts.map(post => (
            <Link
              key={post.href}
              href={post.href}
              className="block bg-white rounded-xl border p-6 transition-colors group"
              style={{ borderColor: 'rgba(90,34,169,0.15)' }}
              onMouseEnter={undefined}
            >
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#5A22A9' }}>{post.tag}</span>
              <h2 className="font-heading text-lg font-bold text-pitch mt-1 mb-2 transition-colors" style={{}}>
                {post.title}
              </h2>
              <p className="text-sm text-mid">{post.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* World Cup section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">⚽</span>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-grass">World Cup 2026</h2>
        </div>
        <div className="space-y-3">
          {wcPosts.map(post => (
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
      </section>

      <div className="mt-4 bg-pitch rounded-2xl p-8 text-center">
        <p className="text-white font-heading text-xl font-bold mb-2">Ready to run your sweepstake?</p>
        <p className="text-white/60 text-sm mb-6">World Cup or Eurovision — free forever. Takes three minutes.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="inline-block bg-lime text-pitch font-bold px-8 py-3 rounded-xl hover:bg-[#b8e03d] transition-colors"
          >
            Create your sweepstake →
          </Link>
          <Link
            href="/s/demoeurovision"
            className="inline-block font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
            style={{ background: '#F10F59', color: '#fff' }}
          >
            🎤 Eurovision demo
          </Link>
        </div>
      </div>
    </main>
  )
}
