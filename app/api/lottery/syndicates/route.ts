import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

function isAuthed(req: NextRequest): boolean {
  const pw = process.env.ADMIN_PASSWORD
  return !!pw && req.cookies.get('hc_admin')?.value === pw
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('syndicates')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })

  const body = await req.json()
  const { name, entry_fee_pence, start_date } = body

  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('syndicates')
    .insert({
      name,
      organiser_user_id: 'bf2a9eb3-adfd-4698-b9d5-f2bdafd742cd',
      entry_fee_pence:   entry_fee_pence ?? 100,
      start_date:        start_date ?? new Date().toISOString().slice(0, 10),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })

  const body = await req.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('syndicates')
    .update(fields)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
