'use client'

interface Team {
  id: number
  name: string
  flag: string | null
  group_name: string | null
}

interface Participant {
  id: string
  name: string
}

interface Props {
  winners: { participant: Participant; team: Team }[]
}

export function WinnerPanel({ winners }: Props) {
  return (
    <div className="bg-white rounded-lg border border-[#E5EDEA] p-4 max-h-96 overflow-y-auto">
      <p className="text-xs font-medium text-mid uppercase tracking-wider mb-3">
        Assigned ({winners.length})
      </p>

      {winners.length === 0 ? (
        <p className="text-mid text-xs italic text-center py-4">None yet</p>
      ) : (
        <div className="space-y-2">
          {winners.map((w, idx) => (
            <div
              key={`${w.participant.id}-${w.team.id}`}
              className="bg-lime/10 border border-lime/30 rounded-lg p-3"
              style={{
                animation: 'card-in 0.25s ease both',
                animationDelay: `${idx * 50}ms`,
              }}
            >
              <p className="font-heading font-bold text-pitch text-sm mb-1">
                {w.participant.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none">{w.team.flag ?? '🏳️'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-pitch text-xs font-medium leading-tight truncate">
                    {w.team.name}
                  </p>
                  {w.team.group_name && (
                    <p className="text-mid text-[10px]">{w.team.group_name}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
