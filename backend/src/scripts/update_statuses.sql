-- Add is_system column to order_statuses if not exists
ALTER TABLE order_statuses ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT FALSE;

-- Ensure mandatory statuses exist with correct labels
INSERT INTO order_statuses (code, label, description, is_system) 
VALUES 
    ('created', 'Order Placed', 'Your order has been placed and is being processed.', TRUE),
    ('in_transit', 'In Transit', 'Your package is on its way.', TRUE),
    ('delivered', 'Delivery', 'Your package has been delivered.', TRUE),
    ('archived', 'Archived', 'This order has been moved to archive.', TRUE)
ON CONFLICT (code) DO UPDATE SET 
    label = EXCLUDED.label,
    is_system = TRUE;

-- Add demonstration intermediate status if not exists
INSERT INTO order_statuses (code, label, description, is_system) 
SELECT 'in_sorting', 'In Sorting Center', 'Shipment is being processed at the local facility', FALSE
WHERE NOT EXISTS (SELECT 1 FROM order_statuses WHERE code = 'in_sorting');
