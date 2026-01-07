import { query } from '../config/db.js';

export const getAllCompanies = async (req, res) => {
    try {
        const result = await query('SELECT id, name FROM companies ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
