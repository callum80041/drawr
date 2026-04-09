-- ============================================================
-- Fix group letters to match official FIFA 2026 standings
-- Source: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/standings
--
-- Migration 005 had the correct TEAMS in each group but some
-- group LETTERS were wrong. This fixes:
--   matches.round:  relabels affected groups
--   teams.group_name: sets all 48 correctly (was never set in migrations)
-- ============================================================

-- ── 1. FIX matches.round ─────────────────────────────────────
-- Use temp labels to handle the B→D, C→B, D→C three-way cycle
-- and the G↔H and K↔L swaps without collision.

-- Three-way cycle: B→D, C→B, D→C
UPDATE matches SET round = replace(round, 'Group B', 'Group B99') WHERE round LIKE 'Group B%';
UPDATE matches SET round = replace(round, 'Group C', 'Group B')   WHERE round LIKE 'Group C%';
UPDATE matches SET round = replace(round, 'Group D', 'Group C')   WHERE round LIKE 'Group D%';
UPDATE matches SET round = replace(round, 'Group B99', 'Group D') WHERE round LIKE 'Group B99%';

-- Swap G ↔ H
UPDATE matches SET round = replace(round, 'Group G', 'Group G99') WHERE round LIKE 'Group G%';
UPDATE matches SET round = replace(round, 'Group H', 'Group G')   WHERE round LIKE 'Group H%';
UPDATE matches SET round = replace(round, 'Group G99', 'Group H') WHERE round LIKE 'Group G99%';

-- Swap K ↔ L
UPDATE matches SET round = replace(round, 'Group K', 'Group K99') WHERE round LIKE 'Group K%';
UPDATE matches SET round = replace(round, 'Group L', 'Group K')   WHERE round LIKE 'Group L%';
UPDATE matches SET round = replace(round, 'Group K99', 'Group L') WHERE round LIKE 'Group K99%';


-- ── 2. SET teams.group_name (authoritative, replaces seed data) ────────────
-- Group A: Mexico (12), South Africa (41), South Korea (16), Czech Republic (42)
UPDATE teams SET group_name = 'Group A' WHERE id IN (12, 41, 16, 42);

-- Group B: Canada (13), Bosnia & Herzegovina (23), Qatar (30), Switzerland (19)
UPDATE teams SET group_name = 'Group B' WHERE id IN (13, 23, 30, 19);

-- Group C: Brazil (4), Morocco (14), Haiti (39), Scotland (45)
UPDATE teams SET group_name = 'Group C' WHERE id IN (4, 14, 39, 45);

-- Group D: USA (11), Paraguay (26), Australia (17), Turkey (37)
UPDATE teams SET group_name = 'Group D' WHERE id IN (11, 26, 17, 37);

-- Group E: Germany (6), Curacao (43), Ivory Coast (31), Ecuador (25)
UPDATE teams SET group_name = 'Group E' WHERE id IN (6, 43, 31, 25);

-- Group F: Netherlands (8), Japan (15), Sweden (21), Tunisia (35)
UPDATE teams SET group_name = 'Group F' WHERE id IN (8, 15, 21, 35);

-- Group G: Belgium (9), Egypt (34), Iran (28), New Zealand (46)
UPDATE teams SET group_name = 'Group G' WHERE id IN (9, 34, 28, 46);

-- Group H: Spain (5), Cape Verde (22), Saudi Arabia (29), Uruguay (10)
UPDATE teams SET group_name = 'Group H' WHERE id IN (5, 22, 29, 10);

-- Group I: France (2), Senegal (18), Iraq (32), Norway (44)
UPDATE teams SET group_name = 'Group I' WHERE id IN (2, 18, 32, 44);

-- Group J: Argentina (1), Algeria (36), Austria (40), Jordan (38)
UPDATE teams SET group_name = 'Group J' WHERE id IN (1, 36, 40, 38);

-- Group K: Portugal (7), DR Congo (27), Uzbekistan (47), Colombia (24)
UPDATE teams SET group_name = 'Group K' WHERE id IN (7, 27, 47, 24);

-- Group L: England (3), Croatia (20), Ghana (33), Panama (48)
UPDATE teams SET group_name = 'Group L' WHERE id IN (3, 20, 33, 48);
