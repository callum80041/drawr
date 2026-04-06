import { MetadataRoute } from 'next'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: APP_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${APP_URL}/how-it-works`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${APP_URL}/blog`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${APP_URL}/blog/world-cup-2026-office-sweepstake`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${APP_URL}/blog/sweepstake-rules`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${APP_URL}/blog/world-cup-2026-teams`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${APP_URL}/blog/pub-sweepstake-world-cup-2026`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/blog/remote-team-sweepstake`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/blog/sweepstake-prize-ideas`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/pricing`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${APP_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${APP_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${APP_URL}/responsible-gambling`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${APP_URL}/affiliate-disclosure`, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
