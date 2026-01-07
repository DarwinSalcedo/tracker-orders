import { query } from '../config/db.js';

export const getPendingUsers = async (req, res) => {
    try {
        const result = await query(
            "SELECT id, username, role, created_at FROM users WHERE is_approved = FALSE AND role = 'Delivery' AND company_id = $1 ORDER BY created_at ASC",
            [req.user.companyId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const result = await query(
            "SELECT id, username, role, is_approved, created_at FROM users WHERE role = 'Delivery' AND company_id = $1 ORDER BY created_at DESC",
            [req.user.companyId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const approveUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(
            'UPDATE users SET is_approved = TRUE WHERE id = $1 AND company_id = $2 RETURNING id, username, role, is_approved',
            [id, req.user.companyId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found or not in your organization' });
        }

        res.json({
            message: 'User approved successfully',
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query('DELETE FROM users WHERE id = $1 AND company_id = $2 RETURNING id', [id, req.user.companyId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found or not in your organization' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
