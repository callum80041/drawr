'use client'

import { useMemo, useState, useEffect } from 'react'

interface Team {
  id: number
  name: string
  flag: string | null
}

interface Props {
  teams: Team[]
  isSpinning: boolean
  spinRotation: number
}

export function TeamWheel({ teams, isSpinning, spinRotation }: Props) {
  const [displayRotation, setDisplayRotation] = useState(0)

  // Smooth spin animation
  useEffect(() => {
    if (isSpinning) {
      // Rapid spinning effect for 2.8 seconds
      const spinStart = Date.now()
      const spinDuration = 2800

      const animateSpin = () => {
        const elapsed = Date.now() - spinStart
        if (elapsed < spinDuration) {
          // Fast spin with deceleration
          const progress = elapsed / spinDuration
          const easeOutCubic = 1 - Math.pow(1 - progress, 3)
          const totalRotation = spinRotation + (easeOutCubic * 1080)
          setDisplayRotation(totalRotation)
          requestAnimationFrame(animateSpin)
        } else {
          setDisplayRotation(spinRotation)
        }
      }
      animateSpin()
    }
  }, [isSpinning, spinRotation])

  const segments = useMemo(() => {
    const segmentCount = Math.max(teams.length, 8)
    return teams.length > 0
      ? teams
      : Array.from({ length: segmentCount }, (_, i) => ({
          id: i,
          name: '',
          flag: null,
        }))
  }, [teams])

  const degreesPerSegment = 360 / segments.length
  const wheelRadius = 240

  const segmentAngles = segments.map((_, i) => ({
    startAngle: (i * degreesPerSegment - 90) * (Math.PI / 180),
    endAngle: ((i + 1) * degreesPerSegment - 90) * (Math.PI / 180),
  }))

  const createPath = (startAngle: number, endAngle: number) => {
    const x1 = Math.cos(startAngle) * wheelRadius
    const y1 = Math.sin(startAngle) * wheelRadius
    const x2 = Math.cos(endAngle) * wheelRadius
    const y2 = Math.sin(endAngle) * wheelRadius

    const largeArc = degreesPerSegment > 180 ? 1 : 0

    return `M 0 0 L ${x1} ${y1} A ${wheelRadius} ${wheelRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  const getTeamShortName = (name: string) => {
    if (name.length <= 8) return name
    const words = name.split(' ')
    if (words.length > 1) {
      return words.map(w => w[0]).join('')
    }
    return name.substring(0, 8) + '…'
  }

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[540px] h-[540px]">
        {/* Pointer at top with glow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
          <div className="absolute inset-0 w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent border-t-lime blur-sm opacity-60 -translate-y-1" />
          <div className="relative w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent border-t-lime" />
        </div>

        {/* Wheel container */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl"
          style={{
            background: 'conic-gradient(#1A6B47 0deg, #0B3D2E 45deg, #1A6B47 90deg, #0B3D2E 135deg, #1A6B47 180deg, #0B3D2E 225deg, #1A6B47 270deg, #0B3D2E 315deg)',
            transform: `rotate(${displayRotation}deg)`,
            filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.2))',
          }}
        >
          <svg
            viewBox="-260 -260 520 520"
            className="w-full h-full"
          >
            {segments.map((team, i) => {
              const startAngle = segmentAngles[i].startAngle
              const endAngle = segmentAngles[i].endAngle
              const path = createPath(startAngle, endAngle)

              const labelAngle = (startAngle + endAngle) / 2
              const labelDist = wheelRadius * 0.7
              const labelX = Math.cos(labelAngle) * labelDist
              const labelY = Math.sin(labelAngle) * labelDist

              const isAvailable = team.name.length > 0

              return (
                <g key={team.id}>
                  {/* Segment */}
                  <path
                    d={path}
                    fill={i % 2 === 0 ? '#1A6B47' : '#0B3D2E'}
                    stroke="#F4F7F2"
                    strokeWidth="2"
                    opacity={isAvailable ? 1 : 0.2}
                  />

                  {/* Label */}
                  {isAvailable && (
                    <g transform={`translate(${labelX}, ${labelY})`}>
                      {/* Flag emoji */}
                      <text
                        x="0"
                        y="-10"
                        textAnchor="middle"
                        fontSize="24"
                        dominantBaseline="middle"
                      >
                        {team.flag ?? '🏳️'}
                      </text>

                      {/* Abbreviated team name */}
                      <text
                        x="0"
                        y="14"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fill="#F4F7F2"
                        dominantBaseline="middle"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {getTeamShortName(team.name)}
                      </text>

                      {/* Tooltip title for full name */}
                      <title>{team.name}</title>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-pitch">
            <span className="text-3xl">🎡</span>
          </div>
        </div>
      </div>
    </div>
  )
}
