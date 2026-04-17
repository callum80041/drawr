import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

function isAuthed(req: NextRequest): boolean {
  const pw = process.env.ADMIN_PASSWORD
  return !!pw && req.cookies.get('hc_admin')?.value === pw
}

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })
  const { id } = await params

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('syndicate_winners')
    .select('*, syndicate_members(name)')
    .eq('syndicate_id', id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// Record a winner and advance the pot cycle
export async function POST(req: NextRequest, { params }: Params) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })
  const { id } = await params
  const body = await req.json()
  const { member_id, draw_date, amount_pence, notes } = body

  if (!member_id || !draw_date || amount_pence == null) {
    return NextResponse.json({ error: 'member_id, draw_date, and amount_pence are required' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  const { data: syndicate } = await supabase
    .from('syndicates')
    .select('current_pot_cycle')
    .eq('id', id)
    .single()

  const cycle = syndicate?.current_pot_cycle ?? 1

  const { data: winner, error: winnerError } = await supabase
    .from('syndicate_winners')
    .insert({ syndicate_id: id, member_id, draw_date, pot_cycle: cycle, amount_pence, notes: notes ?? null })
    .select()
    .single()

  if (winnerError) return NextResponse.json({ error: winnerError.message }, { status: 500 })

  // Advance the pot cycle
  await supabase
    .from('syndicates')
    .update({ current_pot_cycle: cycle + 1 })
    .eq('id', id)

  return NextResponse.json(winner, { status: 201 })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })
  await params
  const body = await req.json()
  const { id: winnerId, ...fields } = body

  if (!winnerId) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('syndicate_winners')
    .update(fields)
    .eq('id', winnerId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
