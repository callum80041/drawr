'use client'

interface SignupData {
  date: string
  name: number
  email: number
  google: number
  twitter: number
}

interface SignupMethodChartProps {
  data: SignupData[]
}

export function SignupMethodChart({ data }: SignupMethodChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-mid">
        No signup data available yet
      </div>
    )
  }

  // Find max total for scaling
  const maxTotal = Math.max(...data.map(d => d.name + d.email + d.google + d.twitter), 1)

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 h-32">
        {data.map(day => {
          const total = day.name + day.email + day.google + day.twitter
          const heightPercent = (total / maxTotal) * 100

          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col justify-end items-center gap-1"
              title={`${day.date}: ${day.name} name, ${day.email} email, ${day.google} google, ${day.twitter} twitter`}
            >
              {/* Stacked bar */}
              <div className="w-full flex flex-col-reverse gap-px" style={{ height: `${heightPercent}%`, minHeight: '2px' }}>
                {day.twitter > 0 && (
                  <div
                    className="w-full bg-black"
                    style={{ height: `${(day.twitter / total) * 100}%`, minHeight: '1px' }}
                    title={`X: ${day.twitter}`}
                  />
                )}
                {day.google > 0 && (
                  <div
                    className="w-full bg-red-500"
                    style={{ height: `${(day.google / total) * 100}%`, minHeight: '1px' }}
                    title={`Google: ${day.google}`}
                  />
                )}
                {day.email > 0 && (
                  <div
                    className="w-full bg-blue-500"
                    style={{ height: `${(day.email / total) * 100}%`, minHeight: '1px' }}
                    title={`Email: ${day.email}`}
                  />
                )}
                {day.name > 0 && (
                  <div
                    className="w-full bg-grass"
                    style={{ height: `${(day.name / total) * 100}%`, minHeight: '1px' }}
                    title={`Name only: ${day.name}`}
                  />
                )}
              </div>

              {/* Label */}
              <div className="text-xs text-mid w-full text-center truncate">
                {new Date(day.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-grass" />
          <span className="text-mid">Name only</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-mid">Email</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-mid">Google</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-black" />
          <span className="text-mid">X</span>
        </div>
      </div>

      {/* Total count */}
      <div className="text-center text-sm text-mid pt-2 border-t border-[#E5EDEA]">
        Total signups: <strong className="text-pitch">{data.reduce((sum, d) => sum + d.name + d.email + d.google + d.twitter, 0)}</strong>
      </div>
    </div>
  )
}
