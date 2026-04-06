-- Track when each organiser last logged in
ALTER TABLE organisers
  ADD COLUMN IF NOT EXISTS last_login_at timestamptz;
