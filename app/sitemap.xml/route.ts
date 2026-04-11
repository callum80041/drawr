import { NextResponse } from 'next/server'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

interface SitemapEntry {
  loc: string
  changefreq: string
  priority: string
}

const urls: SitemapEntry[] = [
  // Core pages
  { loc: APP_URL,                                  changefreq: 'weekly',  priority: '1.0' },
  { loc: `${APP_URL}/worldcup`,                    changefreq: 'weekly',  priority: '0.95' },
  { loc: `${APP_URL}/eurovision`,                  changefreq: 'weekly',  priority: '0.95' },
  { loc: `${APP_URL}/how-it-works`,                changefreq: 'monthly', priority: '0.85' },

  // Blog index
  { loc: `${APP_URL}/blog`,                        changefreq: 'weekly',  priority: '0.8' },

  // Eurovision blog posts
  { loc: `${APP_URL}/blog/eurovision-sweepstake-guide`,    changefreq: 'monthly', priority: '0.85' },
  { loc: `${APP_URL}/blog/eurovision-countries-guide`,     changefreq: 'monthly', priority: '0.8' },
  { loc: `${APP_URL}/blog/eurovision-sweepstake-rules`,    changefreq: 'monthly', priority: '0.8' },
  { loc: `${APP_URL}/blog/eurovision-office-sweepstake`,   changefreq: 'monthly', priority: '0.8' },
  { loc: `${APP_URL}/blog/eurovision-sweepstake-ideas`,    changefreq: 'monthly', priority: '0.75' },
  { loc: `${APP_URL}/blog/pub-eurovision-sweepstake`,      changefreq: 'monthly', priority: '0.75' },
  { loc: `${APP_URL}/blog/digital-sweepstake`,             changefreq: 'monthly', priority: '0.75' },

  // World Cup blog posts
  { loc: `${APP_URL}/blog/how-to-run-a-sweepstake`,             changefreq: 'monthly', priority: '0.85' },
  { loc: `${APP_URL}/blog/world-cup-2026-office-sweepstake`,    changefreq: 'monthly', priority: '0.8' },
  { loc: `${APP_URL}/blog/sweepstake-rules`,                    changefreq: 'monthly', priority: '0.8' },
  { loc: `${APP_URL}/blog/world-cup-2026-teams`,                changefreq: 'monthly', priority: '0.75' },
  { loc: `${APP_URL}/blog/pub-sweepstake-world-cup-2026`,       changefreq: 'monthly', priority: '0.75' },
  { loc: `${APP_URL}/blog/remote-team-sweepstake`,              changefreq: 'monthly', priority: '0.7' },
  { loc: `${APP_URL}/blog/sweepstake-prize-ideas`,              changefreq: 'monthly', priority: '0.7' },

  // Legal / utility
  { loc: `${APP_URL}/contact`,              changefreq: 'yearly', priority: '0.5' },
  { loc: `${APP_URL}/privacy`,              changefreq: 'yearly', priority: '0.3' },
  { loc: `${APP_URL}/terms`,               changefreq: 'yearly', priority: '0.3' },
  { loc: `${APP_URL}/responsible-gambling`, changefreq: 'yearly', priority: '0.3' },
  { loc: `${APP_URL}/affiliate-disclosure`, changefreq: 'yearly', priority: '0.3' },
]

function buildXml(entries: SitemapEntry[]): string {
  const rows = entries.map(e => `  <url>
    <loc>${e.loc}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>`
}

export async function GET() {
  return new NextResponse(buildXml(urls), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
