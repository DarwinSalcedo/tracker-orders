import { query } from '../config/db.js';

const setupUsersTable = async () => {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Delivery')),
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
