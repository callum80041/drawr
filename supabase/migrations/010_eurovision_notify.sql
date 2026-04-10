CREATE TABLE IF NOT EXISTS eurovision_notify (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(email)
);
ALTER TABLE eurovision_notify ENABLE ROW LEVEL SECURITY;
-- Inserts via service client only
