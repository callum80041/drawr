-- 028_add_sweepstake_verification.sql
-- Add email verification tracking to sweepstakes created via WhatsApp.
-- Unverified sweepstakes (verified_at IS NULL) are auto-deleted after 48 hours.

ALTER TABLE sweepstakes ADD COLUMN verified_at TIMESTAMPTZ;

CREATE INDEX sweepstakes_verified_at_idx ON sweepstakes (verified_at);
