import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  if (!stripe) return new NextResponse('Stripe not configured', { status: 500 })

  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')

  if (!sig) return new NextResponse('Missing signature', { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe!.webhooks.constructEvent(body, sig, process.env.STRIPE_LOTTERY_WEBHOOK_SECRET!)
  } catch {
    return new NextResponse('Webhook signature verification failed', { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const { member_id, syndicate_id, week_date } = session.metadata ?? {}

  if (!member_id || !syndicate_id || !week_date) {
    return new NextResponse('Missing metadata', { status: 400 })
  }

  const supabase = await createServiceClient()
  await supabase
    .from('syndicate_payments')
    .upsert(
      {
        syndicate_id,
        member_id,
        week_date,
        paid:                      true,
        payment_method:            'stripe',
        stripe_checkout_session_id: session.id,
      },
      { onConflict: 'member_id,week_date' }
    )

  return NextResponse.json({ received: true })
}
