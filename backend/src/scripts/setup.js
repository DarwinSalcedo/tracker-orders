import { query } from '../config/db.js';

const createTables = async () => {
  try {
    // 1. Companies Table
    await query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        plan VARCHAR(50) DEFAULT 'free',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Order Statuses Table
    await query(`
      CREATE TABLE IF NOT EXISTS order_statuses (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        label VARCHAR(100) NOT NULL,
        description TEXT,
        is_system BOOLEAN DEFAULT FALSE,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE
      );
    `);

    // 3. Users Table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Delivery', 'Viewer')),
          is_approved BOOLEAN DEFAULT FALSE,
          company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
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
        delivery_person_id INTEGER REFERENCES users(id),
        delivery_instructions TEXT,
        current_status_id INTEGER REFERENCES order_statuses(id),
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Order History Table
    await query(`
      CREATE TABLE IF NOT EXISTS order_history (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id),
        status_id INTEGER REFERENCES order_statuses(id),
        location_lat DECIMAL(9, 6),
        location_lng DECIMAL(9, 6),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Seed Default Company
    await query(`INSERT INTO companies (id, name, plan) VALUES (1, 'Default Logistics', 'pro') ON CONFLICT (id) DO NOTHING;`);

    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

const seedStatuses = async () => {
  const statuses = [
    { code: 'created', label: 'Order Placed', description: 'Your order has been placed and is being processed.', is_system: true },
    { code: 'in_transit', label: 'In Transit', description: 'Your package is on its way.', is_system: true },
    { code: 'delivered', label: 'Delivered', description: 'Your package has been delivered.', is_system: true },
    { code: 'completed', label: 'Completed', description: 'This shipment has been completed.', is_system: true },
  ];

  try {
    for (const status of statuses) {
      await query(`
        INSERT INTO order_statuses (code, label, description, is_system)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (code) DO UPDATE SET is_system = EXCLUDED.is_system;
      `, [status.code, status.label, status.description, status.is_system]);
    }
    console.log('Statuses seeded successfully.');
  } catch (err) {
    console.error('Error seeding statuses:', err);
  }
};

const runBackendSetup = async () => {
  await createTables();
  await seedStatuses();
  process.exit();
};

runBackendSetup();
