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
    .from('lottery_draws')
    .select('*')
    .eq('syndicate_id', id)
    .order('draw_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest, { params }: Params) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })
  const { id } = await params
  const body = await req.json()
  const { draw_date, ball1, ball2, ball3, ball4, ball5, ball6, bonus_ball } = body

  if (!draw_date || !ball1 || !ball2 || !ball3 || !ball4 || !ball5 || !ball6) {
    return NextResponse.json({ error: 'draw_date and all 6 balls are required' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  // Use the syndicate's current pot cycle
  const { data: syndicate } = await supabase
    .from('syndicates')
    .select('current_pot_cycle')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('lottery_draws')
    .insert({
      syndicate_id: id,
      draw_date,
      ball1, ball2, ball3, ball4, ball5, ball6,
      bonus_ball: bonus_ball ?? null,
      pot_cycle:  syndicate?.current_pot_cycle ?? 1,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })
  await params
  const body = await req.json()
  const { id: drawId } = body

  if (!drawId) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const supabase = await createServiceClient()
  const { error } = await supabase.from('lottery_draws').delete().eq('id', drawId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
