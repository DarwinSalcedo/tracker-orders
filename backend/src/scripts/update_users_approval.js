import { query } from '../config/db.js';

const updateUsersTable = async () => {
    try {
        await query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
        `);
        // Approve any existing admins for safety
        await query(`
            UPDATE users SET is_approved = TRUE WHERE role = 'Admin';
        `);
        console.log('Users table updated with is_approved column.');
        process.exit();
    } catch (err) {
        console.error('Error updating users table:', err);
        process.exit(1);
    }
};

updateUsersTable();
