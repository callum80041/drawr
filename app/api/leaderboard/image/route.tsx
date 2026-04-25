import { ImageResponse } from '@vercel/og'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSweepstakePro } from '@/lib/utils/pro'
import { computeEurovisionPoints } from '@/lib/scoring'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

type Format = 'square' | 'story' | 'wide'

const FORMATS: Record<Format, { width: number; height: number }> = {
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
  wide: { width: 1200, height: 630 },
}

async function loadFont(name: string, weight: number) {
  const fontFamily = name === 'Syne' ? 'Syne' : 'DM Sans'
  const url = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@${weight}&display=swap`

  const fontResponse = await fetch(url)
  const fontData = await fontResponse.text()
  const urlMatch = fontData.match(/src: url\((.*?)\) format/)

  if (!urlMatch) throw new Error(`Failed to load ${name} font`)

  const fontUrl = urlMatch[1].replace(/^url\(/, '').replace(/\)$/, '')
  const fontBuffer = await fetch(fontUrl).then(r => r.arrayBuffer())

  return { data: fontBuffer, style: 'normal' }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')
    const format = (req.nextUrl.searchParams.get('format') ?? 'square') as Format

    if (!token || !FORMATS[format]) {
      return new NextResponse('Invalid parameters', { status: 400 })
    }

    const supabase = await createClient()

    // Fetch sweepstake
    const { data: sweepstake } = await supabase
      .from('sweepstakes')
      .select('id, name, sweepstake_type, is_pro, pro_expires_at, custom_slug, logo_url')
      .or(`share_token.eq.${token},custom_slug.eq.${token}`)
      .single()

    if (!sweepstake) {
      return new NextResponse('Not found', { status: 404 })
    }

    const isPro = isSweepstakePro(sweepstake)
    const isEurovision = sweepstake.sweepstake_type === 'eurovision'

    // Fetch leaderboard data
    const { data: participants } = await supabase
      .from('participants')
      .select('id, name')
      .eq('sweepstake_id', sweepstake.id)
      .order('created_at', { ascending: true })

    const { data: assignments } = await supabase
      .from('assignments')
      .select('participant_id, team_id, team_name, team_flag')
      .eq('sweepstake_id', sweepstake.id)

    let euScoreByTeam: Record<number, { qualified: boolean; final_position: number | null }> = {}
    if (isEurovision) {
      const { data: euResults } = await supabase
        .from('eurovision_results')
        .select('team_id, qualified, final_position')
        .eq('sweepstake_id', sweepstake.id)
      euScoreByTeam = Object.fromEntries(
        (euResults ?? []).map(r => [r.team_id, { qualified: r.qualified, final_position: r.final_position }])
      )
    }

    const { data: scores } = isEurovision
      ? { data: null }
      : await supabase
          .from('scores')
          .select('participant_id, points')
          .eq('sweepstake_id', sweepstake.id)

    const teamsByParticipant = (assignments ?? []).reduce<
      Record<string, { team_id: number; team_name: string; team_flag: string | null }[]>
    >((acc, a) => {
      if (!acc[a.participant_id]) acc[a.participant_id] = []
      acc[a.participant_id].push({ team_id: a.team_id, team_name: a.team_name, team_flag: a.team_flag })
      return acc
    }, {})

    const scoreByParticipant = Object.fromEntries(
      (scores ?? []).map(s => [s.participant_id, s])
    )

    const ranked = (participants ?? [])
      .map(p => {
        let points = 0
        if (isEurovision) {
          const myTeams = teamsByParticipant[p.id] ?? []
          points = myTeams.reduce((sum, t) => {
            const result = euScoreByTeam[t.team_id]
            return sum + (result ? computeEurovisionPoints(result) : 0)
          }, 0)
        } else {
          points = scoreByParticipant[p.id]?.points ?? 0
        }
        return {
          id: p.id,
          name: p.name,
          teams: teamsByParticipant[p.id] ?? [],
          points,
        }
      })
      .sort((a, b) => b.points - a.points)
      .slice(0, 10)

    const { width, height } = FORMATS[format]
    const displayUrl = sweepstake.custom_slug ? `${APP_URL}/s/${sweepstake.custom_slug}` : `${APP_URL}/s/${token}`

    // Load fonts
    const [syneFont, dmSansFont] = await Promise.all([
      loadFont('Syne', 700),
      loadFont('DM Sans', 400),
    ])

    const jsx = (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0f0a',
          display: 'flex',
          flexDirection: 'column',
          padding: '40px',
          fontFamily: 'DM Sans',
          color: '#fff',
          position: 'relative',
        }}
      >
        {/* Logo/Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
          {isPro && sweepstake.logo_url && (
            <img src={sweepstake.logo_url} alt="Logo" style={{ maxHeight: '48px', maxWidth: '150px' }} />
          )}
          {!isPro && (
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: 'Syne',
                color: '#C8F04D',
              }}
            >
              🎲
            </div>
          )}
          <h1
            style={{
              fontSize: format === 'wide' ? '32px' : '48px',
              fontWeight: 'bold',
              fontFamily: 'Syne',
              margin: 0,
              flex: 1,
            }}
          >
            {sweepstake.name}
          </h1>
        </div>

        {/* Leaderboard */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ranked.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: i === 0 ? 'rgba(200,240,77,0.1)' : 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                fontSize: format === 'wide' ? '14px' : '16px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: i === 0 ? '#C8F04D' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: i === 0 ? '#000' : '#fff',
                  fontSize: '14px',
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                  {p.teams.slice(0, 2).map(t => `${t.team_flag ?? ''} ${t.team_name}`).join(', ')}
                  {p.teams.length > 2 ? ` +${p.teams.length - 2}` : ''}
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Syne', color: i === 0 ? '#C8F04D' : '#fff' }}>
                {p.points}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          <div>More at {displayUrl.replace(/^https?:\/\//, '')}</div>
          {!isPro && <div style={{ color: 'rgba(255,255,255,0.3)' }}>playdrawr.co.uk</div>}
        </div>

        {/* Watermark for free */}
        {!isPro && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              fontSize: '32px',
              opacity: 0.15,
              transform: 'rotate(-45deg)',
              pointerEvents: 'none',
            }}
          >
            playdrawr.co.uk
          </div>
        )}
      </div>
    )

    return new ImageResponse(jsx, {
      width,
      height,
      fonts: [
        { name: 'Syne', data: syneFont.data, style: 'normal', weight: 700 },
        { name: 'DM Sans', data: dmSansFont.data, style: 'normal', weight: 400 },
      ],
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return new NextResponse('Failed to generate image', { status: 500 })
  }
}
