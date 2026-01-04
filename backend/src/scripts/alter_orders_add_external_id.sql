-- Add external_order_id column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS external_order_id VARCHAR(100);
