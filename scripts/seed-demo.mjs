/**
 * Seeds a demo organiser account + sweepstake with 48 participants + completed draw.
 * Run: node scripts/seed-demo.mjs
 *
 * Creates (or reuses):
 *   - Auth user: demo@playdrawr.co.uk / DemoDrawr2026!
 *   - Organiser row: "Demo Account"
 *   - Sweepstake: "World Cup 2026 Office Sweepstake" (share_token: demo2026)
 *   - 48 participants (the full WC2026 draw)
 *   - Random team assignments for all 48
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// ── Env ────────────────────────────────────────────────────────────────────────
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEMO_EMAIL    = 'demo@playdrawr.co.uk'
const DEMO_PASSWORD = 'DemoDrawr2026!'
const SHARE_TOKEN   = 'demo2026'

// ── 48 participants ────────────────────────────────────────────────────────────
const PARTICIPANTS = [
  'Callum M.',        'Darcy Thompson',   'Ralph J.',         'Leo Simmons',
  'Megan Clarke',     'Willow B.',        'Oliver Richards',  'Joe W.',
  'Leanne Fox',       'Kieran H.',        'Jamie Brooks',     'Amanda P.',
  'Katie Davies',     'John R.',          'Ellen Walsh',      'Eddie O\'Brien',
  'Kevin L.',         'Kim Shaw',         'Daniel K.',        'Matthew Griffiths',
  'Lee C.',           'Elaine Burton',    'Mick N.',          'Debbie Price',
  'Robert B.',        'Ashley Cole',      'Jordan H.',        'Victoria Stone',
  'Harry F.',         'Louie Ward',       'Simon G.',         'Nick Cooper',
  'Dan M.',           'Richard Palmer',   'Steve J.',         'Nicky Evans',
  'Lucy R.',          'Charlotte Webb',   'Amanda Fletcher',  'Tom S.',
  'Jake Murray',      'Luke B.',          'Sarah Allen',      'Mike D.',
  'Chris Scott',      'Paul Y.',          'Emma Lawson',      'Rachel G.',
]

// ── Fisher-Yates shuffle ───────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Main ───────────────────────────────────────────────────────────────────────
console.log('playdrawr demo seed\n')

// 1. Create or find demo auth user
console.log('Setting up demo auth user…')
const { data: listData } = await supabase.auth.admin.listUsers()
let demoUser = listData?.users?.find(u => u.email === DEMO_EMAIL)

if (demoUser) {
  console.log(`  ✓ Demo user already exists (${demoUser.id})`)
} else {
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
  })
  if (createErr) { console.error('  ✗ Failed to create user:', createErr.message); process.exit(1) }
  demoUser = created.user
  console.log(`  ✓ Created demo user (${demoUser.id})`)
}

// 2. Find or create organiser row
console.log('Setting up organiser…')
let { data: organiser } = await supabase
  .from('organisers')
  .select('id')
  .eq('user_id', demoUser.id)
  .single()

if (organiser) {
  console.log(`  ✓ Organiser exists (${organiser.id})`)
} else {
  const { data: newOrg, error: orgErr } = await supabase
    .from('organisers')
    .insert({ user_id: demoUser.id, name: 'Demo Account', email: DEMO_EMAIL })
    .select('id')
    .single()
  if (orgErr) { console.error('  ✗ Failed to create organiser:', orgErr.message); process.exit(1) }
  organiser = newOrg
  console.log(`  ✓ Created organiser (${organiser.id})`)
}

// 3. Create or replace sweepstake
console.log('Setting up sweepstake…')

// Remove old demo sweepstake if it exists (cascades to participants + assignments)
await supabase
  .from('sweepstakes')
  .delete()
  .eq('share_token', SHARE_TOKEN)

const { data: sweepstake, error: sweepErr } = await supabase
  .from('sweepstakes')
  .insert({
    organiser_id:     organiser.id,
    name:             'World Cup 2026 Office Sweepstake',
    tournament_id:    1,
    tournament_name:  'FIFA World Cup 2026',
    entry_fee:        5.00,
    status:           'active',
    plan:             'free',
    share_token:      SHARE_TOKEN,
    assignment_mode:  'random',
    prize_type:       'money',
    payout_structure: 'top_3',
  })
  .select('id')
  .single()

if (sweepErr) { console.error('  ✗ Failed to create sweepstake:', sweepErr.message); process.exit(1) }
console.log(`  ✓ Sweepstake created (${sweepstake.id})`)

// 4. Insert 48 participants
console.log('Inserting participants…')
const participantRows = PARTICIPANTS.map((name, i) => ({
  sweepstake_id: sweepstake.id,
  name,
  paid: i < 35, // first 35 have paid, rest haven't — realistic demo state
}))

const { data: insertedParticipants, error: partErr } = await supabase
  .from('participants')
  .insert(participantRows)
  .select('id, name')

if (partErr) { console.error('  ✗ Failed to insert participants:', partErr.message); process.exit(1) }
console.log(`  ✓ ${insertedParticipants.length} participants inserted`)

// 5. Fetch teams
const { data: teams } = await supabase
  .from('teams')
  .select('id, name, flag')
  .eq('tournament_id', 1)
  .order('id')

if (!teams || teams.length === 0) {
  console.error('  ✗ No teams found — run node scripts/seed-fixtures.mjs first!')
  process.exit(1)
}
console.log(`  Found ${teams.length} teams`)

// 6. Run the draw — shuffle 48 teams, 1 each for 48 participants
console.log('Running draw…')
const shuffledTeams = shuffle(teams)
const assignmentRows = insertedParticipants.map((participant, i) => ({
  sweepstake_id:  sweepstake.id,
  participant_id: participant.id,
  team_id:        shuffledTeams[i % shuffledTeams.length].id,
  team_name:      shuffledTeams[i % shuffledTeams.length].name,
  team_flag:      shuffledTeams[i % shuffledTeams.length].flag,
}))

const { error: assignErr } = await supabase.from('assignments').insert(assignmentRows)
if (assignErr) { console.error('  ✗ Failed to insert assignments:', assignErr.message); process.exit(1) }

// Mark draw complete
await supabase
  .from('sweepstakes')
  .update({ draw_completed_at: new Date().toISOString() })
  .eq('id', sweepstake.id)

console.log(`  ✓ ${assignmentRows.length} team assignments made`)

// 7. Fake match results — MD1 + MD2 of all groups played, MD3 upcoming
console.log('Seeding fake match results…')

// Realistic football scorelines (weighted toward low-scoring)
const SCORELINES = [
  [0,0],[1,0],[0,1],[1,1],[2,0],[0,2],[2,1],[1,2],[2,2],[3,0],[0,3],[3,1],[1,3],[2,3],[3,2]
]
function randScore() { return SCORELINES[Math.floor(Math.random() * SCORELINES.length)] }

// Fetch MD1 + MD2 group stage matches
const { data: groupMatches } = await supabase
  .from('matches')
  .select('id, round, home_team_id, away_team_id')
  .eq('tournament_id', 1)
  .like('round', 'Group%')
  .or('round.like.%- 1,round.like.%- 2')

if (groupMatches && groupMatches.length > 0) {
  const matchUpdates = groupMatches.map(m => {
    const [h, a] = randScore()
    return { id: m.id, home_score: h, away_score: a, status: 'FT' }
  })

  for (const upd of matchUpdates) {
    await supabase.from('matches').update({
      home_score: upd.home_score,
      away_score: upd.away_score,
      status: upd.status,
    }).eq('id', upd.id)
  }
  console.log(`  ✓ ${matchUpdates.length} matches marked FT with random scores`)

  // 8. Calculate + insert participant scores
  console.log('Calculating leaderboard scores…')

  // Build team results map: team_id → { pts, gf, ga }
  const teamResults = {}
  for (const m of groupMatches) {
    const [h, a] = matchUpdates.find(u => u.id === m.id)
      ? [matchUpdates.find(u => u.id === m.id).home_score, matchUpdates.find(u => u.id === m.id).away_score]
      : [0, 0]

    if (!teamResults[m.home_team_id]) teamResults[m.home_team_id] = { pts: 0, gf: 0, ga: 0 }
    if (!teamResults[m.away_team_id]) teamResults[m.away_team_id] = { pts: 0, gf: 0, ga: 0 }

    teamResults[m.home_team_id].gf += h
    teamResults[m.home_team_id].ga += a
    teamResults[m.away_team_id].gf += a
    teamResults[m.away_team_id].ga += h

    if (h > a) {
      teamResults[m.home_team_id].pts += 3
    } else if (h < a) {
      teamResults[m.away_team_id].pts += 3
    } else {
      teamResults[m.home_team_id].pts += 1
      teamResults[m.away_team_id].pts += 1
    }
  }

  // Calculate each participant's total points from their assigned team(s)
  const participantPoints = insertedParticipants.map((p, i) => {
    const assignment = assignmentRows[i]
    const result = teamResults[assignment.team_id] ?? { pts: 0 }
    return { participantId: p.id, points: result.pts }
  })

  // Sort to assign ranks
  participantPoints.sort((a, b) => b.points - a.points)
  let rank = 1
  for (let i = 0; i < participantPoints.length; i++) {
    if (i > 0 && participantPoints[i].points < participantPoints[i-1].points) rank = i + 1
    participantPoints[i].rank = rank
  }

  const scoreRows = participantPoints.map(p => ({
    sweepstake_id:  sweepstake.id,
    participant_id: p.participantId,
    points:         p.points,
    rank:           p.rank,
  }))

  const { error: scoreErr } = await supabase.from('scores').upsert(scoreRows, { onConflict: 'sweepstake_id,participant_id' })
  if (scoreErr) console.warn('  ⚠ Scores upsert:', scoreErr.message)
  else console.log(`  ✓ ${scoreRows.length} participant scores calculated`)
} else {
  console.log('  ⚠ No group stage matches found — run seed-fixtures.mjs first')
}

console.log('\n──────────────────────────────────────────')
console.log('Demo seeded successfully!\n')
console.log(`  Login:       ${DEMO_EMAIL}`)
console.log(`  Password:    ${DEMO_PASSWORD}`)
console.log(`  Share link:  /s/${SHARE_TOKEN}`)
console.log(`  Dashboard:   /dashboard/${sweepstake.id}/draw`)
console.log('──────────────────────────────────────────')
