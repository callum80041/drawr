-- Pro features: custom slug, logo, and participant notifications
-- Adds columns needed for features 4, 5, and 6

ALTER TABLE sweepstakes
ADD COLUMN IF NOT EXISTS custom_slug text UNIQUE NULL,
ADD COLUMN IF NOT EXISTS logo_url text NULL;

ALTER TABLE participants
ADD COLUMN IF NOT EXISTS notify_enabled boolean NOT NULL DEFAULT true;

-- Create index for custom_slug lookups
CREATE INDEX IF NOT EXISTS idx_sweepstakes_custom_slug ON sweepstakes(custom_slug);
