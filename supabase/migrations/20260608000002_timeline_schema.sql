-- Create timeline_events table
CREATE TABLE public.timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('education', 'research', 'certification', 'project', 'achievement', 'career', 'travel', 'personal')),
  date DATE NOT NULL,
  year INTEGER NOT NULL GENERATED ALWAYS AS (EXTRACT(YEAR FROM date)::INTEGER) STORED,
  month INTEGER NOT NULL GENERATED ALWAYS AS (EXTRACT(MONTH FROM date)::INTEGER) STORED,
  location_id UUID,
  story_id UUID REFERENCES public.stories(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  research_id UUID REFERENCES public.research(id) ON DELETE SET NULL,
  achievement_id UUID REFERENCES public.pos_achievements(id) ON DELETE SET NULL,
  certification_id UUID,
  cover_image TEXT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  importance_score INTEGER NOT NULL DEFAULT 5 CHECK (importance_score >= 1 AND importance_score <= 10),
  era TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (story_id, project_id, research_id, achievement_id)
);

-- Performance Indexes
CREATE INDEX timeline_events_date_idx ON public.timeline_events(date DESC);
CREATE INDEX timeline_events_year_month_idx ON public.timeline_events(year DESC, month DESC);
CREATE INDEX timeline_events_category_idx ON public.timeline_events(category);
CREATE INDEX timeline_events_featured_idx ON public.timeline_events(is_featured) WHERE is_featured = true;
CREATE INDEX timeline_events_importance_idx ON public.timeline_events(importance_score DESC);
CREATE INDEX timeline_events_era_idx ON public.timeline_events(era);
CREATE INDEX timeline_events_metadata_gin_idx ON public.timeline_events USING gin (metadata);

-- Enable RLS
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- Public Select Policy
CREATE POLICY "Public Read Timeline" ON public.timeline_events FOR SELECT USING (true);

-- Admin Modify Policy
CREATE POLICY "Admin Modify Timeline" ON public.timeline_events FOR ALL USING (public.is_admin());

-- Automated Sync Trigger Function
CREATE OR REPLACE FUNCTION public.sync_to_timeline()
RETURNS trigger AS $$
DECLARE
  v_title TEXT;
  v_desc TEXT;
  v_date DATE;
  v_cover TEXT := NULL;
  v_category VARCHAR(50);
BEGIN
  -- Handle Stories
  IF TG_TABLE_NAME = 'stories' THEN
    IF NEW.is_published = true AND (TG_OP = 'INSERT' OR OLD.is_published = false) THEN
      v_title := NEW.title;
      v_desc := 'Published a new journal entry under the archive.';
      v_date := NEW.date::DATE;
      v_category := 'personal';
      
      -- Fetch Cover Image if connected
      IF NEW.cover_photo_id IS NOT NULL THEN
        SELECT url INTO v_cover FROM public.media WHERE id = NEW.cover_photo_id;
      END IF;

      INSERT INTO public.timeline_events (title, description, category, date, story_id, cover_image, importance_score, era)
      VALUES (v_title, v_desc, v_category, v_date, NEW.id, v_cover, 5, 'Journal Logs')
      ON CONFLICT (story_id) DO NOTHING;
    ELSIF NEW.is_published = false AND TG_OP = 'UPDATE' THEN
      DELETE FROM public.timeline_events WHERE story_id = NEW.id;
    END IF;

  -- Handle Projects
  ELSIF TG_TABLE_NAME = 'projects' THEN
    IF NEW.is_published = true AND (TG_OP = 'INSERT' OR OLD.is_published = false) THEN
      v_title := 'Launched: ' || NEW.title;
      v_desc := NEW.description;
      v_date := NEW.date::DATE;
      v_category := 'project';
      
      IF NEW.cover_photo_id IS NOT NULL THEN
        SELECT url INTO v_cover FROM public.media WHERE id = NEW.cover_photo_id;
      END IF;

      INSERT INTO public.timeline_events (title, description, category, date, project_id, cover_image, importance_score, era)
      VALUES (v_title, v_desc, v_category, v_date, NEW.id, v_cover, 7, 'Active Building')
      ON CONFLICT (project_id) DO NOTHING;
    ELSIF NEW.is_published = false AND TG_OP = 'UPDATE' THEN
      DELETE FROM public.timeline_events WHERE project_id = NEW.id;
    END IF;

  -- Handle Research
  ELSIF TG_TABLE_NAME = 'research' THEN
    IF NEW.is_published = true AND (TG_OP = 'INSERT' OR OLD.is_published = false) THEN
      v_title := 'Published Research: ' || NEW.title;
      v_desc := NEW.abstract;
      v_date := NEW.date::DATE;
      v_category := 'research';

      INSERT INTO public.timeline_events (title, description, category, date, research_id, importance_score, era)
      VALUES (v_title, v_desc, v_category, v_date, NEW.id, NULL, 8, 'Academic Focus')
      ON CONFLICT (research_id) DO NOTHING;
    ELSIF NEW.is_published = false AND TG_OP = 'UPDATE' THEN
      DELETE FROM public.timeline_events WHERE research_id = NEW.id;
    END IF;

  -- Handle Achievements
  ELSIF TG_TABLE_NAME = 'pos_achievements' THEN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.timeline_events (title, description, category, date, achievement_id, importance_score, era)
      VALUES (NEW.title, NEW.description, 'achievement', NEW.date, NEW.id, 6, 'Milestones')
      ON CONFLICT (achievement_id) DO NOTHING;
    ELSIF TG_OP = 'UPDATE' THEN
      UPDATE public.timeline_events
      SET title = NEW.title, description = NEW.description, date = NEW.date
      WHERE achievement_id = NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind Triggers to Sync Function
CREATE TRIGGER trigger_story_timeline
  AFTER INSERT OR UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION public.sync_to_timeline();

CREATE TRIGGER trigger_research_timeline
  AFTER INSERT OR UPDATE ON public.research
  FOR EACH ROW EXECUTE FUNCTION public.sync_to_timeline();

CREATE TRIGGER trigger_project_timeline
  AFTER INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.sync_to_timeline();

CREATE TRIGGER trigger_achievement_timeline
  AFTER INSERT OR UPDATE ON public.pos_achievements
  FOR EACH ROW EXECUTE FUNCTION public.sync_to_timeline();
