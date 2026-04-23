'use client'

import { useMemo } from 'react'

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
  const wheelRadius = 200

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

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-96 h-96">
        {/* Pointer at top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-lime" />
        </div>

        {/* Wheel container */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl"
          style={{
            background: 'conic-gradient(#1A6B47 0deg, #0B3D2E 45deg, #1A6B47 90deg, #0B3D2E 135deg, #1A6B47 180deg, #0B3D2E 225deg, #1A6B47 270deg, #0B3D2E 315deg)',
            animation: isSpinning ? 'none' : 'none',
            transform: `rotate(${spinRotation}deg)`,
            transition: isSpinning ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <svg
            viewBox="-220 -220 440 440"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }}
          >
            {segments.map((team, i) => {
              const startAngle = segmentAngles[i].startAngle
              const endAngle = segmentAngles[i].endAngle
              const path = createPath(startAngle, endAngle)

              const labelAngle = (startAngle + endAngle) / 2
              const labelDist = wheelRadius * 0.65
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
                    opacity={isAvailable ? 1 : 0.3}
                  />

                  {/* Label */}
                  {isAvailable && (
                    <g transform={`translate(${labelX}, ${labelY})`}>
                      {/* Flag emoji */}
                      <text
                        x="0"
                        y="-8"
                        textAnchor="middle"
                        fontSize="20"
                        dominantBaseline="middle"
                      >
                        {team.flag ?? '🏳️'}
                      </text>

                      {/* Team name (truncated) */}
                      <text
                        x="0"
                        y="12"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#F4F7F2"
                        dominantBaseline="middle"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {team.name.length > 10 ? team.name.substring(0, 10) + '…' : team.name}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-pitch">
            <span className="text-2xl">🎡</span>
          </div>
        </div>
      </div>
    </div>
  )
}
