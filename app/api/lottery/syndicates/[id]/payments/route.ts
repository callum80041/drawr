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
    .from('syndicate_payments')
    .select('*')
    .eq('syndicate_id', id)
    .order('week_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// Upsert a batch of payment records for a given week
export async function POST(req: NextRequest, { params }: Params) {
  if (!isAuthed(req)) return new NextResponse('Unauthorised', { status: 401 })
  const { id } = await params
  const body = await req.json()

  // body: { week_date: string, payments: { member_id, paid, collected_by?, notes? }[] }
  const { week_date, payments } = body
  if (!week_date || !Array.isArray(payments)) {
    return NextResponse.json({ error: 'week_date and payments[] are required' }, { status: 400 })
  }

  const rows = payments.map((p: { member_id: string; paid: boolean; collected_by?: string; notes?: string }) => ({
    syndicate_id: id,
    member_id:    p.member_id,
    week_date,
    paid:         p.paid,
    collected_by: p.collected_by ?? null,
    notes:        p.notes ?? null,
  }))

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('syndicate_payments')
    .upsert(rows, { onConflict: 'member_id,week_date' })
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
