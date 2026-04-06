-- ============================================================
-- WC2026 Fixtures & Teams Correction
-- Source: Sky Sports / ESPN (Apr 2026)
-- Replaces placeholder data with real qualified teams & fixtures
-- ============================================================

-- Add venue_city column if not already present
ALTER TABLE matches ADD COLUMN IF NOT EXISTS venue_city TEXT;

-- ── 1. UPDATE TEAMS ──────────────────────────────────────────
-- Only the 13 teams that changed (keeping same IDs to preserve assignment rows)

UPDATE teams SET name = 'Sweden',              flag = '🇸🇪' WHERE id = 21; -- was Denmark
UPDATE teams SET name = 'Cape Verde',          flag = '🇨🇻' WHERE id = 22; -- was Poland
UPDATE teams SET name = 'Bosnia & Herzegovina',flag = '🇧🇦' WHERE id = 23; -- was Serbia
UPDATE teams SET name = 'Paraguay',            flag = '🇵🇾' WHERE id = 26; -- was Peru
UPDATE teams SET name = 'DR Congo',            flag = '🇨🇩' WHERE id = 27; -- was Chile
UPDATE teams SET name = 'Ivory Coast',         flag = '🇨🇮' WHERE id = 31; -- was Cameroon
UPDATE teams SET name = 'Iraq',                flag = '🇮🇶' WHERE id = 32; -- was Nigeria
UPDATE teams SET name = 'Jordan',              flag = '🇯🇴' WHERE id = 38; -- was Ukraine
UPDATE teams SET name = 'Haiti',               flag = '🇭🇹' WHERE id = 39; -- was Hungary
UPDATE teams SET name = 'South Africa',        flag = '🇿🇦' WHERE id = 41; -- was Romania
UPDATE teams SET name = 'Curacao',             flag = '🇨🇼' WHERE id = 43; -- was Slovakia
UPDATE teams SET name = 'Norway',              flag = '🇳🇴' WHERE id = 44; -- was Wales
UPDATE teams SET name = 'Uzbekistan',          flag = '🇺🇿' WHERE id = 47; -- was Costa Rica

-- Fix Turkey name (official FIFA name is Türkiye but keep as Turkey for display)
UPDATE teams SET name = 'Turkey' WHERE id = 37 AND name = 'Turkey';

-- ── 2. FIX DEMO SWEEPSTAKE ASSIGNMENTS ───────────────────────
-- Sync team_name and team_flag in assignments to match the updated teams table

UPDATE assignments a
SET team_name = t.name,
    team_flag = t.flag
FROM teams t
JOIN sweepstakes s ON s.id = a.sweepstake_id
WHERE a.team_id = t.id
  AND s.share_token = 'demo2026';

-- ── 3. REPLACE ALL MATCHES ───────────────────────────────────

DELETE FROM matches WHERE tournament_id = 1;

-- All times stored as UTC. Sky Sports shows BST (UTC+1), converted here.
-- Group stage: 72 matches
-- Knockout: 32 matches (73-104)

INSERT INTO matches (id, tournament_id, home_team_id, home_team_name, away_team_id, away_team_name, status, round, kickoff, venue_city) VALUES

-- ── GROUP A: Mexico · South Africa · South Korea · Czech Republic ──
(1,  1, 12, 'Mexico',       41, 'South Africa',  'NS', 'Group A - 1', '2026-06-11 19:00:00+00', 'Mexico City'),
(2,  1, 16, 'South Korea',  42, 'Czech Republic', 'NS', 'Group A - 1', '2026-06-12 02:00:00+00', 'Zapopan'),
(3,  1, 42, 'Czech Republic',41,'South Africa',  'NS', 'Group A - 2', '2026-06-18 16:00:00+00', 'Atlanta'),
(4,  1, 12, 'Mexico',       16, 'South Korea',   'NS', 'Group A - 2', '2026-06-19 01:00:00+00', 'Mexico City'),
(5,  1, 41, 'South Africa', 16, 'South Korea',   'NS', 'Group A - 3', '2026-06-25 01:00:00+00', 'Guadalupe'),
(6,  1, 42, 'Czech Republic',12,'Mexico',         'NS', 'Group A - 3', '2026-06-25 01:00:00+00', 'Mexico City'),

