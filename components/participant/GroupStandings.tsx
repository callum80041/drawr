'use client'

interface Standing {
  group_name: string
  team_id: number
  position: number
  played: number
  wins: number
  draws: number
  losses: number
  goals_for: number
  goals_against: number
  goals_diff: number
  points: number
  form: string | null
  team: {
    name: string
    logo_url: string | null
    flag: string
  }
}

interface GroupStandingsProps {
  standings: Standing[]
}

export function GroupStandings({ standings }: GroupStandingsProps) {
  // Group standings by group_name
  const groupedByName = standings.reduce(
    (acc, standing) => {
      const group = standing.group_name
      if (!acc[group]) acc[group] = []
      acc[group].push(standing)
      return acc
    },
    {} as Record<string, Standing[]>
  )

  // Sort each group by position
  Object.keys(groupedByName).forEach(group => {
    groupedByName[group].sort((a, b) => a.position - b.position)
  })

  // Sort groups alphabetically
  const sortedGroups = Object.keys(groupedByName).sort()

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold font-heading">Group Standings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedGroups.map(group => (
          <div key={group} className="border border-gray-200 rounded-lg p-4 bg-white">
            <h3 className="font-bold font-heading mb-3 text-lg text-pitch">{group}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-2 py-2 font-bold">Pos</th>
                    <th className="text-left px-2 py-2 font-bold">Team</th>
                    <th className="text-center px-1 py-2 font-bold">P</th>
                    <th className="text-center px-1 py-2 font-bold">W-D-L</th>
                    <th className="text-center px-1 py-2 font-bold">GF-GA</th>
                    <th className="text-center px-1 py-2 font-bold">GD</th>
                    <th className="text-center px-2 py-2 font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedByName[group].map(standing => (
                    <tr key={`${group}-${standing.team_id}`} className="border-b border-gray-100">
                      <td className="px-2 py-2 font-bold text-pitch">{standing.position}</td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          {standing.team.logo_url ? (
                            <img
                              src={standing.team.logo_url}
                              alt={standing.team.name}
                              className="w-5 h-5"
                              onError={e => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                          ) : null}
                          <span className={standing.team.logo_url ? '' : 'hidden'}>
                            {standing.team.flag}
                          </span>
                          <span className="font-medium">{standing.team.name}</span>
                        </div>
                      </td>
                      <td className="text-center px-1 py-2">{standing.played}</td>
                      <td className="text-center px-1 py-2 text-xs">
                        {standing.wins}-{standing.draws}-{standing.losses}
                      </td>
                      <td className="text-center px-1 py-2 text-xs">
                        {standing.goals_for}-{standing.goals_against}
                      </td>
                      <td className={`text-center px-1 py-2 font-semibold ${standing.goals_diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {standing.goals_diff > 0 ? '+' : ''}{standing.goals_diff}
                      </td>
                      <td className="text-center px-2 py-2 font-bold bg-pitch/10 rounded">{standing.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
