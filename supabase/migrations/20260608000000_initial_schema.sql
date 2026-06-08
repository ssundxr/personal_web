-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users/Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('admin', 'member', 'guest')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Media Table (Photos)
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  blurhash TEXT,
  exif_data JSONB,
  location_id UUID, -- For Phase 6
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Stories Table
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content_mdx TEXT NOT NULL,
  cover_photo_id UUID REFERENCES public.media(id),
  date TIMESTAMPTZ NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Projects Table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_mdx TEXT,
  cover_photo_id UUID REFERENCES public.media(id),
  url TEXT,
  github_url TEXT,
  date TIMESTAMPTZ NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Research Table
CREATE TABLE public.research (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  content_mdx TEXT,
  pdf_url TEXT,
  date TIMESTAMPTZ NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Tags Table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

-- 7. ContentTags Table
CREATE TABLE public.content_tags (
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('story', 'project', 'research')),
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, tag_id)
);

-- RLS (Row Level Security) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;

-- Base Policies (Public Read)
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Public Read Stories" ON public.stories FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Research" ON public.research FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Public Read ContentTags" ON public.content_tags FOR SELECT USING (true);

-- Admin Write Policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply Admin policies across tables
CREATE POLICY "Admin All Media" ON public.media FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Stories" ON public.stories FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Projects" ON public.projects FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Research" ON public.research FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Tags" ON public.tags FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All ContentTags" ON public.content_tags FOR ALL USING (public.is_admin());
