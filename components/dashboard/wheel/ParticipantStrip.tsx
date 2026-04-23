'use client'

interface Participant {
  id: string
  name: string
}

interface Props {
  participants: Participant[]
  currentIdx: number
}

export function ParticipantStrip({
  participants,
  currentIdx,
}: Props) {
  const currentParticipant = participants[currentIdx]
  const upNext = participants[currentIdx + 1]

  return (
    <div className="bg-pitch text-white p-4 rounded-lg">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Current</p>
          <p className="font-heading font-bold text-lg">
            {currentParticipant?.name ?? 'All drawn'}
          </p>
        </div>

        {upNext && (
          <div className="text-right">
            <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Up next</p>
            <p className="font-heading font-bold text-lg">{upNext.name}</p>
          </div>
        )}

        <div className="text-right ml-auto">
          <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Progress</p>
          <p className="font-heading font-bold text-lg">
            {currentIdx} <span className="text-white/40 text-sm">/ {participants.length}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
