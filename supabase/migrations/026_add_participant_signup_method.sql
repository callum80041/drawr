-- Add signup_method to track how participants signed up
-- Values: 'name' (name only), 'email' (name + email), 'google', 'twitter'

ALTER TABLE participants ADD COLUMN signup_method TEXT DEFAULT 'email';
ALTER TABLE waitlist ADD COLUMN signup_method TEXT DEFAULT 'email';

-- Create indexes on signup_method for faster queries in admin
CREATE INDEX idx_participants_signup_method ON participants(signup_method);
CREATE INDEX idx_waitlist_signup_method ON waitlist(signup_method);

-- Create indexes on created_at for time-series queries
CREATE INDEX idx_participants_created_at ON participants(created_at);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at);

-- Backfill existing participants: default to 'email' if email present, else 'name'
UPDATE participants SET signup_method = CASE WHEN email IS NOT NULL THEN 'email' ELSE 'name' END;
UPDATE waitlist SET signup_method = CASE WHEN email IS NOT NULL THEN 'email' ELSE 'name' END;