-- ── GROUP B: USA · Paraguay · Turkey · Australia ──────────────
(7,  1, 11, 'USA',          26, 'Paraguay',      'NS', 'Group B - 1', '2026-06-13 01:00:00+00', 'Los Angeles'),
(8,  1, 17, 'Australia',    37, 'Turkey',        'NS', 'Group B - 1', '2026-06-14 04:00:00+00', 'Vancouver'),
(9,  1, 11, 'USA',          17, 'Australia',     'NS', 'Group B - 2', '2026-06-19 19:00:00+00', 'Seattle'),
(10, 1, 37, 'Turkey',       26, 'Paraguay',      'NS', 'Group B - 2', '2026-06-20 04:00:00+00', 'Santa Clara'),
(11, 1, 37, 'Turkey',       11, 'USA',           'NS', 'Group B - 3', '2026-06-26 02:00:00+00', 'Los Angeles'),
(12, 1, 26, 'Paraguay',     17, 'Australia',     'NS', 'Group B - 3', '2026-06-26 02:00:00+00', 'Santa Clara'),

-- ── GROUP C: Canada · Bosnia & Herzegovina · Qatar · Switzerland ──
(13, 1, 13, 'Canada',       23, 'Bosnia & Herzegovina','NS','Group C - 1','2026-06-12 19:00:00+00','Toronto'),
(14, 1, 30, 'Qatar',        19, 'Switzerland',   'NS', 'Group C - 1', '2026-06-13 19:00:00+00', 'Santa Clara'),
(15, 1, 19, 'Switzerland',  23, 'Bosnia & Herzegovina','NS','Group C - 2','2026-06-18 19:00:00+00','Los Angeles'),
(16, 1, 13, 'Canada',       30, 'Qatar',         'NS', 'Group C - 2', '2026-06-18 22:00:00+00', 'Vancouver'),
(17, 1, 19, 'Switzerland',  13, 'Canada',        'NS', 'Group C - 3', '2026-06-24 19:00:00+00', 'Vancouver'),
(18, 1, 23, 'Bosnia & Herzegovina',30,'Qatar',   'NS', 'Group C - 3', '2026-06-24 19:00:00+00', 'Seattle'),

-- ── GROUP D: Brazil · Morocco · Haiti · Scotland ──────────────
(19, 1,  4, 'Brazil',       14, 'Morocco',       'NS', 'Group D - 1', '2026-06-13 22:00:00+00', 'New Jersey'),
(20, 1, 39, 'Haiti',        45, 'Scotland',      'NS', 'Group D - 1', '2026-06-14 01:00:00+00', 'Foxborough'),
(21, 1, 45, 'Scotland',     14, 'Morocco',       'NS', 'Group D - 2', '2026-06-19 22:00:00+00', 'Foxborough'),
(22, 1,  4, 'Brazil',       39, 'Haiti',         'NS', 'Group D - 2', '2026-06-20 01:00:00+00', 'Philadelphia'),
(23, 1, 14, 'Morocco',      39, 'Haiti',         'NS', 'Group D - 3', '2026-06-24 22:00:00+00', 'Atlanta'),
(24, 1, 45, 'Scotland',      4, 'Brazil',        'NS', 'Group D - 3', '2026-06-24 22:00:00+00', 'Miami'),

