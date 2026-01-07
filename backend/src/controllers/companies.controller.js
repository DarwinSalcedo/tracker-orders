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

        const newCompany = result.rows[0];

        // Auto-create default system statuses for the new company
        const defaultStatuses = [
            { code: 'created', label: 'Order Placed', description: 'Your order has been placed and is being processed.', order: 10 },
            { code: 'in_transit', label: 'In Transit', description: 'Your package is on its way.', order: 20 },
            { code: 'delivered', label: 'Delivery', description: 'Your package has been delivered.', order: 30 },
            { code: 'completed', label: 'Completed', description: 'This order has been moved to completed.', order: 40 }
        ];

        for (const status of defaultStatuses) {
            await query(
                'INSERT INTO order_statuses (code, label, description, is_system, sort_order, company_id) VALUES ($1, $2, $3, $4, $5, $6)',
                [status.code, status.label, status.description, true, status.order, newCompany.id]
            );
        }

        res.status(201).json(newCompany);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
