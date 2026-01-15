import { query } from '../config/db.js';

const createTables = async () => {
  try {
    // Enable pgcrypto
    await query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // 1. Companies Table
    await query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        plan VARCHAR(50) DEFAULT 'free',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Order Statuses Table
    await query(`
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
    `);

    // 3. Users Table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('SuperAdmin', 'Admin', 'Delivery', 'Viewer')),
          is_approved BOOLEAN DEFAULT FALSE,
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Orders Table
    // DROP first for dev/setup ease to apply schema changes
    await query(`DROP TABLE IF EXISTS orders CASCADE`);
    await query(`
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
        amount DECIMAL(10, 2),
        current_status_id UUID REFERENCES order_statuses(id),
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Order History Table
    await query(`
      CREATE TABLE IF NOT EXISTS order_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id VARCHAR(50) REFERENCES orders(id),
        status_id UUID REFERENCES order_statuses(id),
        location_lat DECIMAL(9, 6),
        location_lng DECIMAL(9, 6),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Seed Default Company
    await query(`
      INSERT INTO companies (id, name, plan) 
      VALUES ('00000000-0000-0000-0000-000000000001', 'Default Logistics', 'pro') 
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

const seedStatuses = async () => {
  const statuses = [
    { code: 'created', label: 'Order Placed', description: 'Your order has been placed and is being processed.', is_system: true, sort_order: 10 },
    { code: 'in_transit', label: 'In Transit', description: 'Your package is on its way.', is_system: true, sort_order: 20 },
    { code: 'delivered', label: 'Delivered', description: 'Your package has been delivered.', is_system: true, sort_order: 30 },
    { code: 'completed', label: 'Completed', description: 'This order has been moved to completed.', is_system: true, sort_order: 40 },
  ];

  try {
    for (const status of statuses) {
      // Explicitly link to Default Company UUID
      await query(`
        INSERT INTO order_statuses (code, label, description, is_system, sort_order, company_id)
        VALUES ($1, $2, $3, $4, $5, '00000000-0000-0000-0000-000000000001')
        ON CONFLICT (company_id, code) DO UPDATE SET is_system = EXCLUDED.is_system, sort_order = EXCLUDED.sort_order, company_id = EXCLUDED.company_id;
      `, [status.code, status.label, status.description, status.is_system, status.sort_order]);
    }
    console.log('Statuses seeded successfully.');

    // Seed Super Admin
    await query(`
        INSERT INTO users (username, password, role, is_approved, company_id)
        VALUES ('superadmin', crypt('password', gen_salt('bf')), 'SuperAdmin', TRUE, '00000000-0000-0000-0000-000000000001')
        ON CONFLICT (username) DO NOTHING;
    `);
    console.log('Super Admin seeded.');

  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

const runBackendSetup = async () => {
  await createTables();
  await seedStatuses();
  process.exit();
};

runBackendSetup();
