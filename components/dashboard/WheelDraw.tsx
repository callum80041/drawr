'use client'

import { useState, useCallback, useEffect } from 'react'
import { TeamWheel } from '@/components/dashboard/wheel/TeamWheel'
import { ParticipantStrip } from '@/components/dashboard/wheel/ParticipantStrip'
import { WinnerPanel } from '@/components/dashboard/wheel/WinnerPanel'
import { AvailableTeamsList } from '@/components/dashboard/wheel/AvailableTeamsList'
import { FullscreenToggle } from '@/components/dashboard/wheel/FullscreenToggle'
import { Confetti } from '@/components/dashboard/wheel/Confetti'
import { createSoundManager } from '@/components/dashboard/wheel/SoundEffects'

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

const soundManager = typeof window !== 'undefined' ? createSoundManager() : null

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
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [autoSpin, setAutoSpin] = useState(false)

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
    const extraSpins = Math.random() * 360 + 1440

    return baseRotation + extraSpins
  }, [assignedTeam, availableTeams, spinRotation])

  const handleSpin = async () => {
    if (isSpinning || !assignedTeam || !currentParticipant) return

    setIsSpinning(true)
    setPhase('spinning')

    soundManager?.playSpin()

    const targetRotation = getTargetRotation()
    setSpinRotation(targetRotation)

    // Wait for animation to complete (2.8s spin + 0.2s buffer)
    await new Promise(resolve => setTimeout(resolve, 3000))

    soundManager?.playLand()
    setConfettiTrigger(prev => prev + 1)
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

  // Auto-spin when in auto mode and phase is revealed
  useEffect(() => {
    if (!autoSpin || phase !== 'revealed') return

    const timer = setTimeout(() => {
      handleNext()
      // After advancing, auto-spin will trigger again via the revealed->spinning phase change
    }, 800)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSpin, phase, currentIdx, participants.length])

  // Auto-trigger spin when phase becomes spinning and auto is enabled
  useEffect(() => {
    if (!autoSpin || phase !== 'spinning' || isSpinning) return

    const timer = setTimeout(() => {
      handleSpin()
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSpin, phase, isSpinning])

  // Completed state
  if (phase === 'completed') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-8 text-center space-y-4">
          <div className="text-6xl">✨</div>
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
    <div className="space-y-4 h-full flex flex-col bg-light">
      <Confetti trigger={confettiTrigger} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-4">
        <div>
          <h1 className="font-heading font-bold text-pitch text-2xl">{sweepstakeName}</h1>
          <p className="text-mid text-sm">Spin the wheel</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoSpin(!autoSpin)}
            title={autoSpin ? 'Stop auto-spin' : 'Start auto-spin'}
            className={`transition-colors p-2 rounded ${autoSpin ? 'bg-lime text-pitch' : 'text-pitch hover:text-grass'}`}
          >
            {autoSpin ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute' : 'Unmute'}
            className="text-pitch hover:text-grass transition-colors p-2"
          >
            {soundEnabled ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.50612381,0.9 2.41,0.74788954 1.77946707,1.01498294 C0.994623095,1.4862751 0.837654326,2.57649314 1.15159189,3.36201033 L3.03521743,9.80300331 C3.03521743,9.96010074 3.34915502,10.1171982 3.50612381,10.1171982 L16.6915026,10.9026851 C16.6915026,10.9026851 17.1624089,10.9026851 17.1624089,10.4314178 L17.1624089,11.5389234 C17.1624089,12.0102155 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
              </svg>
            )}
          </button>
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
      <div className="px-6">
        <ParticipantStrip
          participants={participants}
          currentIdx={currentIdx}
        />
      </div>

      {/* Main layout: Available teams | Wheel | Winners + Controls */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6 px-6 pb-6 min-h-0 overflow-hidden">
        {/* Available teams list */}
        <div className="min-h-0">
          <AvailableTeamsList teams={availableTeams} />
        </div>

        {/* Wheel */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-[#E5EDEA] p-4 overflow-hidden">
          <TeamWheel
            teams={availableTeams}
            isSpinning={isSpinning}
            spinRotation={spinRotation}
          />
        </div>

        {/* Winners panel + Controls */}
        <div className="flex flex-col gap-4 min-h-0">
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
                disabled={isSpinning || !assignedTeam || autoSpin}
                className="w-full bg-lime text-pitch font-heading font-bold py-3 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isSpinning ? 'Spinning…' : 'Spin →'}
              </button>
            )}

            {phase === 'revealed' && currentIdx < participants.length - 1 && (
              <button
                onClick={handleNext}
                disabled={autoSpin}
                className="w-full bg-lime text-pitch font-heading font-bold py-3 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                Next →
              </button>
            )}

            {phase === 'revealed' && currentIdx === participants.length - 1 && (
              <button
                onClick={handleNext}
                disabled={autoSpin}
                className="w-full bg-lime text-pitch font-heading font-bold py-3 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
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
