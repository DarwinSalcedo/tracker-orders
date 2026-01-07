-- ==========================================
-- RESET DATABASE SCRIPT
-- WARNING: This will DELETE ALL DATA
-- ==========================================

-- 1. Drop Tables
DROP TABLE IF EXISTS order_history CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS order_statuses CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- 2. Re-create Schema (Content from init_db.sql)

-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_statuses table
CREATE TABLE IF NOT EXISTS order_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE(company_id, code)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('SuperAdmin', 'Admin', 'Delivery', 'Viewer')),
    is_approved BOOLEAN DEFAULT FALSE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    external_order_id VARCHAR(100),
    share_token VARCHAR(32) UNIQUE,
    location_lat DECIMAL(9, 6),
    location_lng DECIMAL(9, 6),
    pickup_lat DECIMAL(9, 6),
    pickup_lng DECIMAL(9, 6),
    pickup_address TEXT,
    dropoff_lat DECIMAL(9, 6),
    dropoff_lng DECIMAL(9, 6),
    dropoff_address TEXT,
    delivery_person VARCHAR(255),
    delivery_person_id UUID REFERENCES users(id),
    delivery_instructions TEXT,
    current_status_id UUID REFERENCES order_statuses(id),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_history table
CREATE TABLE IF NOT EXISTS order_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(50) REFERENCES orders(id),
    status_id UUID REFERENCES order_statuses(id),
    location_lat DECIMAL(9, 6),
    location_lng DECIMAL(9, 6),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Company
INSERT INTO companies (id, name, plan) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Logistics', 'pro') 
ON CONFLICT (id) DO NOTHING;

-- Seed Statuses for Default Company
INSERT INTO order_statuses (code, label, description, is_system, sort_order, company_id)
VALUES 
    ('created', 'Order Placed', 'Your order has been placed and is being processed.', TRUE, 10, '00000000-0000-0000-0000-000000000001'),
    ('in_transit', 'In Transit', 'Your package is on its way.', TRUE, 20, '00000000-0000-0000-0000-000000000001'),
    ('delivered', 'Delivery', 'Your package has been delivered.', TRUE, 30, '00000000-0000-0000-0000-000000000001'),
    ('completed', 'Completed', 'This order has been moved to completed.', TRUE, 40, '00000000-0000-0000-0000-000000000001')
ON CONFLICT (company_id, code) DO UPDATE SET is_system = TRUE, sort_order = EXCLUDED.sort_order;

-- Seed Super Admin User (Password: password)
INSERT INTO users (username, password, role, is_approved, company_id)
VALUES ('superadmin', crypt('password', gen_salt('bf')), 'SuperAdmin', TRUE, '00000000-0000-0000-0000-000000000001')
ON CONFLICT (username) DO NOTHING;
