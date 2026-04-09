-- ============================================================
-- 007: sweepstake cover photo + reserve waitlist
-- ============================================================

-- Feature 1: Cover photo column
ALTER TABLE sweepstakes
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Feature 2: Waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sweepstake_id UUID NOT NULL REFERENCES sweepstakes(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  notified_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS waitlist_sweepstake_id_idx ON waitlist(sweepstake_id);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Organisers can fully manage their own waitlist
CREATE POLICY "organiser_manage" ON waitlist FOR ALL
  USING (sweepstake_id IN (
    SELECT id FROM sweepstakes WHERE organiser_id IN (
      SELECT id FROM organisers WHERE user_id = auth.uid()
    )
  ));

-- NOTE: Storage bucket setup must be done in Supabase dashboard:
--   1. Go to Storage → New bucket → Name: "sweepstake-images" → Public: ON
--   2. Then run the storage policies below in the SQL editor:
--
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('sweepstake-images', 'sweepstake-images', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
-- ON CONFLICT (id) DO NOTHING;
--
-- CREATE POLICY "public_read" ON storage.objects FOR SELECT TO public
--   USING (bucket_id = 'sweepstake-images');
--
-- CREATE POLICY "auth_upload" ON storage.objects FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'sweepstake-images');
--
-- CREATE POLICY "auth_update" ON storage.objects FOR UPDATE TO authenticated
--   USING (bucket_id = 'sweepstake-images');
--
-- CREATE POLICY "auth_delete" ON storage.objects FOR DELETE TO authenticated
--   USING (bucket_id = 'sweepstake-images');
