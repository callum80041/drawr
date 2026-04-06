import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = await createClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name')
    .eq('share_token', token)
    .single()

  if (!sweepstake) {
    return new Response('Not found', { status: 404 })
  }

  const [{ data: participants }, { data: assignments }] = await Promise.all([
    supabase
      .from('participants')
      .select('id, name')
      .eq('sweepstake_id', sweepstake.id)
      .order('name'),
    supabase
      .from('assignments')
      .select('participant_id, team_name, team_flag')
      .eq('sweepstake_id', sweepstake.id),
  ])

  if (!participants?.length || !assignments?.length) {
    return new Response('Draw not complete', { status: 400 })
  }

  // Build participant → teams map
  const teamMap: Record<string, { name: string; flag: string | null }[]> = {}
  for (const a of assignments) {
    if (!teamMap[a.participant_id]) teamMap[a.participant_id] = []
    teamMap[a.participant_id].push({ name: a.team_name, flag: a.team_flag })
  }

  const rows = participants.map(p => ({
    name: p.name,
    teams: teamMap[p.id] ?? [],
  }))

  // Layout: up to 3 columns, fill rows
  const cols = rows.length <= 6 ? 2 : 3
  const cardW = cols === 2 ? 420 : 270

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1A2E22',
          fontFamily: 'sans-serif',
          padding: '52px 56px 40px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#C8F04D', letterSpacing: '-1px', lineHeight: 1 }}>
              🎲 playdrawr
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              World Cup 2026 Draw
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(200,240,77,0.12)',
              border: '1px solid rgba(200,240,77,0.3)',
              borderRadius: '999px',
              padding: '6px 18px',
              fontSize: '13px',
              color: '#C8F04D',
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            DRAW COMPLETE ✓
          </div>
        </div>

        {/* Sweepstake name */}
        <div
          style={{
            fontSize: rows.length > 12 ? '30px' : '38px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            marginBottom: '32px',
          }}
        >
          {sweepstake.name}
        </div>

        {/* Participants grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            flex: 1,
            alignContent: 'flex-start',
          }}
        >
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                width: `${cardW}px`,
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#C8F04D', letterSpacing: '-0.2px' }}>
                {row.name}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {row.teams.map((t, j) => (
                  <div
                    key={j}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.75)',
                    }}
                  >
                    <span>{t.flag ?? '🏳️'}</span>
                    <span>{t.name}</span>
                    {j < row.teams.length - 1 && (
                      <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: '2px' }}>·</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '28px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.05em',
          }}
        >
          playdrawr.co.uk
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  )
}
