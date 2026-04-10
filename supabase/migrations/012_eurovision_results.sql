-- 012_eurovision_results.sql
-- Stores semi-final qualification and Grand Final finishing positions
-- for each country in a Eurovision sweepstake.

CREATE TABLE IF NOT EXISTS eurovision_results (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sweepstake_id   UUID        NOT NULL REFERENCES sweepstakes(id) ON DELETE CASCADE,
  team_id         INTEGER     NOT NULL REFERENCES teams(id),
  -- Did this country reach the Grand Final?
  -- Auto-qualified (Big 5 + host) = true from the start; semi countries = true when they qualify
  qualified       BOOLEAN     NOT NULL DEFAULT false,
  -- 1–26 finishing position in Grand Final, NULL if eliminated in semi
  final_position  INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (sweepstake_id, team_id)
);

ALTER TABLE eurovision_results ENABLE ROW LEVEL SECURITY;

-- Public can read results (for leaderboard)
CREATE POLICY "Public read eurovision_results"
  ON eurovision_results FOR SELECT USING (true);
