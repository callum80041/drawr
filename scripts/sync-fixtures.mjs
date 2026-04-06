/**
 * Standalone fixture sync script.
 * Run from the project root: node scripts/sync-fixtures.mjs
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// ── Load .env.local ────────────────────────────────────────────────────────
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    })
)

const SUPABASE_URL     = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
const API_KEY          = env.API_FOOTBALL_KEY
const LEAGUE_ID        = 1
const SEASON           = 2026
const TOURNAMENT_ID    = 1

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !API_KEY) {
  console.error('Missing env vars — check .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// ── Helpers ────────────────────────────────────────────────────────────────
const TEAM_NAME_MAP = {
  'Korea Republic': 'South Korea',
  'United States':  'USA',
  'IR Iran':        'Iran',
  'Czechia':        'Czech Republic',
  'Türkiye':        'Turkey',
}
const normalise = name => TEAM_NAME_MAP[name] ?? name

async function apiFetch(path) {
  const url = `https://v3.football.api-sports.io${path}`
  console.log(`  → GET ${url}`)
  const res = await fetch(url, { headers: { 'x-apisports-key': API_KEY } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ── Main ───────────────────────────────────────────────────────────────────
console.log('playdrawr fixture sync\n')

// 0. Find correct league ID
console.log('Searching for FIFA World Cup 2026 league…')
const leagueRes = await apiFetch('/leagues?name=World+Cup&type=Cup')
const wc2026 = leagueRes.response.find(l =>
  l.seasons?.some(s => s.year === 2026)
)
if (!wc2026) {
  console.log('No 2026 World Cup found — listing all World Cup seasons available:')
  for (const l of leagueRes.response) {
    const seasons = l.seasons?.map(s => s.year).join(', ')
    console.log(`  ID ${l.league.id}: ${l.league.name} (${l.country?.name}) — seasons: ${seasons}`)
  }
  process.exit(0)
}
const foundLeagueId = wc2026.league.id
const foundSeason   = wc2026.seasons.find(s => s.year === 2026).year
console.log(`  ✓ Found: ID ${foundLeagueId}, season ${foundSeason} — ${wc2026.league.name}\n`)

// 1. Teams
console.log('Fetching teams…')
const teamsRes = await apiFetch(`/teams?league=${foundLeagueId}&season=${foundSeason}`)
console.log(`  ${teamsRes.results} teams returned from API`)

const { data: existingTeams } = await supabase
  .from('teams').select('id, name').eq('tournament_id', TOURNAMENT_ID)

const nameToId = Object.fromEntries(existingTeams.map(t => [t.name.toLowerCase(), t.id]))
let teamsMatched = 0

for (const { team } of teamsRes.response) {
  const normName = normalise(team.name)
  const internalId = nameToId[normName.toLowerCase()]
  if (!internalId) {
    console.warn(`  ⚠ No match for API team: "${team.name}" (normalised: "${normName}")`)
    continue
  }
  await supabase.from('teams').update({
    api_football_id: team.id,
    logo_url: team.logo,
  }).eq('id', internalId)
  teamsMatched++
}
console.log(`  ✓ ${teamsMatched} teams updated with API IDs + logos\n`)

// 2. Fixtures
console.log('Fetching fixtures…')
const fixturesRes = await apiFetch(`/fixtures?league=${foundLeagueId}&season=${foundSeason}`)
console.log(`  ${fixturesRes.results} fixtures returned from API`)

// Rebuild api_football_id → internal id map after team updates
const { data: teamsWithApiId } = await supabase
  .from('teams').select('id, api_football_id').eq('tournament_id', TOURNAMENT_ID)

const apiIdToInternal = Object.fromEntries(
  teamsWithApiId.filter(t => t.api_football_id).map(t => [t.api_football_id, t.id])
)

const matchUpserts = fixturesRes.response.map(f => ({
  id:             f.fixture.id,
  tournament_id:  TOURNAMENT_ID,
  home_team_id:   apiIdToInternal[f.teams.home.id] ?? null,
  home_team_name: normalise(f.teams.home.name),
  away_team_id:   apiIdToInternal[f.teams.away.id] ?? null,
  away_team_name: normalise(f.teams.away.name),
  home_score:     f.goals.home,
  away_score:     f.goals.away,
  status:         f.fixture.status.short,
  round:          f.league.round,
  kickoff:        f.fixture.date,
  venue:          f.fixture.venue?.name ?? null,
  venue_city:     f.fixture.venue?.city ?? null,
  updated_at:     new Date().toISOString(),
}))

const { error } = await supabase.from('matches').upsert(matchUpserts, { onConflict: 'id' })
if (error) { console.error('Upsert error:', error.message); process.exit(1) }

// Log to sync_log
await supabase.from('sync_log').insert({
  sync_type: 'manual',
  tournament_id: TOURNAMENT_ID,
  api_calls_used: 2,
  matches_updated: matchUpserts.length,
  status: 'success',
})

console.log(`  ✓ ${matchUpserts.length} fixtures upserted\n`)
console.log('Done ✓')
