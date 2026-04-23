import { NextResponse } from 'next/server'
import { runDailySync } from '@/lib/api-football/sync-daily'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await runDailySync()
  return NextResponse.json(result)
}
