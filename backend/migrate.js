import { query } from './src/config/db.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const runMigration = async () => {
    const scriptsDir = path.resolve('src/scripts');

    try {
        const files = fs.readdirSync(scriptsDir).filter(file => file.endsWith('.sql'));

        // Custom order if needed, otherwise strict alphabetical might not be ideal.
        // For now, let's explicitly list them to control order, or just simple sort.
        // Given the file names, alphabetical is:
        // 1. add_users.sql
        // 2. alter_orders...
        // 3. init_db.sql (Should be first!)
        // 4. update_statuses.sql
        // 5. update_users_approval.sql

        // Correct Execution Order:
        const executionOrder = [
            'init_db.sql',
            'update_statuses.sql',
            'update_users_approval.sql',
            'alter_orders_add_customer_info.sql',
            'alter_orders_add_external_id.sql',
            'add_users.sql'
        ];

        console.log('Starting migration...');

        for (const file of executionOrder) {
            if (files.includes(file)) {
                const sqlPath = path.join(scriptsDir, file);
                const sql = fs.readFileSync(sqlPath, 'utf8');
                console.log(`Executing ${file}...`);
                await query(sql);
                console.log(`Executed ${file}`);
            }
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

runMigration();
