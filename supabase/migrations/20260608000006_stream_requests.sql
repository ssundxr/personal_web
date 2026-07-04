-- 1. Create Stream Access Requests Table
CREATE TABLE public.stream_access_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.stream_access_requests ENABLE ROW LEVEL SECURITY;

-- 3. Define Policies
-- Allow anyone to insert a request (they will be authenticated via a hardcoded password on the frontend first)
CREATE POLICY "Anyone can insert stream requests" 
  ON public.stream_access_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to read requests (since UUIDs are unguessable, this allows the requesting user to subscribe to their own ID, and admins to read all)
CREATE POLICY "Anyone can read stream requests" 
  ON public.stream_access_requests 
  FOR SELECT 
  USING (true);

-- Allow only admins to update the status of requests
CREATE POLICY "Admin can update stream requests" 
  ON public.stream_access_requests 
  FOR UPDATE 
  USING (public.is_admin());

CREATE POLICY "Admin can delete stream requests" 
  ON public.stream_access_requests 
  FOR DELETE 
  USING (public.is_admin());

-- 4. Enable Realtime for this table
-- (This ensures clients can listen to status changes via Supabase Realtime)
BEGIN;
  -- Add table to realtime publication safely
  ALTER PUBLICATION supabase_realtime ADD TABLE public.stream_access_requests;
COMMIT;
