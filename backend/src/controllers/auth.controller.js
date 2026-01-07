import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export const register = async (req, res) => {
    const { username, password, role, company_id } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['Admin', 'Delivery'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        // Admin is auto-approved, Delivery needs approval
        const isApproved = role === 'Admin';

        // Default to Company ID (Default Logistics) if not provided during migration phase
        const companyIdToUse = company_id || '00000000-0000-0000-0000-000000000001';

        const result = await query(
            'INSERT INTO users (username, password_hash, role, is_approved, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role, is_approved, company_id',
            [username, passwordHash, role, isApproved, companyIdToUse]
        );

        res.status(201).json({
            message: 'User registered successfully',
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

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }

    try {
        const result = await query(
            `SELECT u.*, c.name as company_name 
             FROM users u 
             LEFT JOIN companies c ON u.company_id = c.id 
             WHERE u.username = $1`,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.is_approved) {
            return res.status(403).json({
                error: 'Your account is pending approval by an administrator.',
                pendingApproval: true
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role,
                companyId: user.company_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                companyId: user.company_id,
                companyName: user.company_name
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
