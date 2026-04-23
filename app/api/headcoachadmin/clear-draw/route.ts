import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const cookie = req.cookies.get('hc_admin')
  if (!adminPassword || cookie?.value !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { sweepstakeId } = await req.json()
  if (!sweepstakeId) {
    return NextResponse.json({ error: 'Missing sweepstakeId' }, { status: 400 })
  }

  const service = await createServiceClient()

  // Verify the sweepstake exists
  const { data: sweepstake } = await service
    .from('sweepstakes')
    .select('id, name')
    .eq('id', sweepstakeId)
    .single()

  if (!sweepstake) {
    return NextResponse.json({ error: 'Sweepstake not found' }, { status: 404 })
  }

  // Delete all assignments for this sweepstake
  const { error: assignErr } = await service
    .from('assignments')
    .delete()
    .eq('sweepstake_id', sweepstakeId)

  if (assignErr) {
    console.error('[clear-draw] assignments delete failed:', assignErr)
    return NextResponse.json({ error: assignErr.message }, { status: 500 })
  }

  // Clear draw state and reset to setup
  const { error: updateErr } = await service
    .from('sweepstakes')
    .update({ draw_completed_at: null, status: 'setup' })
    .eq('id', sweepstakeId)

  if (updateErr) {
    console.error('[clear-draw] sweepstake update failed:', updateErr)
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, name: sweepstake.name })
}
