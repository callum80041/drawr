'use client'

import { useEffect, useState } from 'react'

interface Participant {
  id: string
  name: string
  teams: { team_id: number; team_name: string; team_flag: string | null }[]
  points: number
  rank: number | null
}

type PanelType = 'leaderboard' | 'top5' | 'movers' | 'organiser'

interface Props {
  token: string
  sweepstakeName: string
  logoUrl: string | null
  isEurovision: boolean
  initialRanked: Participant[]
  initialEuScoreByTeam: Record<number, { qualified: boolean; final_position: number | null }>
}

export function TVLeaderboardClient({
  token,
  sweepstakeName,
  logoUrl,
  isEurovision,
  initialRanked,
  initialEuScoreByTeam,
}: Props) {
  const [ranked, setRanked] = useState<Participant[]>(initialRanked)
  const [previousPoints, setPreviousPoints] = useState<Record<string, number>>(
    Object.fromEntries(initialRanked.map(p => [p.id, p.points]))
  )
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [currentPanel, setCurrentPanel] = useState<PanelType>('leaderboard')
  const [tickerIndex, setTickerIndex] = useState(0)

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  const BG_EV = '#040241'
  const PINK_EV = '#F10F59'
  const BG_WC = '#1A2E22'
  const LIME_WC = '#C8F04D'

  const accent = isEurovision ? PINK_EV : LIME_WC
  const background = isEurovision ? BG_EV : BG_WC

  // Rotate panels every 12 seconds
  useEffect(() => {
    const panels: PanelType[] = ['leaderboard', 'top5', 'movers', 'organiser']
    const interval = setInterval(() => {
      setCurrentPanel(p => {
        const idx = panels.indexOf(p)
        return panels[(idx + 1) % panels.length]
      })
    }, prefersReducedMotion ? 999999 : 12000)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  // Rotate ticker messages every 5 seconds
  useEffect(() => {
    const messages = generateTickerMessages()
    if (messages.length === 0) return
    const interval = setInterval(() => {
      setTickerIndex(i => (i + 1) % messages.length)
    }, prefersReducedMotion ? 999999 : 5000)
    return () => clearInterval(interval)
  }, [ranked, lastUpdated, prefersReducedMotion])

  // Refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/tv/leaderboard?token=${encodeURIComponent(token)}`)
        if (response.ok) {
          const data = await response.json()
          setPreviousPoints(Object.fromEntries(ranked.map(p => [p.id, p.points])))
          setRanked(data.ranked)
          setLastUpdated(new Date())
        }
      } catch {
        // Silent fail on refresh
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [token, ranked])

  function generateTickerMessages(): string[] {
    const messages: string[] = []

    if (ranked.length > 0) {
      messages.push(`🏆 ${ranked[0].name} leads with ${ranked[0].points} points`)
    }

    const movers = getMovers()
    movers.slice(0, 2).forEach(p => {
      const delta = getPointDelta(p.id)
      if (delta > 0) {
        messages.push(`📈 ${p.name} climbed ${delta} point${delta !== 1 ? 's' : ''}`)
      }
    })

    messages.push(`⏰ Last refreshed at ${formatTime(lastUpdated)}`)

    return messages
  }

  function getPointDelta(participantId: string): number {
    const current = ranked.find(p => p.id === participantId)?.points ?? 0
    const previous = previousPoints[participantId] ?? 0
    return current - previous
  }

  function getMovers(): Participant[] {
    return [...ranked]
      .sort((a, b) => getPointDelta(b.id) - getPointDelta(a.id))
      .slice(0, 5)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  const tickerMessages = generateTickerMessages()
  const currentTickerMessage = tickerMessages[tickerIndex % tickerMessages.length]

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden"
      style={{ background }}
    >
      {/* TOP BAR */}
      <div
        className="flex items-center justify-between px-[clamp(32px,2vw,80px)] py-[clamp(24px,1.5vw,48px)] border-b"
        style={{ borderColor: 'rgba(255,255,255,0.15)' }}
      >
        <div className="flex items-center gap-[clamp(24px,1.5vw,48px)]">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              style={{
                maxHeight: 'clamp(40px, 3vw, 80px)',
                maxWidth: 'clamp(160px, 12vw, 280px)',
                width: 'auto',
                height: 'auto',
              }}
            />
          )}
          <h1
            className="font-heading font-bold"
            style={{
              fontSize: 'clamp(48px, 3vw, 96px)',
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            {sweepstakeName}
          </h1>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-[clamp(12px, 0.8vw, 24px)]">
          <div
            className="rounded-full animate-pulse"
            style={{
              background: accent,
              width: 'clamp(12px, 0.6vw, 20px)',
              height: 'clamp(12px, 0.6vw, 20px)',
            }}
          />
          <span
            className="font-heading font-bold"
            style={{
              fontSize: 'clamp(16px, 1vw, 24px)',
              color: accent,
              letterSpacing: '0.05em',
            }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-hidden px-[clamp(32px,2vw,80px)] py-[clamp(32px,2vw,80px)]">
        {ranked.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div
                style={{
                  fontSize: 'clamp(64px, 4vw, 128px)',
                  marginBottom: 'clamp(24px, 2vw, 48px)',
                }}
              >
                {isEurovision ? '🎤' : '🏆'}
              </div>
              <p
                className="font-heading font-bold"
                style={{
                  fontSize: 'clamp(32px, 2vw, 64px)',
                  color: '#fff',
                  marginBottom: 'clamp(8px, 0.8vw, 16px)',
                }}
              >
                Draw in progress
              </p>
              <p
                style={{
                  fontSize: 'clamp(16px, 1vw, 28px)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                Results coming soon...
              </p>
            </div>
          </div>
        ) : currentPanel === 'leaderboard' ? (
          <FullLeaderboard
            ranked={ranked}
            accent={accent}
            isEurovision={isEurovision}
            getPointDelta={getPointDelta}
          />
        ) : currentPanel === 'top5' ? (
          <Top5Podium
            ranked={ranked}
            accent={accent}
            isEurovision={isEurovision}
            getPointDelta={getPointDelta}
          />
        ) : currentPanel === 'movers' ? (
          <BiggestMovers
            movers={getMovers()}
            accent={accent}
            isEurovision={isEurovision}
            getPointDelta={getPointDelta}
          />
        ) : (
          <OrganisingHoldingPanel accent={accent} isEurovision={isEurovision} />
        )}
      </div>

      {/* BOTTOM TICKER */}
      <div
        className="border-t flex items-center gap-[clamp(16px,1vw,32px)] px-[clamp(32px,2vw,80px)] py-[clamp(16px,1vw,32px)] overflow-hidden"
        style={{
          borderColor: 'rgba(255,255,255,0.15)',
          background: 'rgba(0,0,0,0.4)',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(24px, 1.2vw, 42px)',
            color: accent,
            fontWeight: 'bold',
          }}
        >
          ●
        </div>
        <div
          style={{
            fontSize: 'clamp(20px, 1.1vw, 36px)',
            color: '#fff',
            fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
          }}
        >
          {currentTickerMessage}
        </div>
      </div>
    </div>
  )
}

function FullLeaderboard({
  ranked,
  accent,
  isEurovision,
  getPointDelta,
}: {
  ranked: Participant[]
  accent: string
  isEurovision: boolean
  getPointDelta: (id: string) => number
}) {
  const displayedRows = ranked.slice(0, 10)

  return (
    <div className="space-y-[clamp(12px,0.8vw,20px)] h-full flex flex-col">
      <div className="flex-1 space-y-[clamp(12px,0.8vw,20px)] overflow-hidden">
        {displayedRows.map((p, i) => {
          const delta = getPointDelta(p.id)
          const isFirst = i === 0

          return (
            <div
              key={p.id}
              className="rounded-[clamp(8px,0.5vw,16px)] px-[clamp(24px,1.5vw,48px)] py-[clamp(16px,1vw,32px)] flex items-center gap-[clamp(24px,1.5vw,48px)]"
              style={{
                background: isFirst ? `${accent}20` : 'rgba(255,255,255,0.06)',
                border: `2px solid ${
                  isFirst ? `${accent}60` : 'rgba(255,255,255,0.1)'
                }`,
              }}
            >
              {/* Rank badge */}
              <div
                className="rounded-full flex items-center justify-center flex-shrink-0 font-heading font-bold"
                style={{
                  width: 'clamp(48px, 2.5vw, 72px)',
                  height: 'clamp(48px, 2.5vw, 72px)',
                  background:
                    i === 0
                      ? accent
                      : i === 1
                      ? '#C0C0C0'
                      : i === 2
                      ? '#CD7F32'
                      : 'rgba(255,255,255,0.1)',
                  color: i > 2 ? 'rgba(255,255,255,0.5)' : '#000',
                  fontSize: 'clamp(28px, 1.5vw, 48px)',
                }}
              >
                {i + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-heading font-bold"
                  style={{
                    fontSize: 'clamp(28px, 1.6vw, 48px)',
                    color: '#fff',
                    marginBottom: 'clamp(8px, 0.5vw, 12px)',
                  }}
                >
                  {p.name}
                </p>
                {p.teams.length > 0 && (
                  <div className="flex flex-wrap gap-[clamp(8px, 0.5vw, 12px)]">
                    {p.teams.slice(0, 2).map(t => (
                      <div
                        key={t.team_id}
                        className="inline-flex items-center gap-[clamp(6px,0.4vw,12px)]"
                        style={{
                          fontSize: 'clamp(14px, 0.9vw, 24px)',
                          background: 'rgba(255,255,255,0.12)',
                          color: '#fff',
                          padding: `${
                            'clamp(6px, 0.4vw, 10px)'
                          } clamp(10px, 0.6vw, 16px)`,
                          borderRadius: 'clamp(4px, 0.3vw, 8px)',
                        }}
                      >
                        {t.team_flag && <span>{t.team_flag}</span>}
                        <span>{t.team_name}</span>
                      </div>
                    ))}
                    {p.teams.length > 2 && (
                      <div
                        style={{
                          fontSize: 'clamp(12px, 0.8vw, 20px)',
                          color: 'rgba(255,255,255,0.5)',
                          padding: '6px 10px',
                        }}
                      >
                        +{p.teams.length - 2}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Points */}
              <div className="text-right flex-shrink-0">
                <p
                  className="font-heading font-bold"
                  style={{
                    fontSize: 'clamp(36px, 2vw, 72px)',
                    color: isFirst ? accent : '#fff',
                  }}
                >
                  {p.points}
                </p>
                {delta !== 0 && (
                  <p
                    style={{
                      fontSize: 'clamp(16px, 1vw, 28px)',
                      color: delta > 0 ? accent : '#FF6B6B',
                      marginTop: 'clamp(4px, 0.3vw, 8px)',
                    }}
                  >
                    {delta > 0 ? '+' : ''}{delta}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Top5Podium({
  ranked,
  accent,
  isEurovision,
  getPointDelta,
}: {
  ranked: Participant[]
  accent: string
  isEurovision: boolean
  getPointDelta: (id: string) => number
}) {
  const top5 = ranked.slice(0, 5)

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-[clamp(24px,2vw,48px)]">
      <h2
        className="font-heading font-bold text-center"
        style={{
          fontSize: 'clamp(40px, 2.5vw, 64px)',
          color: accent,
          letterSpacing: '0.02em',
        }}
      >
        🏆 Top 5
      </h2>
      <div className="space-y-[clamp(16px,1vw,32px)] w-full">
        {top5.map((p, i) => (
          <div
            key={p.id}
            className="rounded-[clamp(12px,1vw,24px)] px-[clamp(24px,1.5vw,48px)] py-[clamp(16px,1vw,32px)] flex items-center justify-between"
            style={{
              background: i === 0 ? `${accent}30` : `rgba(${
                i === 1 ? '192, 192, 192' : i === 2 ? '205, 127, 50' : '255,255,255,10'
              }, 0.15)`,
              border: `2px solid ${accent}40`,
            }}
          >
            <div className="flex items-center gap-[clamp(16px,1vw,32px)]">
              <div
                className="rounded-full flex items-center justify-center font-heading font-bold flex-shrink-0"
                style={{
                  width: 'clamp(56px, 3vw, 80px)',
                  height: 'clamp(56px, 3vw, 80px)',
                  background:
                    i === 0
                      ? accent
                      : i === 1
                      ? '#C0C0C0'
                      : i === 2
                      ? '#CD7F32'
                      : 'rgba(255,255,255,0.15)',
                  color: i > 2 ? 'rgba(255,255,255,0.5)' : '#000',
                  fontSize: 'clamp(32px, 2vw, 56px)',
                }}
              >
                {i + 1}
              </div>
              <div>
                <p
                  className="font-heading font-bold"
                  style={{
                    fontSize: 'clamp(28px, 1.8vw, 48px)',
                    color: '#fff',
                  }}
                >
                  {p.name}
                </p>
                {p.teams.length > 0 && (
                  <p
                    style={{
                      fontSize: 'clamp(16px, 1vw, 24px)',
                      color: 'rgba(255,255,255,0.6)',
                      marginTop: '4px',
                    }}
                  >
                    {p.teams.map(t => `${t.team_flag || ''} ${t.team_name}`).join(', ')}
                  </p>
                )}
              </div>
            </div>
            <p
              className="font-heading font-bold flex-shrink-0"
              style={{
                fontSize: 'clamp(40px, 2.5vw, 72px)',
                color: accent,
              }}
            >
              {p.points}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function BiggestMovers({
  movers,
  accent,
  isEurovision,
  getPointDelta,
}: {
  movers: Participant[]
  accent: string
  isEurovision: boolean
  getPointDelta: (id: string) => number
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-[clamp(24px,2vw,48px)]">
      <h2
        className="font-heading font-bold text-center"
        style={{
          fontSize: 'clamp(40px, 2.5vw, 64px)',
          color: accent,
          letterSpacing: '0.02em',
        }}
      >
        📈 Biggest Movers
      </h2>
      <div className="space-y-[clamp(16px,1vw,32px)] w-full">
        {movers.map((p, i) => {
          const delta = getPointDelta(p.id)
          return (
            <div
              key={p.id}
              className="rounded-[clamp(12px,1vw,24px)] px-[clamp(24px,1.5vw,48px)] py-[clamp(16px,1vw,32px)] flex items-center justify-between"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: `2px solid ${accent}40`,
              }}
            >
              <div>
                <p
                  className="font-heading font-bold"
                  style={{
                    fontSize: 'clamp(28px, 1.8vw, 48px)',
                    color: '#fff',
                  }}
                >
                  {p.name}
                </p>
                {p.teams.length > 0 && (
                  <p
                    style={{
                      fontSize: 'clamp(14px, 0.9vw, 22px)',
                      color: 'rgba(255,255,255,0.6)',
                      marginTop: '4px',
                    }}
                  >
                    {p.teams.map(t => `${t.team_flag || ''} ${t.team_name}`).join(', ')}
                  </p>
                )}
              </div>
              {delta > 0 && (
                <div className="text-right flex-shrink-0">
                  <p
                    style={{
                      fontSize: 'clamp(32px, 1.8vw, 48px)',
                      color: accent,
                      fontWeight: 'bold',
                      fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                    }}
                  >
                    +{delta}
                  </p>
                  <p
                    style={{
                      fontSize: 'clamp(12px, 0.8vw, 18px)',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  >
                    points
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OrganisingHoldingPanel({
  accent,
  isEurovision,
}: {
  accent: string
  isEurovision: boolean
}) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div
          style={{
            fontSize: 'clamp(96px, 6vw, 160px)',
            marginBottom: 'clamp(32px, 2vw, 64px)',
          }}
        >
          {isEurovision ? '🎤' : '⚽'}
        </div>
        <h2
          className="font-heading font-bold"
          style={{
            fontSize: 'clamp(40px, 2.5vw, 72px)',
            color: '#fff',
            marginBottom: 'clamp(16px, 1vw, 32px)',
            letterSpacing: '-0.02em',
          }}
        >
          {isEurovision ? 'Eurovision 2026' : 'World Cup 2026'}
        </h2>
        <p
          style={{
            fontSize: 'clamp(24px, 1.5vw, 42px)',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Live leaderboard updates
        </p>
      </div>
    </div>
  )
}
