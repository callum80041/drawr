import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { AdminDashboard } from './AdminDashboard'
import { AdminLogin } from './AdminLogin'

export const dynamic = 'force-dynamic'

export default async function HeadCoachAdminPage() {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get('hc_admin')
  const isAuthed = adminCookie?.value === process.env.ADMIN_PASSWORD

  if (!isAuthed) {
    return <AdminLogin />
  }

  // ── Fetch stats ──────────────────────────────────────────────────────────────
  const supabase = await createServiceClient()

  const now = new Date()
  const d7  = new Date(now); d7.setDate(d7.getDate() - 7)
  const d30 = new Date(now); d30.setDate(d30.getDate() - 30)

  const [
    { count: totalOrganisers },
    { count: organisersLast7 },
    { count: organisersLast30 },
    { data: sweepstakeRows },
    { count: totalParticipants },
    { count: participantsWithEmail },
    { data: recentOrganisers },
  ] = await Promise.all([
    supabase.from('organisers').select('*', { count: 'exact', head: true }),
    supabase.from('organisers').select('*', { count: 'exact', head: true }).gte('created_at', d7.toISOString()),
    supabase.from('organisers').select('*', { count: 'exact', head: true }).gte('created_at', d30.toISOString()),
    supabase.from('sweepstakes').select('id, name, status, created_at, draw_completed_at, entry_fee'),
    supabase.from('participants').select('*', { count: 'exact', head: true }),
    supabase.from('participants').select('*', { count: 'exact', head: true }).not('email', 'is', null),
    supabase.from('organisers').select('id, name, email, created_at').order('created_at', { ascending: false }).limit(10),
  ])

  const sweepstakes = sweepstakeRows ?? []
  const byStatus = sweepstakes.reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1
    return acc
  }, {})

  const drawsDone    = sweepstakes.filter(s => s.draw_completed_at).length
  const paidEntries  = sweepstakes.filter(s => Number(s.entry_fee) > 0).length

  return (
    <AdminDashboard
      stats={{
        totalOrganisers:     totalOrganisers  ?? 0,
        organisersLast7:     organisersLast7  ?? 0,
        organisersLast30:    organisersLast30 ?? 0,
        totalSweepstakes:    sweepstakes.length,
        byStatus,
        drawsDone,
        paidEntries,
        totalParticipants:   totalParticipants   ?? 0,
        participantsWithEmail: participantsWithEmail ?? 0,
      }}
      recentOrganisers={recentOrganisers ?? []}
    />
  )
}
