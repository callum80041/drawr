import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

// Square 1080x1080 — works for Instagram profile pic and posts
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1A2E22',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Lime circle background for dice */}
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: '#C8F04D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            fontSize: '100px',
          }}
        >
          🎲
        </div>

        {/* Wordmark */}
        <div
          style={{
            fontSize: '140px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-6px',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          Drawr
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '32px',
            color: '#C8F04D',
            fontWeight: 700,
            letterSpacing: '0px',
            marginBottom: '60px',
          }}
        >
          World Cup 2026 Sweepstakes
        </div>

        {/* URL pill */}
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: '999px',
            padding: '12px 32px',
            fontSize: '24px',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.5px',
          }}
        >
          playdrawr.co.uk
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  )
}
