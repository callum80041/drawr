-- ============================================================
-- Group Standings Table
-- Stores periodic snapshots of group standings from API-Football
-- ============================================================

CREATE TABLE IF NOT EXISTS standings (
  id BIGSERIAL PRIMARY KEY,
  tournament_id INT NOT NULL,
  group_name TEXT NOT NULL,  -- "Group A", "Group B", etc.
  team_id INT NOT NULL REFERENCES teams(id),
  position INT NOT NULL,     -- 1-4 (position in group)
  played INT NOT NULL,
  wins INT NOT NULL,
  draws INT NOT NULL,
  losses INT NOT NULL,
  goals_for INT NOT NULL,
  goals_against INT NOT NULL,
  goals_diff INT NOT NULL,
  points INT NOT NULL,
  form TEXT,                 -- "WWWDL" or similar
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tournament_id, group_name, team_id)
);

CREATE INDEX IF NOT EXISTS standings_tournament_idx ON standings(tournament_id);
CREATE INDEX IF NOT EXISTS standings_group_idx ON standings(tournament_id, group_name);

-- Row Level Security
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON standings FOR SELECT USING (true);
