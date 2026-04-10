import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: organiser } = await supabase
    .from('organisers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!organiser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { sweepstakeId, results } = body as {
    sweepstakeId: string
    results: Array<{
      team_id: number
      qualified: boolean
      final_position: number | null
    }>
  }

  if (!sweepstakeId || !Array.isArray(results)) {
    return NextResponse.json({ error: 'Missing sweepstakeId or results' }, { status: 400 })
  }

  // Verify organiser owns this sweepstake and it's a Eurovision sweepstake
  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, sweepstake_type')
    .eq('id', sweepstakeId)
    .eq('organiser_id', organiser.id)
    .single()

  if (!sweepstake) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (sweepstake.sweepstake_type !== 'eurovision') {
    return NextResponse.json({ error: 'Not a Eurovision sweepstake' }, { status: 400 })
  }

  const service = await createServiceClient()

  const rows = results.map(r => ({
    sweepstake_id: sweepstakeId,
    team_id: r.team_id,
    qualified: r.qualified,
    final_position: r.final_position ?? null,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await service
    .from('eurovision_results')
    .upsert(rows, { onConflict: 'sweepstake_id,team_id' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, upserted: rows.length })
}
