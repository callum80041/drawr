import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export async function GET() {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '28px', color: '#C8F04D', fontWeight: 800, letterSpacing: '-1px' }}>
            Drawr
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
            🎲 World Cup 2026
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '72px', fontWeight: 800, color: '#ffffff', letterSpacing: '-3px', lineHeight: 1 }}>
            Run a sweepstake
          </div>
          <div style={{ fontSize: '72px', fontWeight: 800, color: '#C8F04D', letterSpacing: '-3px', lineHeight: 1 }}>
            in minutes.
          </div>
          <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
            Random draw · Live leaderboard · Automatic scoring · Free forever
          </div>
        </div>

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
            Start your draw free →
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
