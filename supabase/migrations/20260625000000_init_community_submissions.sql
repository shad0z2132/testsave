-- SavePoint community submissions schema
-- Run this migration in Supabase SQL Editor or via `supabase db push`.

-- Submissions table: projects submitted by the community, awaiting admin review
CREATE TABLE IF NOT EXISTS project_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dex_url TEXT NOT NULL,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  token_mint TEXT,
  image_url TEXT,
  website TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  votes_count INTEGER DEFAULT 0,
  submitter_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes table: anonymous hourly votes per submission
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES project_submissions(id) ON DELETE CASCADE,
  voter_hash TEXT NOT NULL,
  last_voted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (submission_id, voter_hash)
);

-- Migration: drop old social fields if coming from the previous form schema
ALTER TABLE project_submissions
  DROP COLUMN IF EXISTS x_url,
  DROP COLUMN IF EXISTS discord_url,
  DROP COLUMN IF EXISTS telegram_url,
  DROP COLUMN IF EXISTS genre,
  DROP COLUMN IF EXISTS submitted_by;

ALTER TABLE project_submissions
  ADD COLUMN IF NOT EXISTS dex_url TEXT,
  ADD COLUMN IF NOT EXISTS symbol TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS submitter_hash TEXT;

-- Backfill dex_url from website for legacy rows if needed
UPDATE project_submissions
  SET dex_url = COALESCE(dex_url, website)
  WHERE dex_url IS NULL;

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_submissions_status_votes
  ON project_submissions(status, votes_count DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_submitter_hash_created
  ON project_submissions(submitter_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_votes_submission_hash
  ON votes(submission_id, voter_hash);

-- Enable Row Level Security (we control access via API keys)
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads of pending submissions
DROP POLICY IF EXISTS "Allow public read of pending submissions" ON project_submissions;
CREATE POLICY "Allow public read of pending submissions"
  ON project_submissions
  FOR SELECT
  USING (status = 'pending');

-- Allow anonymous reads of votes for counting
DROP POLICY IF EXISTS "Allow public read of votes" ON votes;
CREATE POLICY "Allow public read of votes"
  ON votes
  FOR SELECT
  USING (true);

-- Allow inserts via service role only (enforced in API routes)
DROP POLICY IF EXISTS "Allow service role insert on submissions" ON project_submissions;
CREATE POLICY "Allow service role insert on submissions"
  ON project_submissions
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role upsert on votes" ON votes;
CREATE POLICY "Allow service role upsert on votes"
  ON votes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RPC to safely increment vote count on a submission
CREATE OR REPLACE FUNCTION increment_votes(row_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE project_submissions
  SET votes_count = votes_count + 1
  WHERE id = row_id
  RETURNING votes_count INTO new_count;

  RETURN new_count;
END;
$$;
