-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;

-- Create locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_type VARCHAR(50) NOT NULL CHECK (location_type IN ('travel', 'research', 'conference', 'education', 'career', 'personal', 'project')),
  description TEXT,
  cover_image TEXT,
  visit_date DATE,
  first_visit_date DATE,
  last_visit_date DATE,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  importance_score INTEGER NOT NULL DEFAULT 5 CHECK (importance_score >= 1 AND importance_score <= 10),
  era TEXT,
  coordinates geography(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for locations
CREATE INDEX locations_country_idx ON public.locations(country);
CREATE INDEX locations_type_idx ON public.locations(location_type);
CREATE INDEX locations_featured_idx ON public.locations(is_featured) WHERE is_featured = true;
CREATE INDEX locations_importance_idx ON public.locations(importance_score DESC);
CREATE INDEX locations_era_idx ON public.locations(era);
CREATE INDEX locations_coordinates_gix ON public.locations USING GIST (coordinates);
CREATE INDEX locations_metadata_gin_idx ON public.locations USING GIN (metadata);

-- Enable RLS for locations
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Public Select Policy
CREATE POLICY "Public Read Locations" ON public.locations FOR SELECT USING (true);

-- Admin Modify Policy
CREATE POLICY "Admin Modify Locations" ON public.locations FOR ALL USING (public.is_admin());

-- Update Existing Tables to include location_id
ALTER TABLE public.stories ADD COLUMN location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL;
ALTER TABLE public.projects ADD COLUMN location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL;
ALTER TABLE public.research ADD COLUMN location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL;

-- Update timeline_events to include foreign key for location_id
ALTER TABLE public.timeline_events ADD CONSTRAINT fk_timeline_location FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL;
