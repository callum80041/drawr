import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { sweepstakeId, email } = await req.json()

  if (!sweepstakeId || !email?.trim()) {
    return NextResponse.json({ error: 'Missing sweepstakeId or email' }, { status: 400 })
  }

  const service = await createServiceClient()

  // Find participant by email (case-insensitive) in this sweepstake
  const { data: participant } = await service
    .from('participants')
    .select('id, name')
    .eq('sweepstake_id', sweepstakeId)
    .ilike('email', email.trim())
    .single()

  if (!participant) {
    return NextResponse.json(
      { error: "We couldn't find you in this sweepstake. Make sure you use the same email you signed up with." },
      { status: 404 }
    )
  }

  // Fetch existing predictions for this participant in this sweepstake
  const { data: rawPredictions } = await service
    .from('group_predictions')
    .select('group_name, predicted_team_id, predicted_team_name, predicted_team_flag')
    .eq('sweepstake_id', sweepstakeId)
    .eq('participant_id', participant.id)

  const predictions = (rawPredictions ?? []).map(p => ({
    groupName: p.group_name,
    teamId: p.predicted_team_id,
    teamName: p.predicted_team_name,
    teamFlag: p.predicted_team_flag,
  }))

  return NextResponse.json({ participant: { id: participant.id, name: participant.name }, predictions })
}
