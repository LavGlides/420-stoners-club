-- Create banner_settings table
-- Run this in Supabase SQL Editor

CREATE TABLE banner_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  heading TEXT NOT NULL DEFAULT 'Elevated. Always.',
  subtitle TEXT NOT NULL DEFAULT 'Premium streetwear for the culture. Limited runs, no restocks.',
  image_url TEXT NOT NULL DEFAULT '/hero.jpg',
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row
INSERT INTO banner_settings (id) VALUES (1);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_banner_settings_updated_at
    BEFORE UPDATE ON banner_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();