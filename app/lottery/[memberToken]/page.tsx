import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { ParticipantView } from './ParticipantView'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ memberToken: string }> }

export default async function ParticipantPage({ params }: Props) {
  const { memberToken } = await params
  const supabase = await createServiceClient()

  const { data: member } = await supabase
    .from('syndicate_members')
    .select('*, syndicates(*)')
    .eq('view_token', memberToken)
    .single()

  if (!member || !member.syndicates) notFound()

  const syndicate = member.syndicates as {
    id: string; name: string; entry_fee_pence: number; current_pot_cycle: number
    stripe_account_id: string | null; stripe_onboarding_complete: boolean
  }

  const cycle = syndicate.current_pot_cycle

  const [
    { data: allMembers },
    { data: draws },
    { data: myPayments },
    { data: winners },
    { data: allPayments },
  ] = await Promise.all([
    supabase.from('syndicate_members').select('id, name, number1, number2, number3, number4, number5, number6, left_at').eq('syndicate_id', syndicate.id).is('left_at', null).order('name'),
    supabase.from('lottery_draws').select('*').eq('syndicate_id', syndicate.id).order('draw_date', { ascending: true }),
    supabase.from('syndicate_payments').select('week_date, paid, payment_method').eq('member_id', member.id).order('week_date', { ascending: true }),
    supabase.from('syndicate_winners').select('*, syndicate_members(name)').eq('syndicate_id', syndicate.id).order('created_at', { ascending: false }),
    supabase.from('syndicate_payments').select('week_date, paid').eq('syndicate_id', syndicate.id),
  ])

  // Drawn balls in current cycle
  const cycleDraws = (draws ?? []).filter(d => d.pot_cycle === cycle).sort((a, b) => a.draw_date.localeCompare(b.draw_date))
  const drawnBalls = new Set<number>()
  for (const d of cycleDraws) {
    drawnBalls.add(d.ball1); drawnBalls.add(d.ball2); drawnBalls.add(d.ball3)
    drawnBalls.add(d.ball4); drawnBalls.add(d.ball5); drawnBalls.add(d.ball6)
  }

  // Pot value
  const cycleStart = cycleDraws[0]?.draw_date ?? null
  const latestDraw = cycleDraws[cycleDraws.length - 1]?.draw_date ?? null
  const potPence = (cycleStart && latestDraw && allPayments)
    ? allPayments.filter(p => p.paid && p.week_date >= cycleStart && p.week_date <= latestDraw).length * syndicate.entry_fee_pence
    : 0

  const myNumbers = [member.number1, member.number2, member.number3, member.number4, member.number5, member.number6]
  const myNeeds = myNumbers.filter(n => !drawnBalls.has(n)).length

  // Eligibility: paid every draw week in current cycle
  const myPaidWeeks = new Set((myPayments ?? []).filter(p => p.paid).map(p => p.week_date))
  const eligible = cycleDraws.length > 0 && cycleDraws.every(d => myPaidWeeks.has(d.draw_date))

  // Leaderboard
  const leaderboard = (allMembers ?? [])
    .map(m => {
      const nums = [m.number1, m.number2, m.number3, m.number4, m.number5, m.number6]
      return { id: m.id, name: m.name, needs: nums.filter(n => !drawnBalls.has(n)).length, numbers: nums }
    })
    .sort((a, b) => a.needs - b.needs)

  return (
    <ParticipantView
      memberToken={memberToken}
      member={{ id: member.id, name: member.name }}
      syndicateName={syndicate.name}
      stripeEnabled={!!syndicate.stripe_onboarding_complete}
      myNumbers={myNumbers}
      myNeeds={myNeeds}
      eligible={eligible}
      potPence={potPence}
      drawnBalls={[...drawnBalls]}
      cycleDraws={cycleDraws}
      leaderboard={leaderboard}
      myPayments={(myPayments ?? []).map(p => ({ week_date: p.week_date, paid: p.paid, payment_method: p.payment_method }))}
      winners={(winners ?? []).map(w => ({ draw_date: w.draw_date, amount_pence: w.amount_pence, name: (w.syndicate_members as { name: string } | null)?.name ?? '–' }))}
      entryFeePence={syndicate.entry_fee_pence}
    />
  )
}
