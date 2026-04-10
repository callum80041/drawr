-- 016_email_log.sql
-- Track every transactional email sent through playdrawr so we can audit them in headcoachadmin.

CREATE TABLE IF NOT EXISTS email_log (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email    TEXT        NOT NULL,
  subject     TEXT        NOT NULL,
  template    TEXT,                           -- invite | draw-complete | draw-complete-eurovision | payment-chase | etc.
  resend_id   TEXT,                           -- Resend message ID returned on send
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX email_log_created_at_idx ON email_log (created_at DESC);
CREATE INDEX email_log_to_email_idx   ON email_log (to_email);

-- No RLS — accessed only via service role in headcoachadmin
