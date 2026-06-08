-- 1. Create pos_sections table
CREATE TABLE public.pos_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create pos_entries table (reused for stacks, reading, listening, building, learning, etc.)
CREATE TABLE public.pos_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_slug TEXT NOT NULL REFERENCES public.pos_sections(slug) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  url TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'shelf')) DEFAULT 'active',
  image_url TEXT,
  progress INTEGER CHECK (progress IS NULL OR (progress >= 0 AND progress <= 100)),
  metadata JSONB DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create pos_research_tracker table
CREATE TABLE public.pos_research_tracker (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status VARCHAR(30) NOT NULL CHECK (status IN ('planning', 'literature-review', 'methodology', 'experimentation', 'writing', 'submitted', 'published', 'archived')) DEFAULT 'planning',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  target_date DATE,
  related_research_id UUID REFERENCES public.research(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create pos_goals table
CREATE TABLE public.pos_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quarter VARCHAR(10) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('not-started', 'in-progress', 'completed', 'deferred')) DEFAULT 'not-started',
  target_date DATE,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create pos_achievements table
CREATE TABLE public.pos_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  icon TEXT,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Create pos_activity table
CREATE TABLE public.pos_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  activity_type VARCHAR(30) NOT NULL CHECK (activity_type IN ('reading', 'building', 'research', 'travel', 'general', 'project', 'story', 'achievement', 'goal')) DEFAULT 'general',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Initial POS Sections
INSERT INTO public.pos_sections (slug, title, is_visible) VALUES
  ('mission', 'Current Mission', true),
  ('focus', 'Current Focus', true),
  ('location', 'Current Location', true),
  ('travel', 'Travel Status', true),
  ('reading', 'Reading Shelf', true),
  ('listening', 'Listening Shelf', true),
  ('building', 'Currently Building', true),
  ('learning', 'Currently Learning', true),
  ('stack', 'Current Tech Stack', true)
ON CONFLICT (slug) DO NOTHING;

-- Create Indexes
CREATE INDEX pos_entries_section_status_idx ON public.pos_entries(section_slug, status);
CREATE INDEX pos_entries_section_order_idx ON public.pos_entries(section_slug, order_index);
CREATE INDEX pos_research_tracker_status_idx ON public.pos_research_tracker(status);
CREATE INDEX pos_research_tracker_updated_at_idx ON public.pos_research_tracker(updated_at DESC);
CREATE INDEX pos_goals_quarter_status_idx ON public.pos_goals(quarter, status);
CREATE INDEX pos_achievements_date_idx ON public.pos_achievements(date DESC);
CREATE INDEX pos_activity_timestamp_idx ON public.pos_activity(timestamp DESC);

-- Enable RLS
ALTER TABLE public.pos_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_research_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_activity ENABLE ROW LEVEL SECURITY;

-- Public Select Policies
CREATE POLICY "Public Read POS Sections" ON public.pos_sections FOR SELECT USING (true);
CREATE POLICY "Public Read POS Entries" ON public.pos_entries FOR SELECT USING (true);
CREATE POLICY "Public Read Research Tracker" ON public.pos_research_tracker FOR SELECT USING (true);
CREATE POLICY "Public Read POS Goals" ON public.pos_goals FOR SELECT USING (true);
CREATE POLICY "Public Read POS Achievements" ON public.pos_achievements FOR SELECT USING (true);
CREATE POLICY "Public Read POS Activity" ON public.pos_activity FOR SELECT USING (true);

-- Admin Write Policies
CREATE POLICY "Admin Write POS Sections" ON public.pos_sections FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Write POS Entries" ON public.pos_entries FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Write Research Tracker" ON public.pos_research_tracker FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Write POS Goals" ON public.pos_goals FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Write POS Achievements" ON public.pos_achievements FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Write POS Activity" ON public.pos_activity FOR ALL USING (public.is_admin());

-- Create Trigger for Automated Activity Generation
CREATE OR REPLACE FUNCTION public.log_pos_activity()
RETURNS trigger AS $$
DECLARE
  v_content TEXT;
  v_type VARCHAR(30);
  v_meta JSONB := '{}'::jsonb;
BEGIN
  -- Handle Stories
  IF TG_TABLE_NAME = 'stories' THEN
    IF (TG_OP = 'INSERT' AND NEW.is_published = true) OR (TG_OP = 'UPDATE' AND OLD.is_published = false AND NEW.is_published = true) THEN
      v_content := 'Published a new story: ' || NEW.title;
      v_type := 'story';
      v_meta := jsonb_build_object('slug', NEW.slug);
    ELSE
      RETURN NEW;
    END IF;

  -- Handle Research
  ELSIF TG_TABLE_NAME = 'research' THEN
    IF (TG_OP = 'INSERT' AND NEW.is_published = true) OR (TG_OP = 'UPDATE' AND OLD.is_published = false AND NEW.is_published = true) THEN
      v_content := 'Published research paper: ' || NEW.title;
      v_type := 'research';
      v_meta := jsonb_build_object('slug', NEW.slug);
    ELSE
      RETURN NEW;
    END IF;

  -- Handle Projects
  ELSIF TG_TABLE_NAME = 'projects' THEN
    IF (TG_OP = 'INSERT' AND NEW.is_published = true) OR (TG_OP = 'UPDATE' AND OLD.is_published = false AND NEW.is_published = true) THEN
      v_content := 'Launched project: ' || NEW.title;
      v_type := 'project';
      v_meta := jsonb_build_object('slug', NEW.slug);
    ELSE
      RETURN NEW;
    END IF;

  -- Handle Goals
  ELSIF TG_TABLE_NAME = 'pos_goals' THEN
    IF TG_OP = 'UPDATE' AND OLD.status != 'completed' AND NEW.status = 'completed' THEN
      v_content := 'Completed quarterly goal: ' || NEW.title;
      v_type := 'goal';
      v_meta := jsonb_build_object('quarter', NEW.quarter);
    ELSE
      RETURN NEW;
    END IF;

  -- Handle Achievements
  ELSIF TG_TABLE_NAME = 'pos_achievements' THEN
    IF TG_OP = 'INSERT' THEN
      v_content := 'Achieved milestone: ' || NEW.title;
      v_type := 'achievement';
      v_meta := jsonb_build_object('achievement_id', NEW.id);
    ELSE
      RETURN NEW;
    END IF;
  END IF;

  -- Insert the activity log
  INSERT INTO public.pos_activity (content, activity_type, timestamp, metadata)
  VALUES (v_content, v_type, now(), v_meta);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind Activity Trigger
CREATE TRIGGER trigger_story_activity
  AFTER INSERT OR UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION public.log_pos_activity();

CREATE TRIGGER trigger_research_activity
  AFTER INSERT OR UPDATE ON public.research
  FOR EACH ROW EXECUTE FUNCTION public.log_pos_activity();

CREATE TRIGGER trigger_project_activity
  AFTER INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.log_pos_activity();

CREATE TRIGGER trigger_goal_activity
  AFTER INSERT OR UPDATE ON public.pos_goals
  FOR EACH ROW EXECUTE FUNCTION public.log_pos_activity();

CREATE TRIGGER trigger_achievement_activity
  AFTER INSERT ON public.pos_achievements
  FOR EACH ROW EXECUTE FUNCTION public.log_pos_activity();
