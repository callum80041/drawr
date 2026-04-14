import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import {
  campaignNoSweepstakeHtml,
  campaignLowParticipantsHtml,
  campaignPushToTenHtml,
} from '@/lib/email/templates/campaign-wc'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

const CAMPAIGN_SUBJECTS: Record<1 | 2 | 3, string> = {
  1: 'Start your World Cup sweepstake',
  2: 'Your sweepstake link is ready to share',
  3: 'Get your sweepstake to 10 players by 30 April',
}

type CampaignId = 1 | 2 | 3

type Qualifier = {
  name: string
  email: string
  sweepstakeName?: string
  shareToken?: string
  participantCount?: number
}

// ── Audience segmentation (mirrors page.tsx) ─────────────────────────────────

async function buildAudience(supabase: Awaited<ReturnType<typeof createServiceClient>>, campaignId: CampaignId): Promise<Qualifier[]> {
  const { data: organisers, error } = await supabase
    .from('organisers')
    .select(`
      id, name, email,
      sweepstakes (
        id, name, share_token, sweepstake_type,
        participants ( id )
      )
    `)
  if (error) throw new Error('Failed to fetch organisers')

  const qualifiers: Qualifier[] = []

  for (const org of organisers ?? []) {
    const wcSweepstakes = (org.sweepstakes as {
      id: string; name: string; share_token: string; sweepstake_type: string | null
      participants: { id: string }[]
    }[]).filter(s => s.sweepstake_type === 'worldcup')

    if (campaignId === 1 && wcSweepstakes.length === 0) {
      qualifiers.push({ name: org.name, email: org.email })
      continue
    }

    if (wcSweepstakes.length === 0) continue

    const best = wcSweepstakes.reduce((a, b) =>
      (a.participants?.length ?? 0) >= (b.participants?.length ?? 0) ? a : b
    )
    const count = best.participants?.length ?? 0

    if (campaignId === 2 && count < 3) {
      qualifiers.push({
        name: org.name, email: org.email,
        sweepstakeName: best.name, shareToken: best.share_token, participantCount: count,
      })
    } else if (campaignId === 3 && count >= 3 && count <= 9) {
      qualifiers.push({
        name: org.name, email: org.email,
        sweepstakeName: best.name, shareToken: best.share_token, participantCount: count,
      })
    }
  }

  return qualifiers
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const cookie = req.cookies.get('hc_admin')
  if (!adminPassword || cookie?.value !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  let campaignId: CampaignId
  try {
    const body = await req.json() as { campaignId: unknown }
    if (body.campaignId !== 1 && body.campaignId !== 2 && body.campaignId !== 3) {
      return NextResponse.json({ error: 'Invalid campaignId' }, { status: 400 })
    }
    campaignId = body.campaignId as CampaignId
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const templateId = `campaign-${campaignId}`

  // Recompute audience fresh — never trust client-supplied recipients
  let qualifiers: Qualifier[]
  try {
    qualifiers = await buildAudience(supabase, campaignId)
  } catch {
    return NextResponse.json({ error: 'Failed to build audience' }, { status: 500 })
  }

  if (qualifiers.length === 0) {
    return NextResponse.json({ sent: 0, skipped: 0, failed: 0 })
  }

  const emails = qualifiers.map(q => q.email)

  // ── Deduplication: emails already sent this campaign ──────────────────────
  const { data: alreadySentRows } = await supabase
    .from('email_log')
    .select('to_email')
    .eq('template', templateId)
    .in('to_email', emails)

  const alreadySent = new Set((alreadySentRows ?? []).map(r => r.to_email as string))

  // ── Unsubscribe tokens: upsert to create tokens for new addresses ──────────
  await supabase
    .from('email_campaign_tokens')
    .upsert(
      emails.map(e => ({ email: e })),
      { onConflict: 'email', ignoreDuplicates: true }
    )

  const { data: tokenRows } = await supabase
    .from('email_campaign_tokens')
    .select('email, token, unsubscribed_at')
    .in('email', emails)

  const tokenMap = new Map<string, { token: string; unsubscribed_at: string | null }>()
  for (const row of tokenRows ?? []) {
    tokenMap.set(row.email as string, {
      token: row.token as string,
      unsubscribed_at: row.unsubscribed_at as string | null,
    })
  }

  // ── Send loop ─────────────────────────────────────────────────────────────
  let sent = 0
  let skipped = 0
  let failed = 0

  for (const q of qualifiers) {
    // Skip if already received this campaign email
    if (alreadySent.has(q.email)) { skipped++; continue }

    // Skip if unsubscribed
    const tokenRow = tokenMap.get(q.email)
    if (tokenRow?.unsubscribed_at) { skipped++; continue }

    const firstName = q.name.split(' ')[0] ?? q.name
    const unsubscribeUrl = tokenRow
      ? `${APP_URL}/unsubscribe?token=${tokenRow.token}`
      : undefined

    let html: string
    if (campaignId === 1) {
      html = campaignNoSweepstakeHtml({
        firstName,
        createSweepstakeLink: `${APP_URL}/dashboard/new`,
        unsubscribeUrl,
      })
    } else if (campaignId === 2) {
      html = campaignLowParticipantsHtml({
        firstName,
        sweepstakeName: q.sweepstakeName ?? 'Your sweepstake',
        sweepstakeLink: `${APP_URL}/join/${q.shareToken ?? ''}`,
        unsubscribeUrl,
      })
    } else {
      html = campaignPushToTenHtml({
        firstName,
        sweepstakeName: q.sweepstakeName ?? 'Your sweepstake',
        sweepstakeLink: `${APP_URL}/join/${q.shareToken ?? ''}`,
        participantCount: q.participantCount ?? 5,
        unsubscribeUrl,
      })
    }

    try {
      await sendEmail({
        to: q.email,
        subject: CAMPAIGN_SUBJECTS[campaignId],
        html,
        template: templateId,
      })
      sent++
    } catch {
      failed++
    }
  }

  return NextResponse.json({ sent, skipped, failed })
}
