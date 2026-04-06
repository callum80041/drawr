import { createServiceClient } from '@/lib/supabase/server'
import { apiFetch, WC2026_LEAGUE_ID, WC2026_SEASON, WC2026_TOURNAMENT_ID } from './client'
import { checkQuota } from './quota'

// API-Football name → our seeded name (handle known differences)
const TEAM_NAME_MAP: Record<string, string> = {
  'Korea Republic': 'South Korea',
  'United States': 'USA',
  'IR Iran': 'Iran',
  'Czechia': 'Czech Republic',
  'Türkiye': 'Turkey',
}

function normalise(name: string) {
  return TEAM_NAME_MAP[name] ?? name
}

interface ApiTeam {
  team: { id: number; name: string; logo: string }
  venue: { name: string; city: string }
}

interface ApiFixture {
  fixture: {
    id: number
    date: string
    venue: { name: string; city: string } | null
    status: { short: string }
  }
  league: { round: string }
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null }
    away: { id: number; name: string; logo: string; winner: boolean | null }
  }
  goals: { home: number | null; away: number | null }
}

export async function runDailySync(): Promise<{
  status: 'ok' | 'skipped' | 'error'
  message: string
  apiCallsUsed: number
  matchesUpdated: number
}> {
  const supabase = await createServiceClient()
  let apiCallsUsed = 0
  let matchesUpdated = 0

  try {
    if (!(await checkQuota())) {
      return { status: 'skipped', message: 'Daily API quota limit reached (90 calls)', apiCallsUsed: 0, matchesUpdated: 0 }
    }

    // ── 1. Sync teams ────────────────────────────────────────────────────────
    const teamsData = await apiFetch<ApiTeam[]>(
      `/teams?league=${WC2026_LEAGUE_ID}&season=${WC2026_SEASON}`
    )
    apiCallsUsed++

    if (teamsData.response.length > 0) {
      // Fetch all our existing teams for name-matching
      const { data: existingTeams } = await supabase
        .from('teams')
        .select('id, name')
        .eq('tournament_id', WC2026_TOURNAMENT_ID)

      const nameToId = Object.fromEntries(
        (existingTeams ?? []).map(t => [t.name.toLowerCase(), t.id])
      )

      const teamUpdates = teamsData.response.map(({ team }) => {
        const normName = normalise(team.name)
        const internalId = nameToId[normName.toLowerCase()]
        if (!internalId) return null
        return { id: internalId, api_football_id: team.id, logo_url: team.logo }
      }).filter(Boolean) as { id: number; api_football_id: number; logo_url: string }[]

      for (const update of teamUpdates) {
        await supabase.from('teams').update({
          api_football_id: update.api_football_id,
          logo_url: update.logo_url,
        }).eq('id', update.id)
      }
    }

    // ── 2. Sync fixtures ─────────────────────────────────────────────────────
    const fixturesData = await apiFetch<ApiFixture[]>(
      `/fixtures?league=${WC2026_LEAGUE_ID}&season=${WC2026_SEASON}`
    )
    apiCallsUsed++

    if (fixturesData.response.length > 0) {
      // Build api_football_id → internal team id map
      const { data: teamsWithApiId } = await supabase
        .from('teams')
        .select('id, api_football_id')
        .eq('tournament_id', WC2026_TOURNAMENT_ID)
        .not('api_football_id', 'is', null)

      const apiIdToInternal = Object.fromEntries(
        (teamsWithApiId ?? []).map(t => [t.api_football_id, t.id])
      )

      const matchUpserts = fixturesData.response.map(f => {
        const homeId = apiIdToInternal[f.teams.home.id] ?? null
        const awayId = apiIdToInternal[f.teams.away.id] ?? null

        return {
          id: f.fixture.id,
          tournament_id: WC2026_TOURNAMENT_ID,
          home_team_id: homeId,
          home_team_name: normalise(f.teams.home.name),
          away_team_id: awayId,
          away_team_name: normalise(f.teams.away.name),
          home_score: f.goals.home,
          away_score: f.goals.away,
          status: f.fixture.status.short,
          round: f.league.round,
          kickoff: f.fixture.date,
          venue: f.fixture.venue?.name ?? null,
          venue_city: f.fixture.venue?.city ?? null,
          updated_at: new Date().toISOString(),
        }
      })

      const { error: upsertError } = await supabase
        .from('matches')
        .upsert(matchUpserts, { onConflict: 'id' })

      if (upsertError) throw upsertError
      matchesUpdated = matchUpserts.length
    }

    // ── 3. Log ───────────────────────────────────────────────────────────────
    await supabase.from('sync_log').insert({
      sync_type: 'daily',
      tournament_id: WC2026_TOURNAMENT_ID,
      api_calls_used: apiCallsUsed,
      matches_updated: matchesUpdated,
      status: 'success',
    })

    return { status: 'ok', message: `Synced ${matchesUpdated} matches`, apiCallsUsed, matchesUpdated }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await supabase.from('sync_log').insert({
      sync_type: 'daily',
      tournament_id: WC2026_TOURNAMENT_ID,
      api_calls_used: apiCallsUsed,
      matches_updated: 0,
      status: 'error',
      error_message: message,
    })
    return { status: 'error', message, apiCallsUsed, matchesUpdated: 0 }
  }
}
