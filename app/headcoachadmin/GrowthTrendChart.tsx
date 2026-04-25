'use client'

export interface GrowthData {
  date: string
  organisers: number
  sweepstakes: number
  participants: number
}

interface GrowthTrendChartProps {
  data: GrowthData[]
}

export function GrowthTrendChart({ data }: GrowthTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-mid">
        No growth data available yet
      </div>
    )
  }

  const maxValue = Math.max(
    ...data.map(d => Math.max(d.organisers, d.sweepstakes, d.participants)),
    1
  )

  const padding = 40
  const chartWidth = 100
  const chartHeight = 200
  const pointCount = data.length

  // Scale functions
  const scaleX = (index: number) => (index / (pointCount - 1)) * chartWidth
  const scaleY = (value: number) => chartHeight - (value / maxValue) * chartHeight

  // Generate SVG path for a line
  const generatePath = (values: number[]) => {
    return values
      .map((value, index) => {
        const x = scaleX(index)
        const y = scaleY(value)
        return `${x},${y}`
      })
      .join(' L ')
  }

  const organisersPath = `M ${generatePath(data.map(d => d.organisers))}`
  const sweepstakesPath = `M ${generatePath(data.map(d => d.sweepstakes))}`
  const participantsPath = `M ${generatePath(data.map(d => d.participants))}`

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth + padding * 2} ${chartHeight + padding * 2}`}
          className="w-full h-64 min-w-max"
        >
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={padding} y2={chartHeight + padding} stroke="#E5EDEA" strokeWidth="1" />
          <line x1={padding} y1={chartHeight + padding} x2={chartWidth + padding} y2={chartHeight + padding} stroke="#E5EDEA" strokeWidth="1" />

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const value = Math.round(maxValue * pct)
            const y = padding + chartHeight - scaleY(value)
            return (
              <g key={`y-${i}`}>
                <line x1={padding - 4} y1={y} x2={padding} y2={y} stroke="#E5EDEA" strokeWidth="1" />
                <text x={padding - 8} y={y} textAnchor="end" dominantBaseline="middle" className="text-xs fill-mid">
                  {value}
                </text>
              </g>
            )
          })}

          {/* Data lines */}
          <polyline
            points={generatePath(data.map(d => d.organisers))}
            fill="none"
            stroke="#16a34a"
            strokeWidth="2"
            transform={`translate(${padding}, ${padding})`}
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points={generatePath(data.map(d => d.sweepstakes))}
            fill="none"
            stroke="#eab308"
            strokeWidth="2"
            transform={`translate(${padding}, ${padding})`}
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points={generatePath(data.map(d => d.participants))}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            transform={`translate(${padding}, ${padding})`}
            vectorEffect="non-scaling-stroke"
          />

          {/* X-axis labels */}
          {data.map((d, i) => {
            // Show every 5th label to avoid crowding
            if (data.length > 10 && i % 5 !== 0 && i !== data.length - 1) return null
            const x = padding + scaleX(i)
            return (
              <g key={`x-${i}`}>
                <line x1={x} y1={chartHeight + padding} x2={x} y2={chartHeight + padding + 4} stroke="#E5EDEA" strokeWidth="1" />
                <text x={x} y={chartHeight + padding + 16} textAnchor="middle" className="text-xs fill-mid">
                  {new Date(d.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 rounded bg-green-600" />
          <span className="text-mid">Organisers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 rounded bg-yellow-500" />
          <span className="text-mid">Sweepstakes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 rounded bg-blue-500" />
          <span className="text-mid">Participants</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#E5EDEA]">
        <div className="text-center">
          <p className="text-xs text-mid mb-1">Organisers</p>
          <p className="text-sm font-semibold text-green-600">{data[data.length - 1].organisers.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-mid mb-1">Sweepstakes</p>
          <p className="text-sm font-semibold text-yellow-600">{data[data.length - 1].sweepstakes.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-mid mb-1">Participants</p>
          <p className="text-sm font-semibold text-blue-600">{data[data.length - 1].participants.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
