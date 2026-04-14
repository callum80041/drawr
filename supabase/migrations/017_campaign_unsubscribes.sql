-- 017_campaign_unsubscribes.sql
-- Stable per-email token used to authenticate unsubscribe links in campaign emails.
-- Row exists from first send; unsubscribed_at is NULL until the recipient opts out.

CREATE TABLE IF NOT EXISTS email_campaign_tokens (
  email           TEXT        PRIMARY KEY,
  token           UUID        NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  unsubscribed_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX email_campaign_tokens_token_idx ON email_campaign_tokens (token);

-- No RLS — accessed only via service role in headcoachadmin and the unsubscribe route
