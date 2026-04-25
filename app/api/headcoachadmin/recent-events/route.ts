import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'

export type TimelineEvent =
  | { type: 'organiser'; id: string; name: string; email: string; created_at: string }
  | { type: 'participant'; id: string; participantName: string; sweepstakeName: string; created_at: string }
  | { type: 'draw'; id: string; sweepstakeName: string; participantCount: number; created_at: string }

export async function GET() {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get('hc_admin')
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || !adminCookie?.value || adminCookie.value !== adminPassword) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const supabase = await createServiceClient()

    const [
      { data: recentOrganisers },
      { data: recentParticipants },
      { data: recentDraws },
      { data: sweepstakesMap },
    ] = await Promise.all([
      supabase
        .from('organisers')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('participants')
        .select('id, name, created_at, sweepstake_id')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('sweepstakes')
        .select('id, name, draw_completed_at, participants(id)')
        .not('draw_completed_at', 'is', null)
        .order('draw_completed_at', { ascending: false })
        .limit(50),
      supabase
        .from('sweepstakes')
        .select('id, name'),
    ])

    const events: TimelineEvent[] = []

    // Add organiser events
    if (recentOrganisers) {
      recentOrganisers.forEach(org => {
        events.push({
          type: 'organiser',
          id: org.id,
          name: org.name,
          email: org.email,
          created_at: org.created_at,
        })
      })
    }

    // Add participant events
    if (recentParticipants) {
      recentParticipants.forEach(p => {
        const sweepstake = sweepstakesMap?.find(s => s.id === p.sweepstake_id)
        events.push({
          type: 'participant',
          id: p.id,
          participantName: p.name,
          sweepstakeName: sweepstake?.name ?? 'Unknown sweepstake',
          created_at: p.created_at,
        })
      })
    }

    // Add draw completion events
    if (recentDraws) {
      recentDraws.forEach(s => {
        const participants = s.participants as Array<{ id: string }> | null
        if (s.draw_completed_at) {
          events.push({
            type: 'draw',
            id: s.id,
            sweepstakeName: s.name,
            participantCount: participants?.length ?? 0,
            created_at: s.draw_completed_at,
          })
        }
      })
    }

    // Sort by created_at descending and take top 20
    const sorted = events.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 20)

    return Response.json(sorted)
  } catch (error) {
    console.error('Error fetching recent events:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch events' }), { status: 500 })
  }
}
