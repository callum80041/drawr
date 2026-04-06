import { NextResponse } from 'next/server'
import { sweepstakeCreatedEmailHtml } from '@/lib/email/templates/sweepstake-created'

export async function GET() {
  const html = sweepstakeCreatedEmailHtml({
    organiserName: 'Callum',
    sweepstakeName: 'Office World Cup 2026',
    joinLink: 'https://playdrawr.co.uk/join/abc123def456',
    leaderboardLink: 'https://playdrawr.co.uk/s/abc123def456',
  })
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
}
