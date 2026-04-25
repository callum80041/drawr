-- Phase 1: Pro flag foundation
-- Add is_pro and pro_expires_at columns to sweepstakes table

ALTER TABLE sweepstakes
ADD COLUMN IF NOT EXISTS is_pro boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS pro_expires_at timestamptz NULL;

-- Backfill existing sweepstakes: mark all as Pro if they are currently plan='pro' or plan='club'
UPDATE sweepstakes
SET is_pro = true
WHERE plan IN ('pro', 'club');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sweepstakes_is_pro ON sweepstakes(is_pro);
