-- Add customer info columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);

-- Make email optional
ALTER TABLE orders ALTER COLUMN email DROP NOT NULL;
