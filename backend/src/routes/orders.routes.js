import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// Get Statuses (Helper)
router.get('/statuses', async (req, res) => {
    try {
        const result = await query('SELECT * FROM order_statuses ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Orders (Backoffice Dashboard)
router.get('/orders', async (req, res) => {
    try {
        const result = await query(
            `SELECT o.*, s.code as status_code, s.label as status_label 
             FROM orders o
             JOIN order_statuses s ON o.current_status_id = s.id
             ORDER BY o.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Shipment (Backoffice)
router.post('/orders', async (req, res) => {
    const { trackingId, email, pickup, dropoff, deliveryPerson, deliveryInstructions } = req.body;

    if (!trackingId || !email) {
        return res.status(400).json({ error: 'Tracking ID and Email are required' });
    }

    try {
        // Get default status (created)
        const statusRes = await query("SELECT id FROM order_statuses WHERE code = 'created'");
        const createdStatusId = statusRes.rows[0]?.id;

        if (!createdStatusId) {
            return res.status(500).json({ error: "Default status 'created' not found." });
        }

        // Insert Shipment
        const result = await query(
            `INSERT INTO orders (id, email, current_status_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, delivery_person, delivery_instructions) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
            [trackingId, email, createdStatusId, pickup?.lat, pickup?.lng, dropoff?.lat, dropoff?.lng, deliveryPerson, deliveryInstructions]
        );

        // Add initial history entry
        await query(
            `INSERT INTO order_history (order_id, status_id) VALUES ($1, $2)`,
            [trackingId, createdStatusId]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Order (Backoffice)
router.patch('/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { statusCode, lat, lng } = req.body;

    try {
        let updateQuery = 'UPDATE orders SET updated_at = NOW()';
        const params = [];
        let paramCount = 1;
        let statusId = null;

        // Resolve status code to ID if provided
        if (statusCode) {
            const statusRes = await query('SELECT id FROM order_statuses WHERE code = $1', [statusCode]);
            if (statusRes.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid status code' });
            }
            statusId = statusRes.rows[0].id;
            updateQuery += `, current_status_id = $${paramCount++}`;
            params.push(statusId);
        }

        // Update location if provided
        if (lat !== undefined && lng !== undefined) {
            updateQuery += `, location_lat = $${paramCount++}, location_lng = $${paramCount++}`;
            params.push(lat, lng);
        }

        // Finish update query
        updateQuery += ` WHERE id = $${paramCount} RETURNING *`;
        params.push(id);

        const result = await query(updateQuery, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Add history entry if status or location changed
        if (statusId || (lat !== undefined && lng !== undefined)) {
            // Use current order status if not changing status, or new status if changing
            const historyStatusId = statusId || result.rows[0].current_status_id;
            const historyLat = lat !== undefined ? lat : result.rows[0].location_lat;
            const historyLng = lng !== undefined ? lng : result.rows[0].location_lng;

            await query(
                `INSERT INTO order_history (order_id, status_id, location_lat, location_lng) 
             VALUES ($1, $2, $3, $4)`,
                [id, historyStatusId, historyLat, historyLng]
            );
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
