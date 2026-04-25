'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface Participant {
  id: string
  name: string
  teams: { team_id: number; team_name: string; team_flag: string | null }[]
  points: number
  rank: number | null
}

type PanelType = 'leaderboard' | 'top5' | 'movers' | 'teams' | 'stats' | 'promo' | 'fixtures' | 'join'

interface Props {
  token: string
  sweepstakeName: string
  logoUrl: string | null
  isEurovision: boolean
  initialRanked: Participant[]
  initialEuScoreByTeam: Record<number, { qualified: boolean; final_position: number | null }>
  participantCount?: number
  entryFee?: number
  totalPot?: number
}

export function TVLeaderboardClient({
  token,
  sweepstakeName,
  logoUrl,
  isEurovision,
  initialRanked,
  initialEuScoreByTeam,
  participantCount = 0,
  entryFee = 0,
  totalPot = 0,
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
  const LIME_WC = '#C8F046'

  const accent = isEurovision ? PINK_EV : LIME_WC
  const background = isEurovision ? BG_EV : BG_WC

  // Rotate panels every 12 seconds
  useEffect(() => {
    // Promo panel only shows until June 11, 2026
    const now = new Date()
    const juneEleventhDeadline = new Date('2026-06-11T00:00:00Z')
    const includePromo = now < juneEleventhDeadline

    const panels: PanelType[] = includePromo
      ? ['leaderboard', 'top5', 'movers', 'teams', 'stats', 'promo', 'fixtures', 'join']
      : ['leaderboard', 'top5', 'movers', 'teams', 'stats', 'fixtures', 'join']

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

        {/* Live indicator + Branding */}
        <div className="flex flex-col items-end gap-[clamp(8px, 0.5vw, 12px)]">
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
          <div className="flex items-center gap-[clamp(8px, 0.5vw, 12px)]">
            <span style={{ fontSize: 'clamp(16px, 1vw, 24px)' }}>⚽</span>
            <p
              style={{
                fontSize: 'clamp(12px, 0.8vw, 18px)',
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 500,
              }}
            >
              playdrawr sweepstake
            </p>
          </div>
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
        ) : currentPanel === 'teams' ? (
          <TeamsPanel
            ranked={ranked}
            accent={accent}
          />
        ) : currentPanel === 'stats' ? (
          <StatsPanel
            totalPot={totalPot}
            participantCount={participantCount}
            entryFee={entryFee}
            accent={accent}
          />
        ) : currentPanel === 'promo' ? (
          <PromoPanel
            token={token}
            ranked={ranked}
            totalPot={totalPot}
            participantCount={participantCount}
            entryFee={entryFee}
            accent={accent}
            appUrl={process.env.NEXT_PUBLIC_APP_URL || 'https://playdrawr.co.uk'}
          />
        ) : currentPanel === 'fixtures' ? (
          <FixturesPanel accent={accent} />
        ) : (
          <JoinPanel token={token} entryFee={entryFee} accent={accent} />
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

function TeamsPanel({
  ranked,
  accent,
}: {
  ranked: Participant[]
  accent: string
}) {
  return (
    <div className="h-full flex flex-col space-y-[clamp(16px,1vw,28px)]">
      <h2
        className="font-heading font-bold"
        style={{
          fontSize: 'clamp(32px, 2vw, 56px)',
          color: accent,
        }}
      >
        🏆 Teams & Participants
      </h2>
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-2 gap-[clamp(16px,1vw,24px)] h-full">
          {ranked.map(p => (
            <div
              key={p.id}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `2px solid ${accent}33`,
                borderRadius: 'clamp(10px, 0.6vw, 16px)',
                padding: 'clamp(16px, 1vw, 28px)',
              }}
            >
              <p
                className="font-heading font-bold"
                style={{
                  fontSize: 'clamp(18px, 1.2vw, 28px)',
                  color: '#fff',
                  marginBottom: 'clamp(8px, 0.5vw, 12px)',
                }}
              >
                {p.name}
              </p>
              <div className="space-y-[clamp(6px, 0.4vw, 10px)]">
                {p.teams.map(t => (
                  <div
                    key={t.team_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'clamp(8px, 0.5vw, 12px)',
                      fontSize: 'clamp(14px, 0.9vw, 22px)',
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    <span>{t.team_flag || '🏳️'}</span>
                    <span>{t.team_name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatsPanel({
  totalPot,
  participantCount,
  entryFee,
  accent,
}: {
  totalPot: number
  participantCount: number
  entryFee: number
  accent: string
}) {
  const first = Math.floor(totalPot * 0.6)
  const second = Math.floor(totalPot * 0.25)
  const third = Math.floor(totalPot * 0.15)

  return (
    <div className="h-full flex flex-col justify-center space-y-[clamp(32px,2vw,64px)]">
      <h2
        className="font-heading font-bold text-center"
        style={{
          fontSize: 'clamp(32px, 2vw, 56px)',
          color: accent,
          marginBottom: 'clamp(16px, 1vw, 28px)',
        }}
      >
        📊 Sweepstake Stats
      </h2>
      <div className="grid grid-cols-3 gap-[clamp(20px,1.2vw,40px)]">
        <StatCard value={`£${totalPot}`} label="Prize Pot" accent={accent} />
        <StatCard value={participantCount.toString()} label="Participants" accent={accent} />
        <StatCard value={`£${entryFee}`} label="Entry Fee" accent={accent} />
      </div>
      <div className="mt-[clamp(20px,1.5vw,40px)]">
        <p
          style={{
            fontSize: 'clamp(16px, 1vw, 24px)',
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            marginBottom: 'clamp(20px,1.2vw,40px)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Prize Distribution
        </p>
        <div className="space-y-[clamp(12px,0.8vw,20px)]">
          <PrizeRow rank={1} amount={first} accent={accent} />
          <PrizeRow rank={2} amount={second} accent={accent} />
          <PrizeRow rank={3} amount={third} accent={accent} />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  value,
  label,
  accent,
}: {
  value: string
  label: string
  accent: string
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: `2px solid ${accent}33`,
        borderRadius: 'clamp(12px,0.8vw,24px)',
        padding: 'clamp(20px,1.5vw,40px)',
        textAlign: 'center',
      }}
    >
      <p
        className="font-heading font-bold"
        style={{
          fontSize: 'clamp(48px, 4vw, 96px)',
          color: accent,
          marginBottom: 'clamp(8px, 0.5vw, 16px)',
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: 'clamp(14px, 0.9vw, 22px)',
          color: 'rgba(255,255,255,0.7)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
        }}
      >
        {label}
      </p>
    </div>
  )
}

function PrizeRow({ rank, amount, accent }: { rank: number; amount: number; accent: string }) {
  const medals = ['🥇', '🥈', '🥉']
  const colors = [accent, '#C0C0C0', '#CD7F32']
  const labels = ['1st Place', '2nd Place', '3rd Place']

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 'clamp(20px,1.2vw,40px)',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.05)',
        border: `2px solid ${accent}33`,
        borderRadius: 'clamp(10px,0.6vw,16px)',
        padding: 'clamp(16px,1vw,28px) clamp(20px,1.2vw,36px)',
      }}
    >
      <span style={{ fontSize: 'clamp(24px, 1.5vw, 40px)' }}>{medals[rank - 1]}</span>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(14px, 0.9vw, 22px)' }}>
        {labels[rank - 1]}
      </p>
      <p
        className="font-heading font-bold"
        style={{
          fontSize: 'clamp(28px, 1.8vw, 48px)',
          color: colors[rank - 1],
        }}
      >
        £{amount}
      </p>
    </div>
  )
}

function FixturesPanel({ accent }: { accent: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h2
        className="font-heading font-bold"
        style={{
          fontSize: 'clamp(32px, 2vw, 56px)',
          color: accent,
          marginBottom: 'clamp(32px, 2vw, 64px)',
        }}
      >
        ⚽ Upcoming Fixtures
      </h2>
      <p
        style={{
          fontSize: 'clamp(18px, 1.2vw, 32px)',
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center',
        }}
      >
        Check back closer to the tournament for fixture details
      </p>
    </div>
  )
}

function JoinPanel({
  token,
  entryFee,
  accent,
}: {
  token: string
  entryFee: number
  accent: string
}) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-[clamp(24px,1.5vw,48px)]">
        <div
          style={{
            width: 'clamp(200px, 15vw, 320px)',
            height: 'clamp(200px, 15vw, 320px)',
            background: '#fff',
            borderRadius: 'clamp(16px, 1vw, 24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(80px, 6vw, 140px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          }}
        >
          📱
        </div>
        <div className="text-center">
          <h2
            className="font-heading font-bold"
            style={{
              fontSize: 'clamp(28px, 2vw, 48px)',
              color: accent,
              marginBottom: 'clamp(12px, 0.8vw, 20px)',
            }}
          >
            Join the sweepstake
          </h2>
          <p
            style={{
              fontSize: 'clamp(18px, 1.2vw, 32px)',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            Scan to sign up • £{entryFee} entry fee
          </p>
        </div>
      </div>
    </div>
  )
}

function PromoPanel({
  token,
  ranked,
  totalPot,
  participantCount,
  entryFee,
  accent,
  appUrl,
}: {
  token: string
  ranked: Participant[]
  totalPot: number
  participantCount: number
  entryFee: number
  accent: string
  appUrl: string
}) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    const updateCountdown = () => {
      const targetDate = new Date('2026-06-11T00:00:00Z').getTime()
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        setCountdown({ days, hours, minutes })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000)
    return () => clearInterval(interval)
  }, [])

  const joinUrl = `${appUrl}/join/${token}`
  const first = Math.floor(totalPot * 0.6)
  const second = Math.floor(totalPot * 0.25)
  const third = Math.floor(totalPot * 0.15)

  return (
    <div className="h-full flex flex-col gap-[clamp(20px,1.5vw,40px)]">
      {/* Header with FIFA logo and countdown */}
      <div className="flex items-start justify-between">
        <div>
          <h2
            className="font-heading font-bold"
            style={{
              fontSize: 'clamp(32px, 2vw, 56px)',
              color: accent,
              marginBottom: 'clamp(8px, 0.5vw, 12px)',
            }}
          >
            FIFA World Cup 2026
          </h2>
          <p
            style={{
              fontSize: 'clamp(14px, 0.9vw, 22px)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Join the playdrawr sweepstake
          </p>
        </div>

        {/* Countdown */}
        <div className="text-center">
          <p
            style={{
              fontSize: 'clamp(12px, 0.8vw, 18px)',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 'clamp(8px, 0.5vw, 12px)',
            }}
          >
            First match in
          </p>
          <div className="flex gap-[clamp(12px, 0.8vw, 20px)]">
            <div style={{ textAlign: 'center' }}>
              <p
                className="font-heading font-bold"
                style={{
                  fontSize: 'clamp(28px, 1.8vw, 48px)',
                  color: accent,
                  lineHeight: 1,
                }}
              >
                {countdown.days}
              </p>
              <p
                style={{
                  fontSize: 'clamp(10px, 0.7vw, 14px)',
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: 'clamp(4px, 0.3vw, 6px)',
                }}
              >
                days
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p
                className="font-heading font-bold"
                style={{
                  fontSize: 'clamp(28px, 1.8vw, 48px)',
                  color: accent,
                  lineHeight: 1,
                }}
              >
                {countdown.hours}
              </p>
              <p
                style={{
                  fontSize: 'clamp(10px, 0.7vw, 14px)',
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: 'clamp(4px, 0.3vw, 6px)',
                }}
              >
                hrs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="flex-1 grid grid-cols-3 gap-[clamp(16px,1vw,24px)] overflow-hidden">
        {/* Participants list */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `2px solid ${accent}33`,
            borderRadius: 'clamp(12px,0.8vw,24px)',
            padding: 'clamp(16px,1vw,28px)',
            overflow: 'auto',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(14px, 0.9vw, 22px)',
              color: accent,
              fontWeight: 700,
              marginBottom: 'clamp(12px,0.8vw,20px)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {participantCount} Signed Up
          </p>
          <div className="space-y-[clamp(6px,0.4vw,10px)]">
            {ranked.map(p => (
              <p
                key={p.id}
                style={{
                  fontSize: 'clamp(12px, 0.8vw, 18px)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                ✓ {p.name}
              </p>
            ))}
          </div>
        </div>

        {/* Prizes */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `2px solid ${accent}33`,
            borderRadius: 'clamp(12px,0.8vw,24px)',
            padding: 'clamp(16px,1vw,28px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 'clamp(12px,0.8vw,20px)',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(14px, 0.9vw, 22px)',
              color: accent,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Prizes
          </p>
          <div className="space-y-[clamp(8px,0.5vw,12px)]">
            <div>
              <p style={{ fontSize: 'clamp(11px, 0.8vw, 16px)', color: 'rgba(255,255,255,0.6)' }}>
                1st Place
              </p>
              <p
                className="font-heading font-bold"
                style={{
                  fontSize: 'clamp(24px, 1.6vw, 40px)',
                  color: accent,
                }}
              >
                £{first}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'clamp(11px, 0.8vw, 16px)', color: 'rgba(255,255,255,0.6)' }}>
                2nd Place
              </p>
              <p
                className="font-heading font-bold"
                style={{
                  fontSize: 'clamp(20px, 1.3vw, 32px)',
                  color: '#C0C0C0',
                }}
              >
                £{second}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'clamp(11px, 0.8vw, 16px)', color: 'rgba(255,255,255,0.6)' }}>
                3rd Place
              </p>
              <p
                className="font-heading font-bold"
                style={{
                  fontSize: 'clamp(20px, 1.3vw, 32px)',
                  color: '#CD7F32',
                }}
              >
                £{third}
              </p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `2px solid ${accent}33`,
            borderRadius: 'clamp(12px,0.8vw,24px)',
            padding: 'clamp(16px,1vw,28px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(12px,0.8vw,20px)',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 'clamp(8px, 0.5vw, 12px)',
              borderRadius: 'clamp(8px, 0.5vw, 12px)',
            }}
          >
            <QRCodeSVG value={joinUrl} size={120} level="H" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: 'clamp(12px, 0.8vw, 18px)',
                color: accent,
                fontWeight: 700,
              }}
            >
              Scan to join
            </p>
            <p
              style={{
                fontSize: 'clamp(10px, 0.7vw, 14px)',
                color: 'rgba(255,255,255,0.6)',
                marginTop: 'clamp(4px, 0.3vw, 6px)',
              }}
            >
              £{entryFee} entry
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
