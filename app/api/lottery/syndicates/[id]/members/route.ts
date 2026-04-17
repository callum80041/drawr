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
    .from('syndicate_members')
    .select('*')
    .eq('syndicate_id', id)
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest, { params }: Params) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })
  const { id } = await params
  const body = await req.json()
  const { name, email, number1, number2, number3, number4, number5, number6 } = body

  if (!name || !number1 || !number2 || !number3 || !number4 || !number5 || !number6) {
    return NextResponse.json({ error: 'name and all 6 numbers are required' }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('syndicate_members')
    .insert({ syndicate_id: id, name, email: email || null, number1, number2, number3, number4, number5, number6 })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })
  await params
  const body = await req.json()
  const { id: memberId, name, email, number1, number2, number3, number4, number5, number6, left_at } = body

  if (!memberId) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('syndicate_members')
    .update({ name, email: email || null, number1, number2, number3, number4, number5, number6, left_at })
    .eq('id', memberId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })
  await params
  const body = await req.json()
  const { id: memberId } = body

  if (!memberId) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const supabase = await createServiceClient()
  const { error } = await supabase.from('syndicate_members').delete().eq('id', memberId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
