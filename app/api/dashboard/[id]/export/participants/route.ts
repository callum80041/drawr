import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSweepstakePro } from '@/lib/utils/pro'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: organiser } = await supabase
    .from('organisers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!organiser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name, organiser_id, is_pro, pro_expires_at')
    .eq('id', id)
    .eq('organiser_id', organiser.id)
    .single()

  if (!sweepstake) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  if (!isSweepstakePro(sweepstake)) {
    return NextResponse.json({ error: 'CSV export is a Pro feature.' }, { status: 403 })
  }

  const [{ data: participants }, { data: assignments }] = await Promise.all([
    supabase
      .from('participants')
      .select('id, name, email, paid, created_at')
      .eq('sweepstake_id', id)
      .order('created_at', { ascending: true }),
    supabase
      .from('assignments')
      .select('participant_id, team_name, team_flag')
      .eq('sweepstake_id', id),
  ])

  const assignmentsByParticipant = Object.fromEntries(
    (assignments ?? []).map(a => [a.participant_id, a])
  )

  const csv = buildCsv(participants ?? [], assignmentsByParticipant)

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${sweepstake.name}-participants.csv"`,
    },
  })
}

function buildCsv(
  participants: Array<{ id: string; name: string; email: string | null; paid: boolean; created_at: string }>,
  assignmentsByParticipant: Record<string, { team_name: string; team_flag: string | null }>
): string {
  const headers = ['Name', 'Email', 'Paid', 'Team', 'Flag', 'Signed Up At']
  const rows = participants.map(p => {
    const assignment = assignmentsByParticipant[p.id]
    const date = new Date(p.created_at)
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    const hour = String(date.getUTCHours()).padStart(2, '0')
    const minute = String(date.getUTCMinutes()).padStart(2, '0')
    const signedUpAt = `${day}/${month}/${year} ${hour}:${minute}`

    return [
      escapeCsvField(p.name),
      p.email ? escapeCsvField(p.email) : '',
      p.paid ? 'Yes' : 'No',
      assignment ? escapeCsvField(assignment.team_name) : '',
      assignment?.team_flag ?? '',
      signedUpAt,
    ].join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

function escapeCsvField(field: string): string {
  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}
