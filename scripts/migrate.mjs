// BaccaAI migration: creates users, stories, story_pages in bacca_ai (D-drive cluster, port 5433).
// Run: node scripts/migrate.mjs  (DATABASE_URL from env or .env.local-style default below)
import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://bacca@127.0.0.1:5433/bacca_ai";

const DDL = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_name text NOT NULL,
  age integer NOT NULL CHECK (age BETWEEN 6 AND 10),
  subdistrict text NOT NULL,
  reading_level text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme_slug text NOT NULL,
  title text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS story_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  story_text text NOT NULL,
  image_url text,
  child_audio_transcript text,
  accuracy_score integer,
  child_imagination_input text,
  tricky_words jsonb,
  praise_message text,
  interactive_question text,
  muse_image_prompt text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_story_pages_story_id ON story_pages(story_id);
CREATE UNIQUE INDEX IF NOT EXISTS story_pages_story_id_page_number_unique ON story_pages(story_id, page_number);
ALTER TABLE stories ADD COLUMN IF NOT EXISTS completed_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_phone text;
CREATE TABLE IF NOT EXISTS app_settings (key text PRIMARY KEY, value jsonb NOT NULL);
ALTER TABLE stories ADD COLUMN IF NOT EXISTS stars integer;
`;

const client = new pg.Client({ connectionString });
try {
  await client.connect();
  await client.query(DDL);
  const { rows } = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users','stories','story_pages') ORDER BY table_name"
  );
  console.log("migrate OK, tables:", rows.map((r) => r.table_name).join(", "));
} finally {
  await client.end();
}
