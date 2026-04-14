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
import {
  campaignNoSweepstakeHtml,
  campaignLowParticipantsHtml,
  campaignPushToTenHtml,
} from '@/lib/email/templates/campaign-wc'

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

const SAMPLE_EV = {
  name:            'Alex Johnson',
  organiserName:   'Sarah Mitchell',
  sweepstakeName:  'The Office Eurovision 2026',
  shareToken:      'demoeurovision',
  joinUrl:         `${APP_URL}/join/demoeurovision`,
  leaderboardUrl:  `${APP_URL}/s/demoeurovision`,
  dashboardUrl:    `${APP_URL}/dashboard`,
}

function buildHtml(template: string, version: string, isEurovision: boolean): string | null {
  const s = isEurovision ? SAMPLE_EV : SAMPLE

  switch (template) {
    case 'invite':
      return inviteEmailHtml({
        participantName: s.name,
        sweepstakeName:  s.sweepstakeName,
        shareToken:      s.shareToken,
        isEurovision,
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
        participantName: s.name,
        sweepstakeName:  s.sweepstakeName,
        organiserName:   s.organiserName,
        entryFee:        5,
        shareToken:      s.shareToken,
        isEurovision,
      })

    case 'sweepstake-created':
      return sweepstakeCreatedEmailHtml({
        organiserName:    s.organiserName,
        sweepstakeName:   s.sweepstakeName,
        joinLink:         s.joinUrl,
        leaderboardLink:  s.leaderboardUrl,
        isEurovision,
      })

    case 'participant-joined':
      return participantJoinedEmailHtml({
        organiserName:    s.organiserName,
        participantName:  s.name,
        sweepstakeName:   s.sweepstakeName,
        participantCount: 14,
        dashboardUrl:     s.dashboardUrl,
        isEurovision,
      })

    case 'welcome':
      return welcomeEmailHtml({ name: s.organiserName })

    case 'waitlist-promoted':
      return waitlistPromotedEmailHtml({
        name:           s.name,
        sweepstakeName: s.sweepstakeName,
        shareToken:     s.shareToken,
        entryFee:       5,
        isEurovision,
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

/**
 * Campaign template renderer — reads dynamic data from query params so the
 * CampaignSection can render either sample data or a real organiser record
 * without any server-side state. Preview only, no sending.
 */
function buildCampaignHtml(template: string, p: URLSearchParams): string | null {
  const firstName    = p.get('firstName')    ?? 'Sarah'
  const sweepName    = p.get('sweepName')    ?? 'The Crown World Cup 2026'
  const sweepLink    = p.get('sweepLink')    ?? `${APP_URL}/join/demo2026`
  const createLink   = p.get('createLink')   ?? `${APP_URL}/dashboard/new`
  const countRaw     = p.get('count')
  const count        = countRaw ? parseInt(countRaw, 10) : 5

  switch (template) {
    case 'campaign-1':
      return campaignNoSweepstakeHtml({ firstName, createSweepstakeLink: createLink })
    case 'campaign-2':
      return campaignLowParticipantsHtml({ firstName, sweepstakeName: sweepName, sweepstakeLink: sweepLink })
    case 'campaign-3':
      return campaignPushToTenHtml({ firstName, sweepstakeName: sweepName, sweepstakeLink: sweepLink, participantCount: count })
    default:
      return null
  }
}

export async function GET(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const cookie = req.cookies.get('hc_admin')
  if (!adminPassword || cookie?.value !== adminPassword) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const p        = req.nextUrl.searchParams
  const template = p.get('template') ?? 'organiser-update'
  const version  = p.get('version')  ?? 'A'
  const isEurovision = p.get('variant') === 'eurovision'

  // Campaign templates have their own renderer (accept dynamic query params)
  if (template.startsWith('campaign-')) {
    const html = buildCampaignHtml(template, p)
    if (!html) return new NextResponse('Unknown campaign template', { status: 400 })
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }

  const html = buildHtml(template, version, isEurovision)
  if (!html) {
    return new NextResponse('Unknown template', { status: 400 })
  }

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
