-- 011_eurovision_countries.sql
-- Add sweepstake_type to sweepstakes, semi_final to teams,
-- and seed all 35 Eurovision Song Contest 2026 (Vienna) countries.

-- ── sweepstakes.sweepstake_type ─────────────────────────────────────────────
ALTER TABLE sweepstakes
  ADD COLUMN IF NOT EXISTS sweepstake_type TEXT NOT NULL DEFAULT 'worldcup';

-- ── teams.semi_final ────────────────────────────────────────────────────────
-- 1 = Semi-Final 1, 2 = Semi-Final 2, NULL = auto-qualified (Big 5 + host)
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS semi_final INTEGER;

-- ── Eurovision 2026 countries (tournament_id = 2, IDs 101–135) ──────────────
-- Auto-qualified: Austria (host), Big 5 (UK, France, Germany, Spain, Italy)
INSERT INTO teams (id, tournament_id, name, flag, semi_final) VALUES
  (101, 2, 'Austria',         '🇦🇹', NULL),
  (102, 2, 'United Kingdom',  '🇬🇧', NULL),
  (103, 2, 'France',          '🇫🇷', NULL),
  (104, 2, 'Germany',         '🇩🇪', NULL),
  (105, 2, 'Spain',           '🇪🇸', NULL),
  (106, 2, 'Italy',           '🇮🇹', NULL),
-- Semi-Final 1 (14 countries)
  (107, 2, 'Albania',         '🇦🇱', 1),
  (108, 2, 'Armenia',         '🇦🇲', 1),
  (109, 2, 'Australia',       '🇦🇺', 1),
  (110, 2, 'Azerbaijan',      '🇦🇿', 1),
  (111, 2, 'Croatia',         '🇭🇷', 1),
  (112, 2, 'Cyprus',          '🇨🇾', 1),
  (113, 2, 'Estonia',         '🇪🇪', 1),
  (114, 2, 'Greece',          '🇬🇷', 1),
  (115, 2, 'Iceland',         '🇮🇸', 1),
  (116, 2, 'Moldova',         '🇲🇩', 1),
  (117, 2, 'Norway',          '🇳🇴', 1),
  (118, 2, 'Serbia',          '🇷🇸', 1),
  (119, 2, 'Slovenia',        '🇸🇮', 1),
  (120, 2, 'Ukraine',         '🇺🇦', 1),
-- Semi-Final 2 (15 countries)
  (121, 2, 'Belgium',         '🇧🇪', 2),
  (122, 2, 'Czech Republic',  '🇨🇿', 2),
  (123, 2, 'Denmark',         '🇩🇰', 2),
  (124, 2, 'Finland',         '🇫🇮', 2),
  (125, 2, 'Georgia',         '🇬🇪', 2),
  (126, 2, 'Ireland',         '🇮🇪', 2),
  (127, 2, 'Israel',          '🇮🇱', 2),
  (128, 2, 'Latvia',          '🇱🇻', 2),
  (129, 2, 'Lithuania',       '🇱🇹', 2),
  (130, 2, 'Luxembourg',      '🇱🇺', 2),
  (131, 2, 'Malta',           '🇲🇹', 2),
  (132, 2, 'Netherlands',     '🇳🇱', 2),
  (133, 2, 'Poland',          '🇵🇱', 2),
  (134, 2, 'Portugal',        '🇵🇹', 2),
  (135, 2, 'Sweden',          '🇸🇪', 2)
ON CONFLICT (id) DO NOTHING;
