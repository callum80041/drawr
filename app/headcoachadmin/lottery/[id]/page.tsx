import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { LotterySyndicateAdmin } from './LotterySyndicateAdmin'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export default async function LotterySyndicateAdminPage({ params }: Props) {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get('hc_admin')
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || adminCookie?.value !== adminPassword) redirect('/headcoachadmin')

  const { id } = await params
  const supabase = await createServiceClient()

  const [
    { data: syndicate },
    { data: members },
    { data: payments },
    { data: draws },
    { data: winners },
  ] = await Promise.all([
    supabase.from('syndicates').select('*').eq('id', id).single(),
    supabase.from('syndicate_members').select('*').eq('syndicate_id', id).order('name'),
    supabase.from('syndicate_payments').select('*').eq('syndicate_id', id).order('week_date', { ascending: true }),
    supabase.from('lottery_draws').select('*').eq('syndicate_id', id).order('draw_date', { ascending: true }),
    supabase.from('syndicate_winners').select('*, syndicate_members(name)').eq('syndicate_id', id).order('created_at', { ascending: false }),
  ])

  if (!syndicate) notFound()

  // Check Stripe Connect status live
  let stripeConnected = false
  let stripeChargesEnabled = false
  if (syndicate.stripe_account_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const account = await stripe.accounts.retrieve(syndicate.stripe_account_id)
      stripeChargesEnabled = !!(account.charges_enabled && account.details_submitted)
      stripeConnected = true
      if (stripeChargesEnabled && !syndicate.stripe_onboarding_complete) {
        await supabase.from('syndicates').update({ stripe_onboarding_complete: true }).eq('id', id)
      }
    } catch { /* Stripe not configured */ }
  }

  return (
    <LotterySyndicateAdmin
      syndicate={{ ...syndicate, stripe_onboarding_complete: stripeConnected ? stripeChargesEnabled : syndicate.stripe_onboarding_complete }}
      members={members ?? []}
      payments={payments ?? []}
      draws={draws ?? []}
      winners={winners ?? []}
      appUrl={process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'}
    />
  )
}
