import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

// POST /api/lottery/pay  { memberToken, weekDate }
// Creates a Stripe Checkout session that transfers funds to the organiser's connected account.
export async function POST(req: NextRequest) {
  const { memberToken, weekDate } = await req.json()
  if (!memberToken || !weekDate) {
    return NextResponse.json({ error: 'memberToken and weekDate are required' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'
  const supabase = await createServiceClient()

  const { data: member } = await supabase
    .from('syndicate_members')
    .select('id, name, syndicate_id, syndicates(id, name, entry_fee_pence, stripe_account_id, stripe_onboarding_complete)')
    .eq('view_token', memberToken)
    .single()

  if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

  const syndicate = (member.syndicates as unknown) as {
    id: string; name: string; entry_fee_pence: number
    stripe_account_id: string | null; stripe_onboarding_complete: boolean
  } | null

  if (!syndicate?.stripe_account_id || !syndicate.stripe_onboarding_complete) {
    return NextResponse.json({ error: 'Stripe not connected for this syndicate' }, { status: 400 })
  }

  // Prevent duplicate payment
  const { data: existing } = await supabase
    .from('syndicate_payments')
    .select('id, paid')
    .eq('member_id', member.id)
    .eq('week_date', weekDate)
    .single()

  if (existing?.paid) {
    return NextResponse.json({ error: 'Already paid for this week' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: { name: `${syndicate.name} — week of ${weekDate}` },
        unit_amount: syndicate.entry_fee_pence,
      },
      quantity: 1,
    }],
    payment_intent_data: {
      transfer_data: { destination: syndicate.stripe_account_id },
    },
    success_url: `${appUrl}/lottery/${memberToken}?paid=1&week=${weekDate}`,
    cancel_url:  `${appUrl}/lottery/${memberToken}`,
    metadata: {
      member_id:    member.id,
      syndicate_id: syndicate.id,
      week_date:    weekDate,
      member_token: memberToken,
    },
  })

  return NextResponse.json({ url: session.url })
}
