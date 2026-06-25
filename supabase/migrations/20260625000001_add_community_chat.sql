-- SavePoint community chat schema
-- Run this migration in Supabase SQL Editor or via `supabase db push`.

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  wallet_address TEXT,
  display_name TEXT,
  content TEXT NOT NULL CHECK (length(content) <= 500),
  reply_to UUID REFERENCES chat_messages(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at
  ON chat_messages(created_at DESC);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the public chat feed
DROP POLICY IF EXISTS "Allow public read of chat messages" ON chat_messages;
CREATE POLICY "Allow public read of chat messages"
  ON chat_messages
  FOR SELECT
  USING (true);

-- Allow anyone to post (client-side rate limiting + content length check)
DROP POLICY IF EXISTS "Allow public insert of chat messages" ON chat_messages;
CREATE POLICY "Allow public insert of chat messages"
  ON chat_messages
  FOR INSERT
  WITH CHECK (length(content) <= 500);

-- Enable realtime broadcasts for new messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE schemaname = 'public' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
  END IF;
END $$;
