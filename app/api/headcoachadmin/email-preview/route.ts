import { NextRequest, NextResponse } from 'next/server'
import { inviteEmailHtml }                   from '@/lib/email/templates/invite'
import { drawCompleteEmailHtml }             from '@/lib/email/templates/draw-complete'
import { drawCompleteEurovisionEmailHtml }   from '@/lib/email/templates/draw-complete-eurovision'
import { paymentChaseEmailHtml }             from '@/lib/email/templates/payment-chase'
import { sweepstakeCreatedEmailHtml }        from '@/lib/email/templates/sweepstake-created'
import { participantJoinedEmailHtml }        from '@/lib/email/templates/participant-joined'
import { welcomeEmailHtml }                  from '@/lib/email/templates/welcome'
import { waitlistPromotedEmailHtml }         from '@/lib/email/templates/waitlist-promoted'
import { organiserUpdateEmailHtml }          from '@/lib/email/templates/organiser-update'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

const SAMPLE = {
  name:            'Alex Johnson',
  organiserName:   'Sarah Mitchell',
  sweepstakeName:  'The Crown World Cup 2026',
  shareToken:      'demo2026',
  joinUrl:         `${APP_URL}/join/demo2026`,
  leaderboardUrl:  `${APP_URL}/s/demo2026`,
  dashboardUrl:    `${APP_URL}/dashboard`,
}

function buildHtml(template: string, version: string): string | null {
  switch (template) {
    case 'invite':
      return inviteEmailHtml({
        participantName: SAMPLE.name,
        sweepstakeName:  SAMPLE.sweepstakeName,
        shareToken:      SAMPLE.shareToken,
      })

    case 'draw-complete':
      return drawCompleteEmailHtml({
        participantName: SAMPLE.name,
        sweepstakeName:  SAMPLE.sweepstakeName,
        shareToken:      SAMPLE.shareToken,
        teams: [
          { name: 'Brazil',    flag: '🇧🇷', group_name: 'Group E' },
          { name: 'Argentina', flag: '🇦🇷', group_name: 'Group F' },
        ],
      })

    case 'draw-complete-eurovision':
      return drawCompleteEurovisionEmailHtml({
        participantName: SAMPLE.name,
        sweepstakeName:  'The Office Eurovision 2026',
        shareToken:      'demoeurovision',
        countries: [
          { name: 'Sweden',    flag: '🇸🇪', semi_final: null },
          { name: 'Bulgaria',  flag: '🇧🇬', semi_final: 1 },
        ],
      })

    case 'payment-chase':
      return paymentChaseEmailHtml({
        participantName: SAMPLE.name,
        sweepstakeName:  SAMPLE.sweepstakeName,
        organiserName:   SAMPLE.organiserName,
        entryFee:        5,
        shareToken:      SAMPLE.shareToken,
      })

    case 'sweepstake-created':
      return sweepstakeCreatedEmailHtml({
        organiserName:    SAMPLE.organiserName,
        sweepstakeName:   SAMPLE.sweepstakeName,
        joinLink:         SAMPLE.joinUrl,
        leaderboardLink:  SAMPLE.leaderboardUrl,
      })

    case 'participant-joined':
      return participantJoinedEmailHtml({
        organiserName:    SAMPLE.organiserName,
        participantName:  SAMPLE.name,
        sweepstakeName:   SAMPLE.sweepstakeName,
        participantCount: 14,
        dashboardUrl:     SAMPLE.dashboardUrl,
      })

    case 'welcome':
      return welcomeEmailHtml({ name: SAMPLE.organiserName })

    case 'waitlist-promoted':
      return waitlistPromotedEmailHtml({
        name:           SAMPLE.name,
        sweepstakeName: SAMPLE.sweepstakeName,
        shareToken:     SAMPLE.shareToken,
        entryFee:       5,
      })

    case 'organiser-update':
    default:
      // Legacy: version A/B used by the bulk email preview
      return organiserUpdateEmailHtml({
        name:         'Alex',
        joinUrl:      version === 'A' ? SAMPLE.joinUrl : null,
        dashboardUrl: SAMPLE.dashboardUrl,
      })
  }
}

export async function GET(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const cookie = req.cookies.get('hc_admin')
  if (!adminPassword || cookie?.value !== adminPassword) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const template = req.nextUrl.searchParams.get('template') ?? 'organiser-update'
  const version  = req.nextUrl.searchParams.get('version')  ?? 'A'

  const html = buildHtml(template, version)
  if (!html) {
    return new NextResponse('Unknown template', { status: 400 })
  }

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
