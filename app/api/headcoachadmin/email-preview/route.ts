import { NextRequest, NextResponse } from 'next/server'
import { organiserUpdateEmailHtml } from '@/lib/email/templates/organiser-update'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export async function GET(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const cookie = req.cookies.get('hc_admin')
  if (!adminPassword || cookie?.value !== adminPassword) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const version = req.nextUrl.searchParams.get('version') ?? 'A'

  const html = organiserUpdateEmailHtml({
    name: 'Alex',
    joinUrl: version === 'A' ? `${APP_URL}/join/demo2026` : null,
    dashboardUrl: `${APP_URL}/dashboard`,
  })

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
