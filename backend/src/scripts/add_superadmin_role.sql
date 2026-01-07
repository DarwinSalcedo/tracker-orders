-- Drop the existing check constraint
ALTER TABLE users DROP CONSTRAINT users_role_check;

-- Add the new check constraint including 'SuperAdmin'
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('SuperAdmin', 'Admin', 'Delivery', 'Viewer'));

-- Seed a default SuperAdmin (CHANGE PASSWORD IN PRODUCTION)
-- Password is 'superadmin123' (hashed)
INSERT INTO users (username, password_hash, role, is_approved, company_id)
VALUES ('superadmin', '$2b$10$ZoTxGg8SU.QpGLjafz1r.OjWcDcxvR1BcoYJmNEVdRnqXIGUtfpZ.', 'SuperAdmin', TRUE, NULL)
ON CONFLICT (username) DO NOTHING;
