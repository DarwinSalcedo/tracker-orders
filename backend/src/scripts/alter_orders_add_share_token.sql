-- Add share_token column for public shareable links
ALTER TABLE orders ADD COLUMN IF NOT EXISTS share_token VARCHAR(32) UNIQUE;

-- Generate tokens for existing orders (using random hex)
UPDATE orders SET share_token = md5(random()::text || clock_timestamp()::text) WHERE share_token IS NULL;
