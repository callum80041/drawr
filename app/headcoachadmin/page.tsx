import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'
import { AdminDashboard } from './AdminDashboard'
import { AdminLogin } from './AdminLogin'

export const dynamic = 'force-dynamic'

async function fetchVercelAnalytics() {
  const token     = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  if (!token || !projectId) return null

  const now  = Date.now()
  const d7   = now - 7  * 24 * 60 * 60 * 1000
  const d30  = now - 30 * 24 * 60 * 60 * 1000

  const headers = { Authorization: `Bearer ${token}` }

  async function getStats(from: number, to: number) {
    const url = `https://api.vercel.com/v1/web/insights/stats?projectId=${projectId}&from=${from}&to=${to}&environment=production&filter=%7B%7D`
    const res = await fetch(url, { headers, next: { revalidate: 0 } })
    if (!res.ok) return null
    return res.json()
  }

  async function getTopPages() {
    const url = `https://api.vercel.com/v1/web/insights/path?projectId=${projectId}&from=${d30}&to=${now}&environment=production&filter=%7B%7D&limit=8`
    const res = await fetch(url, { headers, next: { revalidate: 0 } })
    if (!res.ok) return null
    return res.json()
  }

  const [stats7, stats30, topPages] = await Promise.all([
    getStats(d7,  now),
    getStats(d30, now),
    getTopPages(),
  ])

  return { stats7, stats30, topPages }
}

export default async function HeadCoachAdminPage() {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get('hc_admin')
  const adminPassword = process.env.ADMIN_PASSWORD
  const isAuthed = !!adminPassword && !!adminCookie?.value && adminCookie.value === adminPassword

  if (!isAuthed) return <AdminLogin />

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
    { data: organiserDetails },
    { data: emailLog },
    analytics,
  ] = await Promise.all([
    supabase.from('organisers').select('*', { count: 'exact', head: true }),
    supabase.from('organisers').select('*', { count: 'exact', head: true }).gte('created_at', d7.toISOString()),
    supabase.from('organisers').select('*', { count: 'exact', head: true }).gte('created_at', d30.toISOString()),
    supabase.from('sweepstakes').select('id, name, status, created_at, draw_completed_at, entry_fee'),
    supabase.from('participants').select('*', { count: 'exact', head: true }),
    supabase.from('participants').select('*', { count: 'exact', head: true }).not('email', 'is', null),
    supabase.from('organisers').select('id, name, email, created_at, last_login_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('organisers').select(`
      id, name, email, created_at, last_login_at,
      sweepstakes (
        id, name, status, entry_fee, share_token, created_at, draw_completed_at,
        participants ( id, name, email, paid, created_at )
      )
    `).order('created_at', { ascending: false }),
    supabase
      .from('email_log')
      .select('id, to_email, subject, template, resend_id, created_at')
      .order('created_at', { ascending: false })
      .limit(200),
    fetchVercelAnalytics(),
  ])

  const sweepstakes = sweepstakeRows ?? []
  const byStatus    = sweepstakes.reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <AdminDashboard
      stats={{
        totalOrganisers:       totalOrganisers      ?? 0,
        organisersLast7:       organisersLast7      ?? 0,
        organisersLast30:      organisersLast30     ?? 0,
        totalSweepstakes:      sweepstakes.length,
        byStatus,
        drawsDone:             sweepstakes.filter(s => s.draw_completed_at).length,
        paidEntries:           sweepstakes.filter(s => Number(s.entry_fee) > 0).length,
        totalParticipants:     totalParticipants    ?? 0,
        participantsWithEmail: participantsWithEmail ?? 0,
      }}
      recentOrganisers={recentOrganisers ?? []}
      organiserDetails={organiserDetails ?? []}
      emailLog={emailLog ?? []}
      analytics={analytics}
    />
  )
}
