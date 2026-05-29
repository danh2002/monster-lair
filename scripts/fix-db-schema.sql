-- Fix events table
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS featured_image_id text,
  ADD COLUMN IF NOT EXISTS event_start_date timestamp,
  ADD COLUMN IF NOT EXISTS event_end_date timestamp,
  ADD COLUMN IF NOT EXISTS start_time text,
  ADD COLUMN IF NOT EXISTS end_time text,
  ADD COLUMN IF NOT EXISTS all_day boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS location_name text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS google_map_url text,
  ADD COLUMN IF NOT EXISTS registration_link text,
  ADD COLUMN IF NOT EXISTS max_participants integer,
  ADD COLUMN IF NOT EXISTS rewards text,
  ADD COLUMN IF NOT EXISTS organizer text,
  ADD COLUMN IF NOT EXISTS event_type text,
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS meta_seo_title text,
  ADD COLUMN IF NOT EXISTS meta_meta_description text,
  ADD COLUMN IF NOT EXISTS meta_focus_keyword text,
  ADD COLUMN IF NOT EXISTS meta_canonical_url text,
  ADD COLUMN IF NOT EXISTS meta_og_title text,
  ADD COLUMN IF NOT EXISTS meta_og_description text,
  ADD COLUMN IF NOT EXISTS meta_og_image_id text,
  ADD COLUMN IF NOT EXISTS meta_twitter_title text,
  ADD COLUMN IF NOT EXISTS meta_twitter_description text,
  ADD COLUMN IF NOT EXISTS meta_twitter_image_id text,
  ADD COLUMN IF NOT EXISTS meta_robots_index text DEFAULT 'index',
  ADD COLUMN IF NOT EXISTS meta_robots_follow text DEFAULT 'follow',
  ADD COLUMN IF NOT EXISTS meta_sitemap_include boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS meta_schema_type text;

CREATE TABLE IF NOT EXISTS events_gallery (
  _order integer NOT NULL,
  _parent_id text NOT NULL,
  id text PRIMARY KEY,
  image_id text
);

CREATE TABLE IF NOT EXISTS events_rels (
  "order" integer,
  parent_id text NOT NULL,
  path text NOT NULL,
  posts_id text
);

-- Fix media table
ALTER TABLE media
  ADD COLUMN IF NOT EXISTS caption text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS sizes_hero_url text,
  ADD COLUMN IF NOT EXISTS sizes_hero_width integer,
  ADD COLUMN IF NOT EXISTS sizes_hero_height integer,
  ADD COLUMN IF NOT EXISTS sizes_hero_mime_type text,
  ADD COLUMN IF NOT EXISTS sizes_hero_filesize integer,
  ADD COLUMN IF NOT EXISTS sizes_hero_filename text,
  ADD COLUMN IF NOT EXISTS sizes_og_url text,
  ADD COLUMN IF NOT EXISTS sizes_og_width integer,
  ADD COLUMN IF NOT EXISTS sizes_og_height integer,
  ADD COLUMN IF NOT EXISTS sizes_og_mime_type text,
  ADD COLUMN IF NOT EXISTS sizes_og_filesize integer,
  ADD COLUMN IF NOT EXISTS sizes_og_filename text;

-- Fix categories table
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS parent_id text,
  ADD COLUMN IF NOT EXISTS thumbnail_id text,
  ADD COLUMN IF NOT EXISTS meta_seo_title text,
  ADD COLUMN IF NOT EXISTS meta_meta_description text,
  ADD COLUMN IF NOT EXISTS meta_focus_keyword text,
  ADD COLUMN IF NOT EXISTS meta_og_image_id text,
  ADD COLUMN IF NOT EXISTS meta_twitter_image_id text,
  ADD COLUMN IF NOT EXISTS meta_robots_index text DEFAULT 'index',
  ADD COLUMN IF NOT EXISTS meta_robots_follow text DEFAULT 'follow',
  ADD COLUMN IF NOT EXISTS meta_sitemap_include boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS meta_schema_type text;

