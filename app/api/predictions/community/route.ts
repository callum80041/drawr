import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const sweepstakeId = req.nextUrl.searchParams.get('sweepstakeId')

  if (!sweepstakeId) {
    return NextResponse.json({ error: 'Missing sweepstakeId' }, { status: 400 })
  }

  // Anon client — public read RLS is enabled on group_predictions
  const supabase = await createClient()

  const { data: predictions, error } = await supabase
    .from('group_predictions')
    .select('group_name, predicted_team_id, predicted_team_name, predicted_team_flag')
    .eq('sweepstake_id', sweepstakeId)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch community picks.' }, { status: 500 })
  }

  // Group by group_name → predicted_team_id, count occurrences
  const groupMap = new Map<string, Map<number, { teamId: number; teamName: string; teamFlag: string | null; count: number }>>()

  for (const p of predictions ?? []) {
    if (!groupMap.has(p.group_name)) groupMap.set(p.group_name, new Map())
    const teamMap = groupMap.get(p.group_name)!
    if (!teamMap.has(p.predicted_team_id)) {
      teamMap.set(p.predicted_team_id, {
        teamId: p.predicted_team_id,
        teamName: p.predicted_team_name,
        teamFlag: p.predicted_team_flag ?? null,
        count: 0,
      })
    }
    teamMap.get(p.predicted_team_id)!.count++
  }

  const groups = Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupName, teamMap]) => ({
      groupName,
      picks: Array.from(teamMap.values()).sort((a, b) => b.count - a.count),
    }))

  return NextResponse.json({ groups })
}
