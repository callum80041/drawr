import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing verification token' }, { status: 400 })
  }

  const service = await createServiceClient()

  try {
    // Look up token
    const { data: tokenEntry, error: lookupError } = await service
      .from('sweepstake_verification_tokens')
      .select('sweepstake_id')
      .eq('token', token)
      .single()

    if (lookupError || !tokenEntry) {
      return NextResponse.redirect(
        new URL('/verify-sweepstake-error?reason=invalid', req.nextUrl.origin)
      )
    }

    const sweepstakeId = tokenEntry.sweepstake_id

    // Update sweepstake to mark as verified
    const { error: updateError } = await service
      .from('sweepstakes')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', sweepstakeId)

    if (updateError) {
      return NextResponse.redirect(
        new URL('/verify-sweepstake-error?reason=update_failed', req.nextUrl.origin)
      )
    }

    // Delete token (cleanup)
    await service
      .from('sweepstake_verification_tokens')
      .delete()
      .eq('token', token)

    // Redirect to sweepstake overview with success indicator
    return NextResponse.redirect(
      new URL(`/dashboard/${sweepstakeId}?verified=1`, req.nextUrl.origin)
    )
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.redirect(
      new URL('/verify-sweepstake-error?reason=server_error', req.nextUrl.origin)
    )
  }
}
