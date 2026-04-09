CREATE TABLE IF NOT EXISTS group_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sweepstake_id UUID NOT NULL REFERENCES sweepstakes(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  predicted_team_id INTEGER NOT NULL,
  predicted_team_name TEXT NOT NULL,
  predicted_team_flag TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(sweepstake_id, participant_id, group_name)
);

ALTER TABLE group_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_predictions" ON group_predictions FOR SELECT USING (true);
-- Writes handled via service client in API routes
