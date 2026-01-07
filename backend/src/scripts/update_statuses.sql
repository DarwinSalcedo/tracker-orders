-- Add is_system column to order_statuses if not exists
ALTER TABLE order_statuses ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT FALSE;

-- Add sort_order column if not exists
ALTER TABLE order_statuses ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Ensure mandatory statuses exist with correct labels
INSERT INTO order_statuses (code, label, description, is_system, sort_order) 
VALUES 
    ('created', 'Order Placed', 'Your order has been placed and is being processed.', TRUE, 10),
    ('in_transit', 'In Transit', 'Your package is on its way.', TRUE, 20),
    ('delivered', 'Delivery', 'Your package has been delivered.', TRUE, 30),
    ('completed', 'Completed', 'This order has been moved to completed.', TRUE, 40)
ON CONFLICT (code) DO UPDATE SET 
    label = EXCLUDED.label,
    is_system = TRUE,
    sort_order = EXCLUDED.sort_order;

-- Add demonstration intermediate status if not exists
INSERT INTO order_statuses (code, label, description, is_system) 
SELECT 'in_sorting', 'In Sorting Center', 'Shipment is being processed at the local facility', FALSE
WHERE NOT EXISTS (SELECT 1 FROM order_statuses WHERE code = 'in_sorting');
