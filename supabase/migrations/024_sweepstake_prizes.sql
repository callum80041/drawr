-- Prize pots per sweepstake, one row per enabled prize category
CREATE TABLE sweepstake_prizes (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  sweepstake_id   UUID          NOT NULL REFERENCES sweepstakes(id) ON DELETE CASCADE,
  prize_type      TEXT          NOT NULL,
  amount          NUMERIC(10,2),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT sweepstake_prizes_unique UNIQUE (sweepstake_id, prize_type)
);

ALTER TABLE sweepstake_prizes ENABLE ROW LEVEL SECURITY;

-- Organisers can fully manage prizes for their own sweepstakes
CREATE POLICY "organiser_manage_prizes" ON sweepstake_prizes
  FOR ALL
  USING (
    sweepstake_id IN (
      SELECT s.id FROM sweepstakes s
      JOIN organisers o ON o.id = s.organiser_id
      WHERE o.user_id = auth.uid()
    )
  )
  WITH CHECK (
    sweepstake_id IN (
      SELECT s.id FROM sweepstakes s
      JOIN organisers o ON o.id = s.organiser_id
      WHERE o.user_id = auth.uid()
    )
  );

-- Public read — prizes are shown on participant-facing leaderboard pages
CREATE POLICY "public_read_prizes" ON sweepstake_prizes
  FOR SELECT
  USING (true);
