-- Create materialized view for total sales per product
-- Run this in Supabase SQL Editor

CREATE MATERIALIZED VIEW product_total_sales AS
SELECT
  p.id,
  p.name,
  -- Extract qty and cast to numeric for summation
  COALESCE(SUM((oi->>'qty')::numeric), 0) as total_sales
FROM products p
LEFT JOIN orders o ON true
-- Expand the items array
LEFT JOIN jsonb_array_elements(o.items) oi ON (oi->>'id') = p.id::text
GROUP BY p.id, p.name;

-- Standard maintenance commands remain the same
CREATE UNIQUE INDEX idx_product_total_sales_id ON product_total_sales(id);

CREATE OR REPLACE FUNCTION refresh_product_total_sales()
RETURNS void AS $$
BEGIN
  -- CONCURRENTLY requires a UNIQUE INDEX to work
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_total_sales;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled refresh (run daily at 2 AM)
-- Note: This requires pg_cron extension, which may need to be enabled in Supabase
-- SELECT cron.schedule('refresh-product-sales', '0 2 * * *', 'SELECT refresh_product_total_sales();');