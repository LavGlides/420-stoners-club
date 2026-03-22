-- Add sizes column to products table
-- Run this in Supabase SQL Editor

ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes TEXT[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN products.sizes IS 'Available product sizes (e.g., ["XS", "S", "M", "L", "XL"])';

-- Create index for better performance on size queries
CREATE INDEX IF NOT EXISTS idx_products_sizes ON products USING GIN (sizes);