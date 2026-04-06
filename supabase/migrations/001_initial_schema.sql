-- ============================================================
-- playdrawr — initial schema
-- ============================================================

-- Organisers
CREATE TABLE IF NOT EXISTS organisers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free','pro','club')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sweepstakes
CREATE TABLE IF NOT EXISTS sweepstakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organiser_id UUID REFERENCES organisers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tournament_id INT,
  tournament_name TEXT,
  entry_fee NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'setup' CHECK (status IN ('setup','active','complete')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free','pro','club')),
  share_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(12),'hex'),
  assignment_mode TEXT DEFAULT 'random' CHECK (assignment_mode IN ('random','auto','manual')),
  draw_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participants
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sweepstake_id UUID REFERENCES sweepstakes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team assignments
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sweepstake_id UUID REFERENCES sweepstakes(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  team_id INT NOT NULL,
  team_name TEXT NOT NULL,
  team_flag TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams (API-Football cache)
CREATE TABLE IF NOT EXISTS teams (
  id INT PRIMARY KEY,
  tournament_id INT NOT NULL,
  name TEXT NOT NULL,
  flag TEXT,
  logo_url TEXT,
  group_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches (API-Football cache)
CREATE TABLE IF NOT EXISTS matches (
  id INT PRIMARY KEY,
  tournament_id INT NOT NULL,
  home_team_id INT,
  home_team_name TEXT,
  away_team_id INT,
  away_team_name TEXT,
  home_score INT,
  away_score INT,
  status TEXT,
  round TEXT,
  kickoff TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Computed leaderboard
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sweepstake_id UUID REFERENCES sweepstakes(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  points INT DEFAULT 0,
  rank INT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sweepstake_id, participant_id)
);

-- API call log
CREATE TABLE IF NOT EXISTS sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT,
  tournament_id INT,
  api_calls_used INT DEFAULT 0,
  matches_updated INT DEFAULT 0,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hidden: Final sweepstake entries
CREATE TABLE IF NOT EXISTS final_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  final_sweepstake_id UUID REFERENCES sweepstakes(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_email TEXT,
  predicted_minute INT NOT NULL CHECK (predicted_minute BETWEEN 1 AND 121),
  paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE organisers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON organisers FOR ALL USING (user_id = auth.uid());

ALTER TABLE sweepstakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organiser_manage" ON sweepstakes FOR ALL
  USING (organiser_id IN (SELECT id FROM organisers WHERE user_id = auth.uid()));
CREATE POLICY "public_read" ON sweepstakes FOR SELECT USING (true);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organiser_manage" ON participants FOR ALL
  USING (sweepstake_id IN (
    SELECT id FROM sweepstakes WHERE organiser_id IN (
      SELECT id FROM organisers WHERE user_id = auth.uid()
    )
  ));
CREATE POLICY "public_read" ON participants FOR SELECT USING (true);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organiser_manage" ON assignments FOR ALL
  USING (sweepstake_id IN (
    SELECT id FROM sweepstakes WHERE organiser_id IN (
      SELECT id FROM organisers WHERE user_id = auth.uid()
    )
  ));
CREATE POLICY "public_read" ON assignments FOR SELECT USING (true);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON scores FOR SELECT USING (true);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON teams FOR SELECT USING (true);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON matches FOR SELECT USING (true);

ALTER TABLE final_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organiser_manage" ON final_entries FOR ALL
  USING (final_sweepstake_id IN (
    SELECT id FROM sweepstakes WHERE organiser_id IN (
      SELECT id FROM organisers WHERE user_id = auth.uid()
    )
  ));

-- ============================================================
-- Seed: Default WC2026 teams (used when API key unavailable)
-- ============================================================

INSERT INTO teams (id, tournament_id, name, flag) VALUES
  (1,  1, 'Argentina',     '🇦🇷'),
  (2,  1, 'France',        '🇫🇷'),
  (3,  1, 'England',       '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
  (4,  1, 'Brazil',        '🇧🇷'),
  (5,  1, 'Spain',         '🇪🇸'),
  (6,  1, 'Germany',       '🇩🇪'),
  (7,  1, 'Portugal',      '🇵🇹'),
  (8,  1, 'Netherlands',   '🇳🇱'),
  (9,  1, 'Belgium',       '🇧🇪'),
  (10, 1, 'Uruguay',       '🇺🇾'),
  (11, 1, 'USA',           '🇺🇸'),
  (12, 1, 'Mexico',        '🇲🇽'),
  (13, 1, 'Canada',        '🇨🇦'),
  (14, 1, 'Morocco',       '🇲🇦'),
  (15, 1, 'Japan',         '🇯🇵'),
  (16, 1, 'South Korea',   '🇰🇷'),
  (17, 1, 'Australia',     '🇦🇺'),
  (18, 1, 'Senegal',       '🇸🇳'),
  (19, 1, 'Switzerland',   '🇨🇭'),
  (20, 1, 'Croatia',       '🇭🇷'),
  (21, 1, 'Denmark',       '🇩🇰'),
  (22, 1, 'Poland',        '🇵🇱'),
  (23, 1, 'Serbia',        '🇷🇸'),
  (24, 1, 'Colombia',      '🇨🇴'),
  (25, 1, 'Ecuador',       '🇪🇨'),
  (26, 1, 'Peru',          '🇵🇪'),
  (27, 1, 'Chile',         '🇨🇱'),
  (28, 1, 'Iran',          '🇮🇷'),
  (29, 1, 'Saudi Arabia',  '🇸🇦'),
  (30, 1, 'Qatar',         '🇶🇦'),
  (31, 1, 'Cameroon',      '🇨🇲'),
  (32, 1, 'Nigeria',       '🇳🇬'),
  (33, 1, 'Ghana',         '🇬🇭'),
  (34, 1, 'Egypt',         '🇪🇬'),
  (35, 1, 'Tunisia',       '🇹🇳'),
  (36, 1, 'Algeria',       '🇩🇿'),
  (37, 1, 'Turkey',        '🇹🇷'),
  (38, 1, 'Ukraine',       '🇺🇦'),
  (39, 1, 'Hungary',       '🇭🇺'),
  (40, 1, 'Austria',       '🇦🇹'),
  (41, 1, 'Romania',       '🇷🇴'),
  (42, 1, 'Czech Republic','🇨🇿'),
  (43, 1, 'Slovakia',      '🇸🇰'),
  (44, 1, 'Wales',         '🏴󠁧󠁢󠁷󠁬󠁳󠁿'),
  (45, 1, 'Scotland',      '🏴󠁧󠁢󠁳󠁣󠁴󠁿'),
  (46, 1, 'New Zealand',   '🇳🇿'),
  (47, 1, 'Costa Rica',    '🇨🇷'),
  (48, 1, 'Panama',        '🇵🇦')
ON CONFLICT (id) DO NOTHING;
