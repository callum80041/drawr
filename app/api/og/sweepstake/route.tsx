import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  const supabase = await createClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('name, tournament_name')
    .eq('share_token', token)
    .single()

  const name       = sweepstake?.name           ?? 'Sweepstake Leaderboard'
  const tournament = sweepstake?.tournament_name ?? 'World Cup 2026'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#1A2E22',
          padding: '64px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '28px', color: '#C8F04D', fontWeight: 800, letterSpacing: '-1px' }}>
            Drawr
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
            🎲 {tournament}
          </div>
        </div>

        {/* Middle: sweepstake name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '3px' }}>
            Live Leaderboard
          </div>
          <div
            style={{
              fontSize: name.length > 30 ? '52px' : '64px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-2px',
              lineHeight: 1.1,
            }}
          >
            {name}
          </div>
        </div>

        {/* Bottom: CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              backgroundColor: '#C8F04D',
              color: '#1A2E22',
              fontSize: '18px',
              fontWeight: 700,
              padding: '14px 28px',
              borderRadius: '12px',
            }}
          >
            View the leaderboard →
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>
            playdrawr.co.uk
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
