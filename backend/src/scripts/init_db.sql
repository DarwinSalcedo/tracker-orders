-- 1. Create order_statuses table
CREATE TABLE IF NOT EXISTS order_statuses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE
);

-- 2. Create orders table (Drop first to ensuring clean state)
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    location_lat DECIMAL(9, 6),
    location_lng DECIMAL(9, 6),
    pickup_lat DECIMAL(9, 6),
    pickup_lng DECIMAL(9, 6),
    dropoff_lat DECIMAL(9, 6),
    dropoff_lng DECIMAL(9, 6),
    delivery_person VARCHAR(255),
    delivery_instructions TEXT,
    current_status_id INTEGER REFERENCES order_statuses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create order_history table
CREATE TABLE IF NOT EXISTS order_history (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id),
    status_id INTEGER REFERENCES order_statuses(id),
    location_lat DECIMAL(9, 6),
    location_lng DECIMAL(9, 6),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Seed Statuses
INSERT INTO order_statuses (code, label, description, is_system)
VALUES 
    ('created', 'Order Placed', 'Your order has been placed and is being processed.', TRUE),
    ('in_transit', 'In Transit', 'Your package is on its way.', TRUE),
    ('delivered', 'Delivery', 'Your package has been delivered.', TRUE),
    ('completed', 'Completed', 'This order has been moved to completed.', TRUE)
ON CONFLICT (code) DO UPDATE SET is_system = TRUE;
