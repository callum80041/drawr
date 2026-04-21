import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

function isAuthed(req: NextRequest): boolean {
  const pw = process.env.ADMIN_PASSWORD
  return !!pw && req.cookies.get('hc_admin')?.value === pw
}

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })
  if (!stripe) return new NextResponse('Stripe not configured', { status: 500 })
  const { id } = await params
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

  const supabase = await createServiceClient()
  const { data: syndicate } = await supabase
    .from('syndicates')
    .select('stripe_account_id')
    .eq('id', id)
    .single()

  // Reuse existing account if already created
  let accountId = syndicate?.stripe_account_id as string | null

  if (!accountId) {
    const account = await stripe!.accounts.create({
      type: 'express',
      country: 'GB',
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
    })
    accountId = account.id
    await supabase.from('syndicates').update({ stripe_account_id: accountId }).eq('id', id)
  }

  const accountLink = await stripe!.accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl}/headcoachadmin/lottery/${id}?stripe=refresh`,
    return_url:  `${appUrl}/headcoachadmin/lottery/${id}?stripe=success`,
    type: 'account_onboarding',
  })

  return NextResponse.json({ url: accountLink.url })
}

// Check onboarding status by querying Stripe directly
export async function GET(req: NextRequest, { params }: Params) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })
  if (!stripe) return new NextResponse('Stripe not configured', { status: 500 })
  const { id } = await params

  const supabase = await createServiceClient()
  const { data: syndicate } = await supabase
    .from('syndicates')
    .select('stripe_account_id, stripe_onboarding_complete')
    .eq('id', id)
    .single()

  if (!syndicate?.stripe_account_id) {
    return NextResponse.json({ connected: false, charges_enabled: false })
  }

  const account = await stripe.accounts.retrieve(syndicate.stripe_account_id)
  const complete = account.charges_enabled && account.details_submitted

  if (complete && !syndicate.stripe_onboarding_complete) {
    await supabase.from('syndicates').update({ stripe_onboarding_complete: true }).eq('id', id)
  }

  return NextResponse.json({ connected: true, charges_enabled: account.charges_enabled, details_submitted: account.details_submitted })
}
