import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  // Auth check — must have the admin cookie
  const adminPassword = process.env.ADMIN_PASSWORD
  const cookie = req.cookies.get('hc_admin')
  if (!adminPassword || cookie?.value !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { organiserId } = await req.json()
  if (!organiserId) {
    return NextResponse.json({ error: 'Missing organiserId' }, { status: 400 })
  }

  const service = await createServiceClient()

  // Get the auth user_id before deleting
  const { data: organiser } = await service
    .from('organisers')
    .select('id, user_id, name, email')
    .eq('id', organiserId)
    .single()

  if (!organiser) {
    return NextResponse.json({ error: 'Organiser not found' }, { status: 404 })
  }

  // Deleting the auth user cascades to organisers → sweepstakes → participants → assignments
  const { error: authErr } = await service.auth.admin.deleteUser(organiser.user_id)

  if (authErr) {
    console.error('[delete-organiser] auth.admin.deleteUser failed:', authErr)
    return NextResponse.json({ error: authErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, deleted: { name: organiser.name, email: organiser.email } })
}
