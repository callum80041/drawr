import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'
import { AdminDashboard } from './AdminDashboard'
import { AdminLogin } from './AdminLogin'
import type { CampaignQualifier } from './CampaignSection'
import type { SignupData } from './SignupMethodChart'

async function fetchSignupMethodBreakdown(supabase: Awaited<ReturnType<typeof createServiceClient>>, days: number = 7) {
  const now = new Date()
  const startDate = new Date(now); startDate.setDate(startDate.getDate() - days)

  // Query all participants from last N days, grouped by signup_method
  const { data: participants } = await supabase
    .from('participants')
    .select('created_at, signup_method')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  if (!participants) return []

  // Group by date and signup_method
  const dateMap = new Map<string, Record<string, number>>()

  for (const p of participants) {
    const date = p.created_at?.split('T')[0] || ''
    const method = (p.signup_method || 'email') as string

    if (!dateMap.has(date)) {
      dateMap.set(date, { name: 0, email: 0, google: 0, twitter: 0 })
    }

    const counts = dateMap.get(date)!
    if (method === 'name' || method === 'email' || method === 'google' || method === 'twitter') {
      counts[method as keyof typeof counts]++
    }
  }

  // Convert to sorted array with all dates in range
  const result: SignupData[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const counts = dateMap.get(dateStr) || { name: 0, email: 0, google: 0, twitter: 0 }

    result.push({
      date: dateStr,
      name: counts.name,
      email: counts.email,
      google: counts.google,
      twitter: counts.twitter,
    })
  }

  return result
}

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
    signupMethodBreakdown,
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
        sweepstake_type,
        participants ( id, name, email, paid, created_at )
      )
    `).order('created_at', { ascending: false }),
    supabase
      .from('email_log')
      .select('id, to_email, subject, template, resend_id, created_at')
      .order('created_at', { ascending: false })
      .limit(200),
    fetchVercelAnalytics(),
    fetchSignupMethodBreakdown(supabase, 7),
  ])

  const sweepstakes = sweepstakeRows ?? []
  const byStatus    = sweepstakes.reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1
    return acc
  }, {})

  // ── Tournament breakdown stats ─────────────────────────────────────────
  let worldcupSweepstakes = 0, eurovisionSweepstakes = 0
  let worldcupParticipants = 0, eurovisionParticipants = 0
  const organisersWithWc = new Set<string>()
  const organisersWithEurovision = new Set<string>()

  for (const org of (organiserDetails ?? [])) {
    let hasWc = false, hasEv = false
    for (const s of org.sweepstakes) {
      if (s.sweepstake_type === 'worldcup') {
        hasWc = true
        worldcupSweepstakes++
        worldcupParticipants += s.participants?.length ?? 0
      } else if (s.sweepstake_type === 'eurovision') {
        hasEv = true
        eurovisionSweepstakes++
        eurovisionParticipants += s.participants?.length ?? 0
      }
    }
    if (hasWc) organisersWithWc.add(org.id)
    if (hasEv) organisersWithEurovision.add(org.id)
  }

  const breakdownStats = {
    organisersWithWc: organisersWithWc.size,
    organisersWithEurovision: organisersWithEurovision.size,
    worldcupSweepstakes,
    eurovisionSweepstakes,
    worldcupParticipants,
    eurovisionParticipants,
  }

  // ── Campaign audience segmentation ─────────────────────────────────────────
  // Computed from organiserDetails which already has sweepstake + participant data.
  // Segments are mutually exclusive based on the organiser's best-performing WC sweepstake.
  const email1: CampaignQualifier[] = []  // no WC sweepstake at all
  const email2: CampaignQualifier[] = []  // WC sweepstake, < 3 participants
  const email3: CampaignQualifier[] = []  // WC sweepstake, 3–9 participants

  for (const org of (organiserDetails ?? [])) {
    const wcSweepstakes = org.sweepstakes.filter(
      (s: { sweepstake_type?: string }) => s.sweepstake_type === 'worldcup'
    )

    if (wcSweepstakes.length === 0) {
      email1.push({ id: org.id, name: org.name, email: org.email })
    } else {
      // Use the sweepstake with the most participants as the qualifying one
      const best = wcSweepstakes.reduce(
        (a: typeof wcSweepstakes[0], b: typeof wcSweepstakes[0]) =>
          (a.participants?.length ?? 0) >= (b.participants?.length ?? 0) ? a : b
      )
      const count = best.participants?.length ?? 0

      if (count < 3) {
        email2.push({
          id: org.id, name: org.name, email: org.email,
          sweepstakeName: best.name,
          shareToken:     best.share_token,
          participantCount: count,
        })
      } else if (count <= 9) {
        email3.push({
          id: org.id, name: org.name, email: org.email,
          sweepstakeName: best.name,
          shareToken:     best.share_token,
          participantCount: count,
        })
      }
      // count >= 10: already at target, not in any campaign segment
    }
  }

  const campaignData = {
    email1: { count: email1.length, qualifiers: email1.slice(0, 30) },
    email2: { count: email2.length, qualifiers: email2.slice(0, 30) },
    email3: { count: email3.length, qualifiers: email3.slice(0, 30) },
  }

  return (
    <AdminDashboard
      campaignData={campaignData}
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
      breakdownStats={breakdownStats}
      recentOrganisers={recentOrganisers ?? []}
      organiserDetails={organiserDetails ?? []}
      emailLog={emailLog ?? []}
      analytics={analytics}
      signupMethodBreakdown={signupMethodBreakdown}
    />
  )
}
