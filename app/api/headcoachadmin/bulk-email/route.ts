import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { organiserUpdateEmailHtml } from '@/lib/email/templates/organiser-update'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

function authCheck(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const cookie = req.cookies.get('hc_admin')
  return !!adminPassword && cookie?.value === adminPassword
}

// GET — preview: returns list of recipients + which version they get, no emails sent
export async function GET(req: NextRequest) {
  if (!authCheck(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = await createServiceClient()

  const { data: organisers } = await service
    .from('organisers')
    .select(`
      id, name, email,
      sweepstakes ( id, share_token, status )
    `)
    .order('created_at', { ascending: true })

  const recipients = (organisers ?? []).map(o => {
    const sweepstakes = (o.sweepstakes as { id: string; share_token: string; status: string }[]) ?? []
    // Pick their first/most relevant sweepstake (prefer active, then setup)
    const best = sweepstakes.find(s => s.status === 'active')
      ?? sweepstakes.find(s => s.status === 'setup')
      ?? sweepstakes[0]
      ?? null

    const joinUrl = best ? `${APP_URL}/join/${best.share_token}` : null

    return {
      id: o.id,
      name: o.name,
      email: o.email,
      version: joinUrl ? 'A' : 'B',
      joinUrl,
    }
  })

  return NextResponse.json({ recipients })
}

// POST — actually send
export async function POST(req: NextRequest) {
  if (!authCheck(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = await createServiceClient()

  const { data: organisers } = await service
    .from('organisers')
    .select(`
      id, name, email,
      sweepstakes ( id, share_token, status )
    `)
    .order('created_at', { ascending: true })

  const results: { email: string; ok: boolean; error?: string }[] = []

  for (const o of organisers ?? []) {
    const sweepstakes = (o.sweepstakes as { id: string; share_token: string; status: string }[]) ?? []
    const best = sweepstakes.find(s => s.status === 'active')
      ?? sweepstakes.find(s => s.status === 'setup')
      ?? sweepstakes[0]
      ?? null

    const joinUrl = best ? `${APP_URL}/join/${best.share_token}` : null
    const dashboardUrl = `${APP_URL}/dashboard`

    try {
      await sendEmail({
        to: o.email,
        subject: 'A quick one from the dugout ⚽',
        html: organiserUpdateEmailHtml({ name: o.name, joinUrl, dashboardUrl }),
        replyTo: 'hello@playdrawr.co.uk',
      })
      results.push({ email: o.email, ok: true })
    } catch (err) {
      results.push({ email: o.email, ok: false, error: String(err) })
    }

    // Small delay to stay within Resend rate limits
    await new Promise(r => setTimeout(r, 100))
  }

  const sent   = results.filter(r => r.ok).length
  const failed = results.filter(r => !r.ok).length

  return NextResponse.json({ ok: true, sent, failed, results })
}
