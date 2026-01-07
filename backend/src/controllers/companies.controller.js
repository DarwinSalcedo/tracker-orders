import { query } from '../config/db.js';

export const getAllCompanies = async (req, res) => {
    try {
        const result = await query('SELECT id, name, plan, created_at FROM companies ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createCompany = async (req, res) => {
    const { name, plan } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Company name is required' });
    }

    try {
        const result = await query(
            'INSERT INTO companies (name, plan) VALUES ($1, $2) RETURNING *',
            [name, plan || 'free']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