-- ── GROUP E: Germany · Curacao · Ivory Coast · Ecuador ────────
(25, 1,  6, 'Germany',      43, 'Curacao',       'NS', 'Group E - 1', '2026-06-14 17:00:00+00', 'Houston'),
(26, 1, 31, 'Ivory Coast',  25, 'Ecuador',       'NS', 'Group E - 1', '2026-06-14 23:00:00+00', 'Philadelphia'),
(27, 1,  6, 'Germany',      31, 'Ivory Coast',   'NS', 'Group E - 2', '2026-06-20 20:00:00+00', 'Toronto'),
(28, 1, 25, 'Ecuador',      43, 'Curacao',       'NS', 'Group E - 2', '2026-06-21 00:00:00+00', 'Kansas City'),
(29, 1, 43, 'Curacao',      31, 'Ivory Coast',   'NS', 'Group E - 3', '2026-06-25 20:00:00+00', 'Philadelphia'),
(30, 1, 25, 'Ecuador',       6, 'Germany',       'NS', 'Group E - 3', '2026-06-25 20:00:00+00', 'New Jersey'),

-- ── GROUP F: Netherlands · Japan · Sweden · Tunisia ───────────
(31, 1,  8, 'Netherlands',  15, 'Japan',         'NS', 'Group F - 1', '2026-06-14 20:00:00+00', 'Arlington'),
(32, 1, 21, 'Sweden',       35, 'Tunisia',       'NS', 'Group F - 1', '2026-06-15 02:00:00+00', 'Guadalupe'),
(33, 1,  8, 'Netherlands',  21, 'Sweden',        'NS', 'Group F - 2', '2026-06-20 17:00:00+00', 'Houston'),
(34, 1, 35, 'Tunisia',      15, 'Japan',         'NS', 'Group F - 2', '2026-06-21 04:00:00+00', 'Guadalupe'),
(35, 1, 35, 'Tunisia',       8, 'Netherlands',   'NS', 'Group F - 3', '2026-06-25 23:00:00+00', 'Kansas City'),
(36, 1, 15, 'Japan',        21, 'Sweden',        'NS', 'Group F - 3', '2026-06-25 23:00:00+00', 'Arlington'),

-- ── GROUP G: Spain · Saudi Arabia · Uruguay · Cape Verde ──────
(37, 1,  5, 'Spain',        22, 'Cape Verde',    'NS', 'Group G - 1', '2026-06-15 16:00:00+00', 'Atlanta'),
(38, 1, 29, 'Saudi Arabia', 10, 'Uruguay',       'NS', 'Group G - 1', '2026-06-15 22:00:00+00', 'Miami'),
(39, 1,  5, 'Spain',        29, 'Saudi Arabia',  'NS', 'Group G - 2', '2026-06-21 16:00:00+00', 'Atlanta'),
(40, 1, 10, 'Uruguay',      22, 'Cape Verde',    'NS', 'Group G - 2', '2026-06-21 22:00:00+00', 'Miami'),
(41, 1, 22, 'Cape Verde',   29, 'Saudi Arabia',  'NS', 'Group G - 3', '2026-06-27 00:00:00+00', 'Houston'),
(42, 1, 10, 'Uruguay',       5, 'Spain',         'NS', 'Group G - 3', '2026-06-27 00:00:00+00', 'Zapopan'),

-- ── GROUP H: Belgium · Egypt · Iran · New Zealand ─────────────
(43, 1,  9, 'Belgium',      34, 'Egypt',         'NS', 'Group H - 1', '2026-06-15 19:00:00+00', 'Seattle'),
(44, 1, 28, 'Iran',         46, 'New Zealand',   'NS', 'Group H - 1', '2026-06-16 01:00:00+00', 'Los Angeles'),
(45, 1,  9, 'Belgium',      28, 'Iran',          'NS', 'Group H - 2', '2026-06-21 19:00:00+00', 'Los Angeles'),
(46, 1, 46, 'New Zealand',  34, 'Egypt',         'NS', 'Group H - 2', '2026-06-22 01:00:00+00', 'Vancouver'),
(47, 1, 46, 'New Zealand',   9, 'Belgium',       'NS', 'Group H - 3', '2026-06-27 03:00:00+00', 'Vancouver'),
(48, 1, 34, 'Egypt',        28, 'Iran',          'NS', 'Group H - 3', '2026-06-27 03:00:00+00', 'Seattle'),