-- Create tags table if not exists
CREATE TABLE IF NOT EXISTS tags (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE,
  description text,
  updated_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY,
  action text,
  collection text,
  document_id text,
  document_title text,
  performed_by_id text,
  timestamp timestamp DEFAULT now(),
  changes jsonb,
  updated_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now()
);

-- Fix Payload lock relation table for newly added collections
ALTER TABLE payload_locked_documents_rels
  ADD COLUMN IF NOT EXISTS tags_id integer,
  ADD COLUMN IF NOT EXISTS audit_logs_id integer;

-- Store TipTap HTML output for posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS html_content text;
ALTER TABLE _posts_v ADD COLUMN IF NOT EXISTS version_html_content text;

-- Fix posts versions table after adding fields to posts.
-- Payload inserts into _posts_v on every save when versions/drafts are enabled.
-- Keep version_* columns in sync with posts so PATCH /api/posts/:id can write versions.
DO $$
DECLARE
  col RECORD;
BEGIN
  FOR col IN
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'posts'
      AND table_schema = 'public'
      AND column_name NOT IN ('id')
  LOOP
    BEGIN
      EXECUTE format(
        'ALTER TABLE _posts_v ADD COLUMN IF NOT EXISTS version_%I %s',
        col.column_name,
        col.data_type
      );
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END LOOP;
END $$;

ALTER TABLE _posts_v
  ADD COLUMN IF NOT EXISTS id serial PRIMARY KEY,
  ADD COLUMN IF NOT EXISTS parent_id integer,
  ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now(),
  ADD COLUMN IF NOT EXISTS latest boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS version_title text,
  ADD COLUMN IF NOT EXISTS version_slug text,
  ADD COLUMN IF NOT EXISTS version_excerpt text,
  ADD COLUMN IF NOT EXISTS version_content jsonb,
  ADD COLUMN IF NOT EXISTS version_html_content text,
  ADD COLUMN IF NOT EXISTS version_featured_image_id integer,
  ADD COLUMN IF NOT EXISTS version_category_id integer,
  ADD COLUMN IF NOT EXISTS version_author_id integer,
  ADD COLUMN IF NOT EXISTS version_allow_comments boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS version_pinned boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS version_status text DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS version__status text DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS version_published_at timestamp,
  ADD COLUMN IF NOT EXISTS version_scheduled_at timestamp,
  ADD COLUMN IF NOT EXISTS version_view_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS version_reading_time integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS version_updated_at timestamp,
  ADD COLUMN IF NOT EXISTS version_created_at timestamp,
  ADD COLUMN IF NOT EXISTS version_meta_seo_title text,
  ADD COLUMN IF NOT EXISTS version_meta_meta_description text,
  ADD COLUMN IF NOT EXISTS version_meta_focus_keyword text,
  ADD COLUMN IF NOT EXISTS version_meta_canonical_url text,
  ADD COLUMN IF NOT EXISTS version_meta_og_title text,
  ADD COLUMN IF NOT EXISTS version_meta_og_description text,
  ADD COLUMN IF NOT EXISTS version_meta_og_image_id integer,
  ADD COLUMN IF NOT EXISTS version_meta_twitter_title text,
  ADD COLUMN IF NOT EXISTS version_meta_twitter_description text,
  ADD COLUMN IF NOT EXISTS version_meta_twitter_image_id integer,
  ADD COLUMN IF NOT EXISTS version_meta_robots_index text DEFAULT 'index',
  ADD COLUMN IF NOT EXISTS version_meta_robots_follow text DEFAULT 'follow',
  ADD COLUMN IF NOT EXISTS version_meta_sitemap_include boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS version_meta_schema_type text;

-- If Payload schema push warns about deleting _posts_v.autosave, remove it manually.
-- This column is not part of the current Payload-generated versions schema.
ALTER TABLE _posts_v DROP COLUMN IF EXISTS autosave;
