import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const service = await createServiceClient()

  try {
    // Find unverified sweepstakes older than 48 hours
    const cutoffTime = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

    const { data: sweepstakesToDelete, error: selectError } = await service
      .from('sweepstakes')
      .select('id')
      .is('verified_at', null)
      .lt('created_at', cutoffTime)

    if (selectError) {
      console.error('Error querying unverified sweepstakes:', selectError)
      return NextResponse.json({
        error: 'Failed to query unverified sweepstakes',
        success: false,
      }, { status: 500 })
    }

    const count = sweepstakesToDelete?.length ?? 0

    if (count > 0) {
      // Delete them (CASCADE will clean up tokens, participants, assignments, etc.)
      const ids = sweepstakesToDelete.map(s => s.id)
      const { error: deleteError } = await service
        .from('sweepstakes')
        .delete()
        .in('id', ids)

      if (deleteError) {
        console.error('Error deleting unverified sweepstakes:', deleteError)
        return NextResponse.json({
          error: 'Failed to delete unverified sweepstakes',
          success: false,
          deletedCount: 0,
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      deletedCount: count,
      message: `Cleaned up ${count} unverified sweepstake(s)`,
    })
  } catch (error) {
    console.error('Cron cleanup error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      success: false,
    }, { status: 500 })
  }
}