-- ── GROUP I: France · Senegal · Iraq · Norway ─────────────────
(49, 1,  2, 'France',       18, 'Senegal',       'NS', 'Group I - 1', '2026-06-16 19:00:00+00', 'New Jersey'),
(50, 1, 32, 'Iraq',         44, 'Norway',        'NS', 'Group I - 1', '2026-06-16 22:00:00+00', 'Foxborough'),
(51, 1,  2, 'France',       32, 'Iraq',          'NS', 'Group I - 2', '2026-06-22 21:00:00+00', 'Philadelphia'),
(52, 1, 44, 'Norway',       18, 'Senegal',       'NS', 'Group I - 2', '2026-06-23 00:00:00+00', 'Toronto'),
(53, 1, 44, 'Norway',        2, 'France',        'NS', 'Group I - 3', '2026-06-26 19:00:00+00', 'Foxborough'),
(54, 1, 18, 'Senegal',      32, 'Iraq',          'NS', 'Group I - 3', '2026-06-26 19:00:00+00', 'Toronto'),

-- ── GROUP J: Argentina · Algeria · Austria · Jordan ───────────
(55, 1,  1, 'Argentina',    36, 'Algeria',       'NS', 'Group J - 1', '2026-06-17 01:00:00+00', 'Kansas City'),
(56, 1, 40, 'Austria',      38, 'Jordan',        'NS', 'Group J - 1', '2026-06-17 04:00:00+00', 'Santa Clara'),
(57, 1,  1, 'Argentina',    40, 'Austria',       'NS', 'Group J - 2', '2026-06-22 17:00:00+00', 'Arlington'),
(58, 1, 38, 'Jordan',       36, 'Algeria',       'NS', 'Group J - 2', '2026-06-23 03:00:00+00', 'Santa Clara'),
(59, 1, 36, 'Algeria',      40, 'Austria',       'NS', 'Group J - 3', '2026-06-28 02:00:00+00', 'Kansas City'),
(60, 1, 38, 'Jordan',        1, 'Argentina',     'NS', 'Group J - 3', '2026-06-28 02:00:00+00', 'Arlington'),

-- ── GROUP K: England · Croatia · Ghana · Panama ───────────────
(61, 1,  3, 'England',      20, 'Croatia',       'NS', 'Group K - 1', '2026-06-17 20:00:00+00', 'Arlington'),
(62, 1, 33, 'Ghana',        48, 'Panama',        'NS', 'Group K - 1', '2026-06-17 23:00:00+00', 'Toronto'),
(63, 1,  3, 'England',      33, 'Ghana',         'NS', 'Group K - 2', '2026-06-23 20:00:00+00', 'Foxborough'),
(64, 1, 48, 'Panama',       20, 'Croatia',       'NS', 'Group K - 2', '2026-06-23 23:00:00+00', 'Foxborough'),
(65, 1, 48, 'Panama',        3, 'England',       'NS', 'Group K - 3', '2026-06-27 21:00:00+00', 'New Jersey'),
(66, 1, 20, 'Croatia',      33, 'Ghana',         'NS', 'Group K - 3', '2026-06-27 21:00:00+00', 'Philadelphia'),

