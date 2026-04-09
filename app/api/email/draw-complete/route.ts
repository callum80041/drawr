import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { drawCompleteEmailHtml } from '@/lib/email/templates/draw-complete'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sweepstakeId } = await req.json()
  if (!sweepstakeId) {
    return NextResponse.json({ error: 'Missing sweepstakeId' }, { status: 400 })
  }

  const { data: organiser } = await supabase
    .from('organisers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!organiser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Verify ownership
  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name, share_token, organiser_id')
    .eq('id', sweepstakeId)
    .eq('organiser_id', organiser.id)
    .single()

  if (!sweepstake) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Fetch participants with emails + their assignments
  const [{ data: participants }, { data: assignments }, { data: teams }] = await Promise.all([
    supabase
      .from('participants')
      .select('id, name, email')
      .eq('sweepstake_id', sweepstakeId)
      .not('email', 'is', null),
    supabase
      .from('assignments')
      .select('participant_id, team_id, team_name, team_flag')
      .eq('sweepstake_id', sweepstakeId),
    supabase
      .from('teams')
      .select('id, name, flag, group_name')
      .eq('tournament_id', 1),
  ])

  if (!participants?.length) {
    return NextResponse.json({ ok: true, sent: 0, message: 'No participants with email addresses' })
  }

  const teamMap = new Map((teams ?? []).map(t => [t.id, t]))

  const assignmentsByParticipant = (assignments ?? []).reduce<Record<string, typeof assignments>>((acc, a) => {
    if (!acc[a.participant_id]) acc[a.participant_id] = []
    acc[a.participant_id]!.push(a)
    return acc
  }, {})

  // Send concurrently, collect results
  const results = await Promise.allSettled(
    participants.map(async p => {
      const myAssignments = assignmentsByParticipant[p.id] ?? []
      const myTeams = myAssignments.map(a => {
        const team = teamMap.get(a.team_id)
        return {
          name: a.team_name,
          flag: a.team_flag,
          group_name: team?.group_name ?? null,
        }
      })

      await sendEmail({
        to: p.email!,
        subject: `Your team for ${sweepstake.name} has been drawn!`,
        html: drawCompleteEmailHtml({
          participantName: p.name,
          sweepstakeName: sweepstake.name,
          shareToken: sweepstake.share_token,
          teams: myTeams,
        }),
      })
      return p.email
    })
  )

  const sent     = results.filter(r => r.status === 'fulfilled').length
  const failed   = results.filter(r => r.status === 'rejected').length

  return NextResponse.json({ ok: true, sent, failed })
}
