import { query } from './src/config/db.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const runMigration = async () => {
    const sqlPath = path.resolve('src/scripts/update_statuses.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    try {
        console.log('Running migration...');
        await query(sql);
        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

runMigration();
