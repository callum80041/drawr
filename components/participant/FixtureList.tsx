'use client'

import Image from 'next/image'

interface Match {
  id: number
  round: string | null
  kickoff: string | null
  status: string | null
  venue: string | null
  venue_city: string | null
  home_team_name: string
  home_score: number | null
  home_flag: string | null
  home_logo: string | null
  home_participant: string | null
  away_team_name: string
  away_score: number | null
  away_flag: string | null
  away_logo: string | null
  away_participant: string | null
}

interface Props {
  matches: Match[]
  highlightTeamIds?: number[]
}

const FINISHED = ['FT', 'AET', 'PEN']
const LIVE     = ['1H', '2H', 'ET', 'P', 'HT', 'LIVE']

function toBST(dateStr: string) {
  const d = new Date(dateStr)
  // BST = UTC+1
  return new Date(d.getTime() + 60 * 60 * 1000)
}

function formatDateLabel(dateStr: string) {
  const bst = toBST(dateStr)
  return bst.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(dateStr: string) {
  const bst = toBST(dateStr)
  return bst.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' BST'
}

function groupByDate(matches: Match[]) {
  const groups: Record<string, Match[]> = {}
  for (const m of matches) {
    const key = m.kickoff ? toBST(m.kickoff).toDateString() : 'TBD'
    if (!groups[key]) groups[key] = []
    groups[key].push(m)
  }
  return groups
}

function TeamDisplay({ name, flag, logo, participant, align }: {
  name: string
  flag: string | null
  logo: string | null
  participant: string | null
  align: 'left' | 'right'
}) {
  return (
    <div className={`flex items-center gap-1.5 min-w-0 flex-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      {/* Logo or flag */}
      <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center">
        {logo ? (
          <Image src={logo} alt={name} width={32} height={32} className="object-contain" unoptimized />
        ) : flag ? (
          <span className="text-xl sm:text-2xl leading-none">{flag}</span>
        ) : (
          <span className="text-xl sm:text-2xl leading-none">🏳️</span>
        )}
      </div>
      <div className={`min-w-0 overflow-hidden ${align === 'right' ? 'text-right' : ''}`}>
        <p className="text-xs sm:text-sm font-medium text-pitch truncate leading-tight">{name}</p>
        {participant && (
          <p className="text-[10px] sm:text-[11px] text-grass font-medium truncate leading-tight">{participant}</p>
        )}
      </div>
    </div>
  )
}

export function FixtureList({ matches, highlightTeamIds = [] }: Props) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📅</p>
        <p className="font-medium text-pitch">Fixtures not loaded yet.</p>
        <p className="text-sm text-mid mt-1">They&apos;ll appear here once the organiser has synced.</p>
      </div>
    )
  }

  const groups = groupByDate(matches)

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([dateKey, dayMatches]) => (
        <div key={dateKey}>
          {/* Date header */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium text-pitch">
              {dayMatches[0].kickoff ? formatDateLabel(dayMatches[0].kickoff) : 'Date TBC'}
            </span>
            <span className="flex-1 h-px bg-[#E5EDEA]" />
            <span className="text-xs text-mid">{dayMatches.length} match{dayMatches.length !== 1 ? 'es' : ''}</span>
          </div>

          <div className="space-y-2">
            {dayMatches.map(m => {
              const isFinished = m.status ? FINISHED.includes(m.status) : false
              const isLive     = m.status ? LIVE.includes(m.status) : false

              return (
                <div
                  key={m.id}
                  className="bg-white rounded-xl border border-[#E5EDEA] px-4 py-3"
                >
                  {/* Round + status */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] text-mid uppercase tracking-wide">
                      {m.round ?? 'Group Stage'}
                    </span>
                    {isLive && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-red-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* Teams + score */}
                  <div className="flex items-center gap-2">
                    <TeamDisplay name={m.home_team_name} flag={m.home_flag} logo={m.home_logo} participant={m.home_participant ?? null} align="left" />

                    <div className="shrink-0 text-center w-14 sm:w-16">
                      {isFinished || isLive ? (
                        <span className={`font-heading text-lg sm:text-xl font-bold ${isLive ? 'text-red-500' : 'text-pitch'}`}>
                          {m.home_score ?? 0}–{m.away_score ?? 0}
                        </span>
                      ) : (
                        <p className="font-medium text-pitch text-xs sm:text-sm leading-tight">
                          {m.kickoff ? formatTime(m.kickoff) : 'TBC'}
                        </p>
                      )}
                    </div>

                    <TeamDisplay name={m.away_team_name} flag={m.away_flag} logo={m.away_logo} participant={m.away_participant ?? null} align="right" />
                  </div>

                  {/* Venue */}
                  {(m.venue || m.venue_city) && (
                    <p className="text-[11px] text-mid mt-2 text-center">
                      📍 {[m.venue, m.venue_city].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