-- ── GROUP L: Portugal · DR Congo · Uzbekistan · Colombia ──────
(67, 1,  7, 'Portugal',     27, 'DR Congo',      'NS', 'Group L - 1', '2026-06-17 17:00:00+00', 'Houston'),
(68, 1, 47, 'Uzbekistan',   24, 'Colombia',      'NS', 'Group L - 1', '2026-06-18 02:00:00+00', 'Mexico City'),
(69, 1,  7, 'Portugal',     47, 'Uzbekistan',    'NS', 'Group L - 2', '2026-06-23 17:00:00+00', 'Houston'),
(70, 1, 24, 'Colombia',     27, 'DR Congo',      'NS', 'Group L - 2', '2026-06-24 02:00:00+00', 'Zapopan'),
(71, 1, 24, 'Colombia',      7, 'Portugal',      'NS', 'Group L - 3', '2026-06-27 23:30:00+00', 'Miami'),
(72, 1, 27, 'DR Congo',     47, 'Uzbekistan',    'NS', 'Group L - 3', '2026-06-27 23:30:00+00', 'Atlanta'),

-- ── ROUND OF 32 (matches 73-88) ───────────────────────────────
(73, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-06-28 19:00:00+00', 'Los Angeles'),
(74, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-06-29 20:30:00+00', 'Foxborough'),
(75, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-06-30 01:00:00+00', 'Guadalupe'),
(76, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-06-29 17:00:00+00', 'Houston'),
(77, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-06-30 21:00:00+00', 'New Jersey'),
(78, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-06-30 17:00:00+00', 'Arlington'),
(79, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-07-01 01:00:00+00', 'Mexico City'),
(80, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-07-01 16:00:00+00', 'Atlanta'),
(81, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-07-02 00:00:00+00', 'Santa Clara'),
(82, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-07-01 20:00:00+00', 'Seattle'),
(83, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-07-02 23:00:00+00', 'Toronto'),
(84, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-07-02 19:00:00+00', 'Los Angeles'),
(85, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-07-03 03:00:00+00', 'Vancouver'),
(86, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-07-03 22:00:00+00', 'Miami'),
(87, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-07-04 01:30:00+00', 'Kansas City'),
(88, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 32', '2026-07-03 18:00:00+00', 'Arlington'),

-- ── ROUND OF 16 (matches 89-96) ───────────────────────────────
(89, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 16', '2026-07-04 21:00:00+00', 'Philadelphia'),
(90, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 16', '2026-07-04 17:00:00+00', 'Houston'),
(91, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 16', '2026-07-05 20:00:00+00', 'New Jersey'),
(92, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 16', '2026-07-06 00:00:00+00', 'Mexico City'),
(93, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 16', '2026-07-06 19:00:00+00', 'Arlington'),
(94, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 16', '2026-07-07 00:00:00+00', 'Seattle'),
(95, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 16', '2026-07-07 16:00:00+00', 'Atlanta'),
(96, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Round of 16', '2026-07-07 20:00:00+00', 'Vancouver'),

-- ── QUARTER-FINALS (matches 97-100) ───────────────────────────
(97, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Quarter-final','2026-07-09 20:00:00+00', 'Foxborough'),
(98, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Quarter-final','2026-07-10 19:00:00+00', 'Los Angeles'),
(99, 1, NULL,'TBD',         NULL,'TBD',          'NS', 'Quarter-final','2026-07-11 21:00:00+00', 'Miami'),
(100,1, NULL,'TBD',         NULL,'TBD',          'NS', 'Quarter-final','2026-07-12 01:00:00+00', 'Kansas City'),

-- ── SEMI-FINALS (matches 101-102) ─────────────────────────────
(101,1, NULL,'TBD',         NULL,'TBD',          'NS', 'Semi-final',  '2026-07-14 19:00:00+00', 'Arlington'),
(102,1, NULL,'TBD',         NULL,'TBD',          'NS', 'Semi-final',  '2026-07-15 19:00:00+00', 'Atlanta'),

-- ── THIRD PLACE & FINAL ───────────────────────────────────────
(103,1, NULL,'TBD',         NULL,'TBD',          'NS', 'Third place', '2026-07-18 21:00:00+00', 'Miami'),
(104,1, NULL,'TBD',         NULL,'TBD',          'NS', 'Final',       '2026-07-19 19:00:00+00', 'New Jersey');
