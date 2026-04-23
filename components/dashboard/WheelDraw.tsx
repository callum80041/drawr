'use client'

import { useState, useCallback } from 'react'
import { TeamWheel } from '@/components/dashboard/wheel/TeamWheel'
import { ParticipantStrip } from '@/components/dashboard/wheel/ParticipantStrip'
import { WinnerPanel } from '@/components/dashboard/wheel/WinnerPanel'
import { FullscreenToggle } from '@/components/dashboard/wheel/FullscreenToggle'

interface Team {
  id: number
  name: string
  flag: string | null
  logo_url: string | null
  group_name: string | null
}

interface Participant {
  id: string
  name: string
}

interface Assignment {
  participantId: string
  team: Team
}

interface Props {
  sweepstakeName: string
  participants: Participant[]
  teams: Team[]
  assignmentMap: Map<string, Team[]>
  onComplete: () => void
  onSkip: () => void
}

type Phase = 'spinning' | 'revealed' | 'completed'

export function WheelDraw({
  sweepstakeName,
  participants,
  teams,
  assignmentMap,
  onComplete,
  onSkip,
}: Props) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('spinning')
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinRotation, setSpinRotation] = useState(0)
  const [winners, setWinners] = useState<Assignment[]>([])

  const currentParticipant = participants[currentIdx]
  const assignedTeam = assignmentMap.get(currentParticipant?.id ?? '')?.at(0)

  // Available teams: exclude teams already revealed in this animation
  const revealedTeamIds = new Set(winners.map(w => w.team.id))
  const availableTeams = teams.filter(t => !revealedTeamIds.has(t.id))

  // Calculate target rotation to land on assigned team
  const getTargetRotation = useCallback(() => {
    if (!assignedTeam) return spinRotation

    const teamIdx = availableTeams.findIndex(t => t.id === assignedTeam.id)
    if (teamIdx === -1) return spinRotation

    const segmentDegrees = 360 / availableTeams.length
    const targetSegment = availableTeams.length - teamIdx
    const baseRotation = targetSegment * segmentDegrees
    const extraSpins = Math.random() * 360 + 1080

    return baseRotation + extraSpins
  }, [assignedTeam, availableTeams, spinRotation])

  const handleSpin = async () => {
    if (isSpinning || !assignedTeam || !currentParticipant) return

    setIsSpinning(true)
    setPhase('spinning')

    const targetRotation = getTargetRotation()
    setSpinRotation(targetRotation)

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 3000))

    setPhase('revealed')
    setIsSpinning(false)
  }

  const handleNext = () => {
    if (!currentParticipant || !assignedTeam) return

    // Add to winners
    setWinners(prev => [
      ...prev,
      { participantId: currentParticipant.id, team: assignedTeam },
    ])

    // Move to next participant
    if (currentIdx < participants.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setPhase('spinning')
    } else {
      setPhase('completed')
    }
  }

  // Completed state
  if (phase === 'completed') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-8 text-center space-y-4">
          <div className="text-5xl">✨</div>
          <h2 className="font-heading font-bold text-pitch text-2xl">Draw complete</h2>
          <p className="text-mid text-sm">All participants have been assigned their teams.</p>
          <button
            onClick={onComplete}
            className="bg-lime text-pitch font-heading font-bold text-lg px-6 py-3 rounded-xl hover:bg-[#b8e03d] transition-colors"
          >
            View results →
          </button>
        </div>
      </div>
    )
  }

  // Spinning and revealed states
  const displayedWinners: Assignment[] = [
    ...winners,
    ...(phase === 'revealed' && currentParticipant && assignedTeam
      ? [{ participantId: currentParticipant.id, team: assignedTeam }]
      : []),
  ]

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-pitch text-2xl">{sweepstakeName}</h1>
          <p className="text-mid text-sm">Spin the wheel</p>
        </div>
        <div className="flex items-center gap-2">
          <FullscreenToggle />
          <button
            onClick={onSkip}
            className="text-sm text-mid hover:text-pitch transition-colors underline underline-offset-2"
          >
            Skip to end
          </button>
        </div>
      </div>

      {/* Participant strip */}
      <ParticipantStrip
        participants={participants}
        currentIdx={currentIdx}
      />

      {/* Main layout: Wheel + Winners */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 min-h-0">
        {/* Wheel */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-[#E5EDEA] p-4">
          <TeamWheel
            teams={availableTeams}
            isSpinning={isSpinning}
            spinRotation={spinRotation}
          />
        </div>

        {/* Winners panel */}
        <div className="flex flex-col gap-4">
          <WinnerPanel
            winners={displayedWinners.map(w => ({
              participant: participants.find(p => p.id === w.participantId)!,
              team: w.team,
            }))}
          />

          {/* Controls */}
          <div className="space-y-2">
            {phase === 'spinning' && (
              <button
                onClick={handleSpin}
                disabled={isSpinning || !assignedTeam}
                className="w-full bg-lime text-pitch font-heading font-bold py-3 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSpinning ? 'Spinning…' : 'Spin →'}
              </button>
            )}

            {phase === 'revealed' && currentIdx < participants.length - 1 && (
              <button
                onClick={handleNext}
                className="w-full bg-lime text-pitch font-heading font-bold py-3 rounded-lg hover:bg-[#b8e03d] transition-colors"
              >
                Next →
              </button>
            )}

            {phase === 'revealed' && currentIdx === participants.length - 1 && (
              <button
                onClick={handleNext}
                className="w-full bg-lime text-pitch font-heading font-bold py-3 rounded-lg hover:bg-[#b8e03d] transition-colors"
              >
                Finish →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
