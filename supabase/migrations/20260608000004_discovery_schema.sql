-- Phase 7: Discovery Platform Migration

-- 1. Enhancements to Existing Ecosystem Entities (Stories, Projects, Research)
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS importance_score INTEGER NOT NULL DEFAULT 5 CHECK (importance_score >= 1 AND importance_score <= 10);
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS era TEXT;

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS importance_score INTEGER NOT NULL DEFAULT 5 CHECK (importance_score >= 1 AND importance_score <= 10);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS era TEXT;

ALTER TABLE public.research ADD COLUMN IF NOT EXISTS importance_score INTEGER NOT NULL DEFAULT 5 CHECK (importance_score >= 1 AND importance_score <= 10);
ALTER TABLE public.research ADD COLUMN IF NOT EXISTS era TEXT;

-- 2. Universal Tags Taxonomy
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tags_slug_idx ON public.tags(slug);

-- 3. Photography Platform
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  timeline_event_id UUID REFERENCES public.timeline_events(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  importance_score INTEGER NOT NULL DEFAULT 5 CHECK (importance_score >= 1 AND importance_score <= 10),
  era TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS albums_collection_idx ON public.albums(collection_id);
CREATE INDEX IF NOT EXISTS albums_location_idx ON public.albums(location_id);
CREATE INDEX IF NOT EXISTS albums_timeline_idx ON public.albums(timeline_event_id);
CREATE INDEX IF NOT EXISTS albums_featured_idx ON public.albums(is_featured) WHERE is_featured = true;

CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID REFERENCES public.albums(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  timeline_event_id UUID REFERENCES public.timeline_events(id) ON DELETE SET NULL,
  exif_camera TEXT,
  exif_lens TEXT,
  exif_iso INTEGER,
  exif_aperture TEXT,
  exif_shutter TEXT,
  exif_focal_length TEXT,
  date_taken TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  importance_score INTEGER NOT NULL DEFAULT 5 CHECK (importance_score >= 1 AND importance_score <= 10),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS photos_album_idx ON public.photos(album_id);
CREATE INDEX IF NOT EXISTS photos_location_idx ON public.photos(location_id);
CREATE INDEX IF NOT EXISTS photos_timeline_idx ON public.photos(timeline_event_id);
CREATE INDEX IF NOT EXISTS photos_date_taken_idx ON public.photos(date_taken);

-- 4. Universal Junction Tables
CREATE TABLE IF NOT EXISTS public.photo_tags (
  photo_id UUID REFERENCES public.photos(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (photo_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.story_tags (
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.project_tags (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.research_tags (
  research_id UUID REFERENCES public.research(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (research_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.timeline_event_tags (
  timeline_event_id UUID REFERENCES public.timeline_events(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (timeline_event_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.location_tags (
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (location_id, tag_id)
);

-- 5. Row Level Security
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_event_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_tags ENABLE ROW LEVEL SECURITY;

-- Select Policies (Public Read)
DROP POLICY IF EXISTS "Public Read Tags" ON public.tags;
CREATE POLICY "Public Read Tags" ON public.tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Collections" ON public.collections;
CREATE POLICY "Public Read Collections" ON public.collections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Albums" ON public.albums;
CREATE POLICY "Public Read Albums" ON public.albums FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Photos" ON public.photos;
CREATE POLICY "Public Read Photos" ON public.photos FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Photo Tags" ON public.photo_tags;
CREATE POLICY "Public Read Photo Tags" ON public.photo_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Story Tags" ON public.story_tags;
CREATE POLICY "Public Read Story Tags" ON public.story_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Project Tags" ON public.project_tags;
CREATE POLICY "Public Read Project Tags" ON public.project_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Research Tags" ON public.research_tags;
CREATE POLICY "Public Read Research Tags" ON public.research_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Timeline Tags" ON public.timeline_event_tags;
CREATE POLICY "Public Read Timeline Tags" ON public.timeline_event_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Location Tags" ON public.location_tags;
CREATE POLICY "Public Read Location Tags" ON public.location_tags FOR SELECT USING (true);

-- Admin Modify Policies
DROP POLICY IF EXISTS "Admin Modify Tags" ON public.tags;
CREATE POLICY "Admin Modify Tags" ON public.tags FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Admin Modify Collections" ON public.collections;
CREATE POLICY "Admin Modify Collections" ON public.collections FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Admin Modify Albums" ON public.albums;
CREATE POLICY "Admin Modify Albums" ON public.albums FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Admin Modify Photos" ON public.photos;
CREATE POLICY "Admin Modify Photos" ON public.photos FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Admin Modify Photo Tags" ON public.photo_tags;
CREATE POLICY "Admin Modify Photo Tags" ON public.photo_tags FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Admin Modify Story Tags" ON public.story_tags;
CREATE POLICY "Admin Modify Story Tags" ON public.story_tags FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Admin Modify Project Tags" ON public.project_tags;
CREATE POLICY "Admin Modify Project Tags" ON public.project_tags FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Admin Modify Research Tags" ON public.research_tags;
CREATE POLICY "Admin Modify Research Tags" ON public.research_tags FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Admin Modify Timeline Tags" ON public.timeline_event_tags;
CREATE POLICY "Admin Modify Timeline Tags" ON public.timeline_event_tags FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Admin Modify Location Tags" ON public.location_tags;
CREATE POLICY "Admin Modify Location Tags" ON public.location_tags FOR ALL USING (public.is_admin());

