import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pro sync implementation — coming in Step 12
  return NextResponse.json({ status: 'ok', message: 'sync-pro stub' })
}
