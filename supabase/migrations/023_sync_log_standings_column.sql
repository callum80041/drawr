-- Add standings_updated column to sync_log for tracking standings syncs
ALTER TABLE sync_log ADD COLUMN IF NOT EXISTS standings_updated INT DEFAULT 0;
