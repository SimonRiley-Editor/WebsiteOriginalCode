-- Supabase Schema for Asset Management

-- Create an enum for asset types
CREATE TYPE asset_type AS ENUM ('image', 'icon', 'video', 'other');

-- Create the assets table
CREATE TABLE assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type asset_type DEFAULT 'image'::asset_type NOT NULL,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    size_bytes BIGINT,
    width INTEGER,
    height INTEGER,
    description TEXT
);

-- Set up Row Level Security (RLS)
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to assets
CREATE POLICY "Allow public read access to assets" ON assets
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert/update/delete assets
-- (Assuming you have a way to identify admins in Supabase auth, or just allow authenticated users for now)
CREATE POLICY "Allow authenticated users to manage assets" ON assets
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Create an index on tags for faster searching
CREATE INDEX idx_assets_tags ON assets USING GIN (tags);

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assets_modtime
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
