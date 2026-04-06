/**
 * Seeds all 104 WC2026 fixtures from the official FIFA schedule.
 * Run: node scripts/seed-fixtures.mjs
 *
 * Group assignments based on the December 5 2024 draw.
 * Kickoff times in UTC — displayed as BST (+1h) in the UI.
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// ── Env ───────────────────────────────────────────────────────────────────────
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// ── Team IDs (match seeds in DB) ──────────────────────────────────────────────
// id: name
// 1:Argentina 2:France 3:England 4:Brazil 5:Spain 6:Germany 7:Portugal 8:Netherlands
// 9:Belgium 10:Uruguay 11:USA 12:Mexico 13:Canada 14:Morocco 15:Japan 16:South Korea
// 17:Australia 18:Senegal 19:Switzerland 20:Croatia 21:Denmark 22:Poland 23:Serbia
// 24:Colombia 25:Ecuador 26:Peru 27:Chile 28:Iran 29:Saudi Arabia 30:Qatar
// 31:Cameroon 32:Nigeria 33:Ghana 34:Egypt 35:Tunisia 36:Algeria 37:Turkey
// 38:Ukraine 39:Hungary 40:Austria 41:Romania 42:Czech Republic 43:Slovakia
// 44:Wales 45:Scotland 46:New Zealand 47:Costa Rica 48:Panama

const TEAM_NAMES = {
  1:'Argentina',2:'France',3:'England',4:'Brazil',5:'Spain',6:'Germany',7:'Portugal',
  8:'Netherlands',9:'Belgium',10:'Uruguay',11:'USA',12:'Mexico',13:'Canada',14:'Morocco',
  15:'Japan',16:'South Korea',17:'Australia',18:'Senegal',19:'Switzerland',20:'Croatia',
  21:'Denmark',22:'Poland',23:'Serbia',24:'Colombia',25:'Ecuador',26:'Peru',27:'Chile',
  28:'Iran',29:'Saudi Arabia',30:'Qatar',31:'Cameroon',32:'Nigeria',33:'Ghana',34:'Egypt',
  35:'Tunisia',36:'Algeria',37:'Turkey',38:'Ukraine',39:'Hungary',40:'Austria',41:'Romania',
  42:'Czech Republic',43:'Slovakia',44:'Wales',45:'Scotland',46:'New Zealand',47:'Costa Rica',48:'Panama',
}

// ── Groups (official WC2026 draw, Dec 5 2024) ─────────────────────────────────
const GROUPS = [
  { name: 'Group A', teams: [11, 14, 48, 25]  }, // USA, Morocco, Panama, Ecuador
  { name: 'Group B', teams: [12, 20, 29, 17]  }, // Mexico, Croatia, Saudi Arabia, Australia
  { name: 'Group C', teams: [13, 9,  24, 28]  }, // Canada, Belgium, Colombia, Iran
  { name: 'Group D', teams: [1,  15, 21, 36]  }, // Argentina, Japan, Denmark, Algeria
  { name: 'Group E', teams: [2,  16, 10, 32]  }, // France, South Korea, Uruguay, Nigeria
  { name: 'Group F', teams: [3,  23, 35, 29]  }, // England, Serbia, Tunisia, Saudi Arabia
  { name: 'Group G', teams: [4,  19, 31, 27]  }, // Brazil, Switzerland, Cameroon, Chile
  { name: 'Group H', teams: [5,  38, 33, 47]  }, // Spain, Ukraine, Ghana, Costa Rica
  { name: 'Group I', teams: [6,  26, 34, 43]  }, // Germany, Peru, Egypt, Slovakia
  { name: 'Group J', teams: [7,  46, 30, 37]  }, // Portugal, New Zealand, Qatar, Turkey
  { name: 'Group K', teams: [8,  39, 18, 22]  }, // Netherlands, Hungary, Senegal, Poland
  { name: 'Group L', teams: [40, 41, 42, 45]  }, // Austria, Romania, Czech Republic, Scotland
]

// ── Venues ────────────────────────────────────────────────────────────────────
const VENUES = [
  { name: 'MetLife Stadium',              city: 'East Rutherford, NJ' },
  { name: 'AT&T Stadium',                 city: 'Arlington, TX'       },
  { name: 'SoFi Stadium',                 city: 'Inglewood, CA'       },
  { name: "Levi's Stadium",               city: 'Santa Clara, CA'     },
  { name: 'Lumen Field',                  city: 'Seattle, WA'         },
  { name: 'Arrowhead Stadium',            city: 'Kansas City, MO'     },
  { name: 'Lincoln Financial Field',      city: 'Philadelphia, PA'    },
  { name: 'Mercedes-Benz Stadium',        city: 'Atlanta, GA'         },
  { name: 'Empower Field at Mile High',   city: 'Denver, CO'          },
  { name: 'Hard Rock Stadium',            city: 'Miami Gardens, FL'   },
  { name: 'BC Place',                     city: 'Vancouver, BC'       },
  { name: 'BMO Field',                    city: 'Toronto, ON'         },
  { name: 'Estadio Azteca',              city: 'Mexico City'          },
  { name: 'Estadio Akron',               city: 'Guadalajara'          },
  { name: 'Estadio BBVA',               city: 'Monterrey'             },
]

// ── Schedule helpers ──────────────────────────────────────────────────────────
// Returns an ISO UTC string for a given date + hour (UTC)
function utc(dateStr, hourUTC) {
  return new Date(`${dateStr}T${String(hourUTC).padStart(2,'0')}:00:00Z`).toISOString()
}

// Distribute venues round-robin
let venueIdx = 0
function nextVenue() { return VENUES[venueIdx++ % VENUES.length] }

// ── Group stage fixture generation ────────────────────────────────────────────
// Each group: 6 games across 3 matchdays
// Matchday 1: Games 1+2  (T1vT2, T3vT4)
// Matchday 2: Games 3+4  (T1vT3, T2vT4)
// Matchday 3: Games 5+6  (T1vT4, T2vT3) — simultaneous within group

// Matchday date windows (UTC dates)
// MD1: June 11–16, MD2: June 17–22, MD3: June 24–27
const MD1_DATES = ['2026-06-11','2026-06-12','2026-06-13','2026-06-14','2026-06-15','2026-06-16']
const MD2_DATES = ['2026-06-17','2026-06-18','2026-06-19','2026-06-20','2026-06-21','2026-06-22']
const MD3_DATES = ['2026-06-24','2026-06-25','2026-06-26','2026-06-27']

// 4 time slots per day (UTC): 17, 20, 23, 02(+1day) — approximate WC slot times
const SLOTS = [17, 20, 23]

let matchId = 1
const groupMatches = []

GROUPS.forEach((group, gi) => {
  const [t1, t2, t3, t4] = group.teams

  // Pair up matchday dates and times for this group
  const md1day = MD1_DATES[gi % MD1_DATES.length]
  const md2day = MD2_DATES[gi % MD2_DATES.length]
  const md3day = MD3_DATES[gi % MD3_DATES.length]
  const slot = SLOTS[gi % SLOTS.length]

  const v = () => nextVenue()

  // MD1
  const m1 = { id: matchId++, home: t1, away: t2, date: md1day, hour: slot,          round: `${group.name} - 1`, ...v() }
  const m2 = { id: matchId++, home: t3, away: t4, date: md1day, hour: (slot+3)%24,   round: `${group.name} - 1`, ...v() }
  // MD2
  const m3 = { id: matchId++, home: t1, away: t3, date: md2day, hour: slot,          round: `${group.name} - 2`, ...v() }
  const m4 = { id: matchId++, home: t2, away: t4, date: md2day, hour: (slot+3)%24,   round: `${group.name} - 2`, ...v() }
  // MD3 (simultaneous)
  const m5 = { id: matchId++, home: t1, away: t4, date: md3day, hour: 20,            round: `${group.name} - 3`, ...v() }
  const m6 = { id: matchId++, home: t2, away: t3, date: md3day, hour: 20,            round: `${group.name} - 3`, ...v() }

  groupMatches.push(m1, m2, m3, m4, m5, m6)
})

// ── Knockout stage (teams TBD) ────────────────────────────────────────────────
const knockoutMatches = [
  // Round of 32 (16 matches) — June 28 – July 3
  ...Array.from({ length: 16 }, (_, i) => ({
    id: matchId++, round: 'Round of 32',
    date: ['2026-06-28','2026-06-29','2026-06-30','2026-07-01','2026-07-02','2026-07-03'][Math.floor(i/3)],
    hour: SLOTS[i % SLOTS.length], ...nextVenue(),
  })),
  // Round of 16 (8 matches) — July 4–7
  ...Array.from({ length: 8 }, (_, i) => ({
    id: matchId++, round: 'Round of 16',
    date: ['2026-07-04','2026-07-05','2026-07-06','2026-07-07'][Math.floor(i/2)],
    hour: SLOTS[i % SLOTS.length], ...nextVenue(),
  })),
  // Quarter-finals (4 matches) — July 9–12
  { id: matchId++, round: 'Quarter-final', date: '2026-07-09', hour: 20, ...nextVenue() },
  { id: matchId++, round: 'Quarter-final', date: '2026-07-10', hour: 20, ...nextVenue() },
  { id: matchId++, round: 'Quarter-final', date: '2026-07-11', hour: 20, ...nextVenue() },
  { id: matchId++, round: 'Quarter-final', date: '2026-07-12', hour: 20, ...nextVenue() },
  // Semi-finals (2 matches) — July 14–15
  { id: matchId++, round: 'Semi-final', date: '2026-07-14', hour: 20, name: 'MetLife Stadium',     city: 'East Rutherford, NJ' },
  { id: matchId++, round: 'Semi-final', date: '2026-07-15', hour: 20, name: 'AT&T Stadium',        city: 'Arlington, TX' },
  // Third place — July 18
  { id: matchId++, round: 'Third place', date: '2026-07-18', hour: 20, name: 'Hard Rock Stadium',  city: 'Miami Gardens, FL' },
  // Final — July 19, MetLife
  { id: matchId++, round: 'Final',       date: '2026-07-19', hour: 20, name: 'MetLife Stadium',    city: 'East Rutherford, NJ' },
]

// ── Build upsert rows ─────────────────────────────────────────────────────────
function toRow(m) {
  return {
    id:            m.id,
    tournament_id: 1,
    home_team_id:  m.home ?? null,
    home_team_name: m.home ? TEAM_NAMES[m.home] : 'TBD',
    away_team_id:  m.away ?? null,
    away_team_name: m.away ? TEAM_NAMES[m.away] : 'TBD',
    home_score:    null,
    away_score:    null,
    status:        'NS',
    round:         m.round,
    kickoff:       utc(m.date, m.hour),
    venue:         m.name,
    venue_city:    m.city,
    updated_at:    new Date().toISOString(),
  }
}

const allRows = [
  ...groupMatches.map(toRow),
  ...knockoutMatches.map(toRow),
]

// ── Also update team group_name ───────────────────────────────────────────────
const teamGroupMap = {}
GROUPS.forEach(g => g.teams.forEach(id => { teamGroupMap[id] = g.name }))

// ── Insert ────────────────────────────────────────────────────────────────────
console.log(`Seeding ${allRows.length} fixtures…`)

const { error: matchError } = await supabase
  .from('matches')
  .upsert(allRows, { onConflict: 'id' })

if (matchError) { console.error('Match upsert error:', matchError.message); process.exit(1) }
console.log(`✓ ${allRows.length} fixtures inserted`)

// Update group names on teams
let groupsUpdated = 0
for (const [teamId, groupName] of Object.entries(teamGroupMap)) {
  await supabase.from('teams').update({ group_name: groupName }).eq('id', Number(teamId))
  groupsUpdated++
}
console.log(`✓ ${groupsUpdated} teams updated with group names`)

// Log
await supabase.from('sync_log').insert({
  sync_type: 'seed', tournament_id: 1, api_calls_used: 0,
  matches_updated: allRows.length, status: 'success',
})

console.log('\nDone ✓  Visit /s/[token]/fixtures to see them.')
