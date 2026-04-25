'use client'

import { useEffect, useState } from 'react'
import { EUROVISION_SONGS } from '@/lib/eurovision-songs'

interface Participant {
  id: string
  name: string
  teams: { team_id: number; team_name: string; team_flag: string | null }[]
  points: number
  rank: number | null
}

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
  const [isLive, setIsLive] = useState(true)

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
      } catch (error) {
        console.error('Failed to refresh leaderboard', error)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [token, ranked])

  const BG_EV = '#040241'
  const PINK_EV = '#F10F59'
  const PURPLE_EV = '#5A22A9'
  const BG_WC = '#1A2E22'
  const LIME_WC = '#C8F04D'

  const getPointDelta = (participantId: string): number => {
    return ranked.find(p => p.id === participantId)?.points ?? 0 - (previousPoints[participantId] ?? 0)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden"
      style={{ background: '#0a0f0a' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-12 py-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-6">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              style={{ maxHeight: 48, maxWidth: 200, width: 'auto', height: 'auto' }}
            />
          )}
          <h1 className="font-heading font-bold text-4xl" style={{ color: '#fff' }}>
            {sweepstakeName}
          </h1>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ background: isEurovision ? PINK_EV : LIME_WC }}
          />
          <span className="text-sm font-medium" style={{ color: '#8EA899' }}>
            Live
          </span>
        </div>
      </div>

      {/* Leaderboard table */}
      <div className="flex-1 overflow-y-auto px-12 py-8">
        {ranked.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-xl" style={{ color: '#8EA899' }}>
              {isEurovision ? '🎤 ' : '🏆 '}
              The draw hasn't happened yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ranked.map((p, i) => {
              const delta = getPointDelta(p.id)
              const isFirst = i === 0

              return (
                <div
                  key={p.id}
                  className="rounded-lg px-6 py-4 flex items-center gap-6"
                  style={{
                    background:
                      isEurovision
                        ? isFirst
                          ? 'rgba(241,15,89,0.1)'
                          : 'rgba(255,255,255,0.05)'
                        : isFirst
                        ? 'rgba(200,240,77,0.1)'
                        : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${
                      isEurovision
                        ? isFirst
                          ? 'rgba(241,15,89,0.3)'
                          : 'rgba(90,34,169,0.2)'
                        : isFirst
                        ? 'rgba(200,240,77,0.3)'
                        : 'rgba(255,255,255,0.1)'
                    }`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Rank */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        i === 0
                          ? isEurovision
                            ? PINK_EV
                            : LIME_WC
                          : i === 1
                          ? '#C0C0C0'
                          : i === 2
                          ? '#CD7F32'
                          : 'rgba(255,255,255,0.1)',
                      color: i > 2 ? '#8EA899' : '#000',
                    }}
                  >
                    <span className="font-heading font-bold text-xl">{i + 1}</span>
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-2xl" style={{ color: '#fff' }}>
                      {p.name}
                    </p>
                    {p.teams.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.teams.slice(0, 3).map(t => (
                          <div
                            key={t.team_id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-base"
                            style={{
                              background: 'rgba(255,255,255,0.1)',
                              color: '#fff',
                            }}
                          >
                            {t.team_flag && <span>{t.team_flag}</span>}
                            <span>{t.team_name}</span>
                          </div>
                        ))}
                        {p.teams.length > 3 && (
                          <div
                            className="inline-flex items-center px-3 py-1 rounded-lg text-base"
                            style={{ background: 'rgba(255,255,255,0.1)', color: '#8EA899' }}
                          >
                            +{p.teams.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Points + Delta */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p
                        className="font-heading font-bold text-4xl"
                        style={{
                          color:
                            isEurovision
                              ? isFirst
                                ? PINK_EV
                                : '#fff'
                              : isFirst
                              ? LIME_WC
                              : '#fff',
                        }}
                      >
                        {p.points}
                      </p>
                      {delta !== 0 && (
                        <p
                          className="text-lg font-medium mt-1"
                          style={{
                            color: delta > 0 ? (isEurovision ? PINK_EV : LIME_WC) : '#FF6B6B',
                          }}
                        >
                          {delta > 0 ? '+' : ''}{delta}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-12 py-4 text-sm border-t"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#8EA899' }}
      >
        <span>Auto-refresh every 30 seconds</span>
        <span>Last updated: {formatTime(lastUpdated)}</span>
      </div>
    </div>
  )
}
