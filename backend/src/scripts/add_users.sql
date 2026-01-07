-- Create users table (updated to match init_db.sql)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Note: init_db uses 'password', this script uses 'password_hash'. Consistency is key.
    -- However, init_db.sql seems to be the main one. 
    -- If this script is run after init_db, it does nothing.
    -- If it's run standalone, it should match.
    -- Let's match init_db structure exactly to avoid confusion.
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Delivery', 'Viewer')),
    is_approved BOOLEAN DEFAULT FALSE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
