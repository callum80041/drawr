import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const DEADLINE = new Date('2026-06-11T19:00:00Z')

export async function POST(req: NextRequest) {
  if (new Date() > DEADLINE) {
    return NextResponse.json({ error: 'Predictions are locked — the tournament has started.' }, { status: 403 })
  }

  const { sweepstakeId, participantId, predictions } = await req.json()

  if (!sweepstakeId || !participantId || !Array.isArray(predictions)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const service = await createServiceClient()

  // Security check: verify participant belongs to this sweepstake
  const { data: participant } = await service
    .from('participants')
    .select('id, sweepstake_id')
    .eq('id', participantId)
    .single()

  if (!participant || participant.sweepstake_id !== sweepstakeId) {
    return NextResponse.json({ error: 'Participant not found in this sweepstake' }, { status: 403 })
  }

  // Upsert all predictions
  const now = new Date().toISOString()
  const rows = predictions.map((p: { groupName: string; teamId: number; teamName: string; teamFlag?: string }) => ({
    sweepstake_id: sweepstakeId,
    participant_id: participantId,
    group_name: p.groupName,
    predicted_team_id: p.teamId,
    predicted_team_name: p.teamName,
    predicted_team_flag: p.teamFlag ?? null,
    updated_at: now,
  }))

  const { error } = await service
    .from('group_predictions')
    .upsert(rows, { onConflict: 'sweepstake_id,participant_id,group_name' })

  if (error) {
    console.error('[predictions/save]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
