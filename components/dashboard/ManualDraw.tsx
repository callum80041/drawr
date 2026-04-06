'use client'

import { useState, useTransition } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import { createClient } from '@/lib/supabase/client'

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
  id: string
  participant_id: string
  team_id: number
  team_name: string
  team_flag: string | null
}

interface Props {
  sweepstakeId: string
  participants: Participant[]
  teams: Team[]
  initialAssignments: Assignment[]
  drawCompletedAt: string | null
}

// ── Draggable team chip ───────────────────────────────────────────────────────

function TeamChip({ team, isDragging = false }: { team: Team; isDragging?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 bg-white border rounded-lg px-2.5 py-1.5 cursor-grab select-none transition-shadow ${
        isDragging
          ? 'border-grass shadow-lg shadow-grass/20 opacity-90'
          : 'border-[#E5EDEA] hover:border-grass hover:shadow-sm'
      }`}
    >
      <span className="text-base leading-none">{team.flag ?? '🏳️'}</span>
      <span className="text-xs font-medium text-pitch whitespace-nowrap">{team.name}</span>
    </div>
  )
}

function DraggableTeamChip({ team }: { team: Team }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `team-${team.id}`,
    data: { type: 'team', team },
  })

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ opacity: isDragging ? 0.3 : 1 }}>
      <TeamChip team={team} />
    </div>
  )
}

// ── Droppable participant row ──────────────────────────────────────────────────

function ParticipantSlot({
  participant,
  assignedTeams,
  onRemoveTeam,
}: {
  participant: Participant
  assignedTeams: Team[]
  onRemoveTeam: (participantId: string, teamId: number) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `participant-${participant.id}`,
    data: { type: 'participant', participantId: participant.id },
  })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-2 p-3 transition-colors min-h-[64px] ${
        isOver
          ? 'border-grass bg-grass/5'
          : 'border-[#E5EDEA] bg-white'
      }`}
    >
      <p className="font-heading font-bold text-pitch text-sm mb-2">{participant.name}</p>
      {assignedTeams.length === 0 ? (
        <p className="text-mid text-xs italic">Drop a team here</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {assignedTeams.map(team => (
            <div
              key={team.id}
              className="flex items-center gap-1.5 bg-lime/20 border border-lime/40 rounded-lg pl-2 pr-1 py-1"
            >
              <span className="text-sm leading-none">{team.flag ?? '🏳️'}</span>
              <span className="text-xs font-medium text-pitch">{team.name}</span>
              <button
                onClick={() => onRemoveTeam(participant.id, team.id)}
                className="text-mid hover:text-pitch transition-colors ml-0.5 text-xs leading-none"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main ManualDraw ───────────────────────────────────────────────────────────

export function ManualDraw({
  sweepstakeId,
  participants,
  teams,
  initialAssignments,
  drawCompletedAt,
}: Props) {
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(!!drawCompletedAt && initialAssignments.length > 0)

  // Map: participant_id → Team[]
  const buildMap = () => {
    const map = new Map<string, Team[]>()
    participants.forEach(p => map.set(p.id, []))
    initialAssignments.forEach(a => {
      const team = teams.find(t => t.id === a.team_id)
      if (team) map.get(a.participant_id)?.push(team)
    })
    return map
  }

  const [assignments, setAssignments] = useState<Map<string, Team[]>>(buildMap)
  const [activeTeam, setActiveTeam] = useState<Team | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  // Teams not yet assigned to anyone
  const assignedTeamIds = new Set<number>()
  assignments.forEach(teamList => teamList.forEach(t => assignedTeamIds.add(t.id)))
  const poolTeams = teams.filter(t => !assignedTeamIds.has(t.id))

  function handleDragStart(event: DragStartEvent) {
    const { data } = event.active
    if (data.current?.type === 'team') {
      setActiveTeam(data.current.team as Team)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTeam(null)
    const { active, over } = event
    if (!over) return

    const teamData = active.data.current?.team as Team | undefined
    if (!teamData) return

    const overData = over.data.current
    if (!overData || overData.type !== 'participant') return

    const targetParticipantId = overData.participantId as string

    setAssignments(prev => {
      const next = new Map(prev)

      // Remove team from any current assignment
      next.forEach((teamList, pid) => {
        next.set(pid, teamList.filter(t => t.id !== teamData.id))
      })

      // Add to target
      const current = next.get(targetParticipantId) ?? []
      next.set(targetParticipantId, [...current, teamData])

      return next
    })

    setSaved(false)
  }

  function handleRemoveTeam(participantId: string, teamId: number) {
    setAssignments(prev => {
      const next = new Map(prev)
      next.set(participantId, (next.get(participantId) ?? []).filter(t => t.id !== teamId))
      return next
    })
    setSaved(false)
  }

  function handleSave() {
    setError('')
    startTransition(async () => {
      try {
        // Delete existing
        const { error: delErr } = await supabase
          .from('assignments')
          .delete()
          .eq('sweepstake_id', sweepstakeId)
        if (delErr) throw delErr

        // Insert rows
        const rows: { sweepstake_id: string; participant_id: string; team_id: number; team_name: string; team_flag: string | null }[] = []
        assignments.forEach((teamList, participantId) => {
          teamList.forEach(team => {
            rows.push({
              sweepstake_id: sweepstakeId,
              participant_id: participantId,
              team_id: team.id,
              team_name: team.name,
              team_flag: team.flag,
            })
          })
        })

        if (rows.length > 0) {
          const { error: insertErr } = await supabase.from('assignments').insert(rows)
          if (insertErr) throw insertErr
        }

        // Mark draw complete
        const { error: updateErr } = await supabase
          .from('sweepstakes')
          .update({ draw_completed_at: new Date().toISOString(), status: 'active' })
          .eq('id', sweepstakeId)
        if (updateErr) throw updateErr

        setSaved(true)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Save failed.')
      }
    })
  }

  if (participants.length === 0) {
    return (
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-10 text-center">
          <div className="text-4xl mb-3">👥</div>
          <h2 className="font-heading font-bold text-pitch text-lg mb-2">No participants yet</h2>
          <p className="text-mid text-sm">Add participants on the Participants tab first.</p>
        </div>
      </div>
    )
  }

  const totalAssigned = Array.from(assignments.values()).reduce((s, t) => s + t.length, 0)

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-pitch text-xl tracking-tight">Manual draw</h2>
            <p className="text-mid text-sm mt-0.5">
              Drag teams from the pool onto each participant.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs text-grass font-medium">✓ Saved</span>
            )}
            <button
              onClick={handleSave}
              disabled={isPending || totalAssigned === 0}
              className="bg-lime text-pitch text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Saving…' : 'Save assignments'}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
          {/* Participant drop zones */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-mid uppercase tracking-wider mb-3">
              Participants ({participants.length})
            </p>
            {participants.map(p => (
              <ParticipantSlot
                key={p.id}
                participant={p}
                assignedTeams={assignments.get(p.id) ?? []}
                onRemoveTeam={handleRemoveTeam}
              />
            ))}
          </div>

          {/* Teams pool */}
          <div className="lg:sticky lg:top-6 self-start">
            <div className="bg-white rounded-xl border border-[#E5EDEA] p-4">
              <p className="text-xs font-medium text-mid uppercase tracking-wider mb-3">
                Unassigned teams ({poolTeams.length})
              </p>
              {poolTeams.length === 0 ? (
                <p className="text-mid text-xs italic text-center py-4">All teams assigned</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {poolTeams.map(team => (
                    <DraggableTeamChip key={team.id} team={team} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeTeam && <TeamChip team={activeTeam} isDragging />}
      </DragOverlay>
    </DndContext>
  )
}
