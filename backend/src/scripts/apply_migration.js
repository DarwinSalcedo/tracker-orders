import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigration = async () => {
    try {
        console.log('Starting SaaS Migration...');

        // Read the SQL file
        const sqlPath = path.join(__dirname, 'migrate_saas.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute query
        await query(sql);

        console.log('✅ Migration applied successfully!');
        console.log('   - Created companies table');
        console.log('   - Added company_id to users, orders, and statuses');
        console.log('   - Seeded default company (ID: 1)');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

runMigration();
