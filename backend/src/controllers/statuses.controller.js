import { query } from '../config/db.js';

export const getAllStatuses = async (req, res) => {
    try {
        const result = await query('SELECT * FROM order_statuses ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createStatus = async (req, res) => {
    const { code, label, description } = req.body;

    if (!code || !label) {
        return res.status(400).json({ error: 'Code and Label are required' });
    }

    try {
        const result = await query(
            'INSERT INTO order_statuses (code, label, description, is_system) VALUES ($1, $2, $3, $4) RETURNING *',
            [code.toLowerCase().replace(/\s+/g, '_'), label, description, false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Status code already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { label, description } = req.body;

    try {
        const result = await query(
            'UPDATE order_statuses SET label = $1, description = $2 WHERE id = $3 RETURNING *',
            [label, description, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Status not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteStatus = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if it's a system status
        const statusRes = await query('SELECT * FROM order_statuses WHERE id = $1', [id]);
        if (statusRes.rows.length === 0) {
            return res.status(404).json({ error: 'Status not found' });
        }

        const status = statusRes.rows[0];
        if (status.is_system) {
            return res.status(403).json({ error: 'System statuses cannot be deleted' });
        }

        // Check if it's in use
        const inUseRes = await query('SELECT COUNT(*) FROM orders WHERE current_status_id = $1', [id]);
        if (parseInt(inUseRes.rows[0].count) > 0) {
            return res.status(400).json({ error: 'Status is currently in use by shipments and cannot be deleted' });
        }

        await query('DELETE FROM order_statuses WHERE id = $1', [id]);
        res.json({ message: 'Status deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
