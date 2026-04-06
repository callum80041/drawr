-- Teams: store API-Football's own team ID for matching
ALTER TABLE teams ADD COLUMN IF NOT EXISTS api_football_id INT;
CREATE INDEX IF NOT EXISTS teams_api_football_id_idx ON teams(api_football_id);

-- Matches: add venue info
ALTER TABLE matches ADD COLUMN IF NOT EXISTS venue TEXT;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS venue_city TEXT;

-- Sweepstakes: prize structure
ALTER TABLE sweepstakes
  ADD COLUMN IF NOT EXISTS prize_type TEXT DEFAULT 'money'
    CHECK (prize_type IN ('money', 'prizes')),
  ADD COLUMN IF NOT EXISTS payout_structure TEXT DEFAULT 'winner'
    CHECK (payout_structure IN ('winner', 'top_3'));
