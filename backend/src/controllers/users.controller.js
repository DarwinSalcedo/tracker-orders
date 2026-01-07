import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const getPendingUsers = async (req, res) => {
    try {
        // SuperAdmin sees all or specifically pending? Assuming company logic for now.
        // If SuperAdmin, we might want to see ALL pending across all companies?
        const isSuperAdmin = req.user.role === 'SuperAdmin';

        let queryText = "SELECT id, username, role, created_at FROM users WHERE is_approved = FALSE AND role = 'Delivery'";
        let params = [];

        if (!isSuperAdmin) {
            queryText += " AND company_id = $1";
            params.push(req.user.companyId);
        }

        queryText += " ORDER BY created_at ASC";

        const result = await query(queryText, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const isSuperAdmin = req.user.role === 'SuperAdmin';

        // SuperAdmin might want to see Admins too, but this endpoint was originally for Delivery users.
        // Let's keep it for Delivery users for now or expand it? 
        // The Prompt asked for "isolated screen... to create admins".
        // Let's assume standard behavior for now.

        let queryText = "SELECT id, username, role, is_approved, created_at, company_id FROM users WHERE role = 'Delivery'";
        let params = [];

        if (!isSuperAdmin) {
            queryText += " AND company_id = $1";
            params.push(req.user.companyId);
        }

        queryText += " ORDER BY created_at DESC";

        const result = await query(queryText, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const approveUser = async (req, res) => {
    const { id } = req.params;
    const isSuperAdmin = req.user.role === 'SuperAdmin';

    try {
        let queryText = 'UPDATE users SET is_approved = TRUE WHERE id = $1';
        let params = [id];

        if (!isSuperAdmin) {
            queryText += ' AND company_id = $2';
            params.push(req.user.companyId);
        }

        queryText += ' RETURNING id, username, role, is_approved';

        const result = await query(queryText, params);

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
    const isSuperAdmin = req.user.role === 'SuperAdmin';

    try {
        let queryText = 'DELETE FROM users WHERE id = $1';
        let params = [id];

        if (!isSuperAdmin) {
            queryText += ' AND company_id = $2';
            params.push(req.user.companyId);
        }

        queryText += ' RETURNING id';

        const result = await query(queryText, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found or not in your organization' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// SuperAdmin Only: Create an Admin for a specific company
export const createCompanyAdmin = async (req, res) => {
    const { username, password, companyId } = req.body;

    if (!username || !password || !companyId) {
        return res.status(400).json({ error: 'Username, password, and companyId are required' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await query(
            "INSERT INTO users (username, password, role, is_approved, company_id) VALUES ($1, $2, 'Admin', TRUE, $3) RETURNING id, username, role, company_id",
            [username, passwordHash, companyId]
        );

        res.status(201).json({
            message: 'Company Admin created successfully',
            user: result.rows[0]
        });

    } catch (err) {
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Username already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    try {
        const result = await query('SELECT password FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = result.rows[0];

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        await query('UPDATE users SET password = $1 WHERE id = $2', [hash, userId]);

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
