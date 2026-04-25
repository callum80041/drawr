import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const RESERVED_SLUGS = new Set([
  'demo', 'demo2026', 'demoeurovision',
  'admin', 'api', 'join', 'final', 'blog', 'dashboard', 'tv',
])

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const slug = req.nextUrl.searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug param' }, { status: 400 })
  }

  // Validate format
  if (!SLUG_REGEX.test(slug)) {
    return NextResponse.json({
      available: false,
      reason: 'Invalid format. Use 3–40 lowercase letters, numbers, and hyphens only.',
    })
  }

  // Check reserved
  if (RESERVED_SLUGS.has(slug)) {
    return NextResponse.json({
      available: false,
      reason: 'That slug is reserved.',
    })
  }

  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify ownership
  const { data: organiser } = await supabase
    .from('organisers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!organiser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, organiser_id')
    .eq('id', id)
    .eq('organiser_id', organiser.id)
    .single()

  if (!sweepstake) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Check if slug is taken (excluding current sweepstake)
  const { count } = await supabase
    .from('sweepstakes')
    .select('*', { count: 'exact', head: true })
    .eq('custom_slug', slug)
    .neq('id', id)

  if ((count ?? 0) > 0) {
    return NextResponse.json({
      available: false,
      reason: 'That URL is already in use — try something different.',
    })
  }

  return NextResponse.json({ available: true })
}
