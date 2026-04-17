import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
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
    supabase.from('syndicate_payments').select('*').eq('syndicate_id', id).order('week_date', { ascending: false }),
    supabase.from('lottery_draws').select('*').eq('syndicate_id', id).order('draw_date', { ascending: false }),
    supabase.from('syndicate_winners').select('*, syndicate_members(name)').eq('syndicate_id', id).order('created_at', { ascending: false }),
  ])

  if (!syndicate) notFound()

  return (
    <LotterySyndicateAdmin
      syndicate={syndicate}
      members={members ?? []}
      payments={payments ?? []}
      draws={draws ?? []}
      winners={winners ?? []}
      appUrl={process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'}
    />
  )
}
