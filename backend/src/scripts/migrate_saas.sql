-- 1. Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed Default Company (so existing data belongs to someone)
INSERT INTO companies (id, name, plan)
VALUES (1, 'Default Logistics', 'pro')
ON CONFLICT (id) DO NOTHING;

-- 3. Update USERS table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE;

-- Set default company for existing users
UPDATE users SET company_id = 1 WHERE company_id IS NULL;

-- 4. Update ORDERS table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE;

-- Set default company for existing orders
UPDATE orders SET company_id = 1 WHERE company_id IS NULL;

-- 5. Update ORDER_STATUSES table
ALTER TABLE order_statuses 
ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE;

-- Note: System statuses usually stay global (company_id NULL), 
-- but if you want to assign them to the default company, uncomment below:
-- UPDATE order_statuses SET company_id = 1 WHERE company_id IS NULL;
