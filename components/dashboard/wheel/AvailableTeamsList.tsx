'use client'

interface Team {
  id: number
  name: string
  flag: string | null
  group_name: string | null
}

interface Props {
  teams: Team[]
}

export function AvailableTeamsList({ teams }: Props) {
  return (
    <div className="bg-white rounded-lg border border-[#E5EDEA] p-4 h-full overflow-y-auto">
      <p className="text-xs font-medium text-mid uppercase tracking-wider mb-3">
        Available teams ({teams.length})
      </p>

      {teams.length === 0 ? (
        <p className="text-mid text-xs italic text-center py-4">None</p>
      ) : (
        <div className="space-y-1.5">
          {teams.map(team => (
            <div
              key={team.id}
              className="flex items-center gap-2 p-2 rounded hover:bg-light transition-colors"
            >
              <span className="text-lg leading-none flex-shrink-0">{team.flag ?? '🏳️'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-pitch text-xs font-medium leading-tight truncate">
                  {team.name}
                </p>
                {team.group_name && (
                  <p className="text-mid text-[10px]">{team.group_name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
