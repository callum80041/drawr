-- 029_create_verification_tokens.sql
-- Verification tokens for email confirmation links.
-- One token per unverified sweepstake. Deleted when verified or after 48-hour cron cleanup.

CREATE TABLE IF NOT EXISTS sweepstake_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sweepstake_id UUID NOT NULL UNIQUE REFERENCES sweepstakes(id) ON DELETE CASCADE,
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX sweepstake_verification_tokens_token_idx ON sweepstake_verification_tokens (token);
CREATE INDEX sweepstake_verification_tokens_sweepstake_id_idx ON sweepstake_verification_tokens (sweepstake_id);

-- No RLS — verification links are public token-based endpoints
