-- Run this in your Supabase SQL Editor to create the table

CREATE TABLE public.guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  element TEXT NOT NULL,
  weapon_type TEXT NOT NULL,
  rarity INTEGER NOT NULL,
  role TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so anyone can view the guides)
CREATE POLICY "Allow public read access" ON public.guides
  FOR SELECT USING (true);

-- Allow public insert/update for testing (In production, you would restrict this to authenticated admins)
CREATE POLICY "Allow public insert" ON public.guides
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON public.guides
  FOR UPDATE USING (true);
