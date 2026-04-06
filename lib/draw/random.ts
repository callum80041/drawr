import type { Database } from '@/lib/supabase/types'

type Team = Database['public']['Tables']['teams']['Row']
type Participant = Database['public']['Tables']['participants']['Row']
type AssignmentInsert = Database['public']['Tables']['assignments']['Insert']

export function buildAssignments(
  teams: Pick<Team, 'id' | 'name' | 'flag'>[],
  participants: Pick<Participant, 'id' | 'sweepstake_id'>[]
): Omit<AssignmentInsert, 'id' | 'assigned_at'>[] {
  const shuffled = [...teams]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.map((team, i) => ({
    sweepstake_id: participants[0].sweepstake_id,
    participant_id: participants[i % participants.length].id,
    team_id: team.id,
    team_name: team.name,
    team_flag: team.flag ?? null,
  }))
}
