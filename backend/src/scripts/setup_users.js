import { query } from '../config/db.js';

const setupUsersTable = async () => {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Delivery', 'Viewer')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Users table created successfully.');
        process.exit();
    } catch (err) {
        console.error('Error creating users table:', err);
        process.exit(1);
    }
};

setupUsersTable();
