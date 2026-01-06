import express from 'express';
import { query } from '../config/db.js';
import { verifyToken, authorize, requireCompany } from '../middleware/auth.middleware.js';
import crypto from 'crypto';

const router = express.Router();

// Get All Orders (Backoffice Dashboard)
router.get('/orders', verifyToken, requireCompany, async (req, res) => {
    try {
        if (req.user.role === 'Delivery') {
            const result = await query(
                `SELECT o.*, s.code as status_code, s.label as status_label 
                 FROM orders o
                 JOIN order_statuses s ON o.current_status_id = s.id
                 WHERE o.delivery_person_id = $1 AND o.company_id = $2
                 ORDER BY o.created_at DESC`,
                [req.user.id, req.user.companyId]
            );
            return res.json(result.rows);
        }

        const result = await query(
            `SELECT o.*, s.code as status_code, s.label as status_label 
             FROM orders o
             JOIN order_statuses s ON o.current_status_id = s.id
             WHERE o.company_id = $1
             ORDER BY o.created_at DESC`,
            [req.user.companyId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Shipment (Backoffice)
router.post('/orders', verifyToken, requireCompany, authorize('Admin'), async (req, res) => {
    const { trackingId, email, customerName, customerPhone, externalOrderId, pickup, dropoff, deliveryPerson, deliveryPersonId, deliveryInstructions } = req.body;


    if (!trackingId) {
        return res.status(400).json({ error: 'Tracking ID is required' });
    }

    try {
        // Get default status (created)
        const statusRes = await query("SELECT id FROM order_statuses WHERE code = 'created'");
        const createdStatusId = statusRes.rows[0]?.id;

        if (!createdStatusId) {
            return res.status(500).json({ error: "Default status 'created' not found." });
        }


        // Generate unique share token
        const shareToken = crypto.randomBytes(16).toString('hex');
        const companyId = req.user.companyId;

        // Insert Shipment
        const result = await query(
            `INSERT INTO orders (id, email, customer_name, customer_phone, external_order_id, share_token, current_status_id, pickup_lat, pickup_lng, pickup_address, dropoff_lat, dropoff_lng, dropoff_address, delivery_person, delivery_person_id, delivery_instructions, company_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
       RETURNING *`,
            [trackingId, email, customerName, customerPhone, externalOrderId, shareToken, createdStatusId, pickup?.lat, pickup?.lng, pickup?.address, dropoff?.lat, dropoff?.lng, dropoff?.address, deliveryPerson, deliveryPersonId, deliveryInstructions, companyId]
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
router.patch('/orders/:id', verifyToken, requireCompany, authorize(['Admin', 'Delivery']), async (req, res) => {
    const { id } = req.params;
    const {
        statusCode,
        lat,
        lng,
        email,
        customerName,
        customerPhone,
        externalOrderId,
        deliveryPerson,
        deliveryPersonId,
        deliveryInstructions,
        pickupLat,
        pickupLng,
        pickupAddress,
        dropoffLat,
        dropoffLng,
        dropoffAddress
    } = req.body;

    // Delivery field restriction
    if (req.user.role === 'Delivery') {
        const allowedFields = ['statusCode', 'lat', 'lng'];
        const bodyFields = Object.keys(req.body);
        const forbiddenFields = bodyFields.filter(field => !allowedFields.includes(field));

        if (forbiddenFields.length > 0) {
            return res.status(403).json({ error: `Delivery role is not allowed to update: ${forbiddenFields.join(', ')}` });
        }
    }

    try {
        let updateQuery = 'UPDATE orders SET updated_at = NOW()';
        const params = [];
        let paramCount = 1;
        let statusId = null;

        // Fetch current status for flow validation AND verify Company ID
        const currentOrderRes = await query(
            `SELECT o.*, s.code as current_status_code 
             FROM orders o 
             JOIN order_statuses s ON o.current_status_id = s.id 
             WHERE o.id = $1 AND o.company_id = $2`,
            [id, req.user.companyId]
        );

        if (currentOrderRes.rows.length === 0) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        const currentOrder = currentOrderRes.rows[0];

        // Access Control for Delivery Role
        if (req.user.role === 'Delivery') {
            if (currentOrder.delivery_person_id !== req.user.id) {
                return res.status(403).json({ error: 'You do not have permission to modify this shipment' });
            }
        }

        // Resolve status code to ID if provided
        if (statusCode) {
            // Restriction: If current is 'delivered', only allow 'archived'
            // Restriction: Cannot move out of 'archived'
            if (currentOrder.current_status_code === 'archived') {
                return res.status(400).json({ error: 'Archived shipments cannot be modified.' });
            }

            const statusRes = await query('SELECT id FROM order_statuses WHERE code = $1', [statusCode]);
            if (statusRes.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid status code' });
            }
            statusId = statusRes.rows[0].id;
            updateQuery += `, current_status_id = $${paramCount++}`;
            params.push(statusId);
        }

        // Update basic info
        if (email !== undefined) {
            updateQuery += `, email = $${paramCount++}`;
            params.push(email);
        }
        if (customerName !== undefined) {
            updateQuery += `, customer_name = $${paramCount++}`;
            params.push(customerName);
        }
        if (customerPhone !== undefined) {
            updateQuery += `, customer_phone = $${paramCount++}`;
            params.push(customerPhone);
        }
        if (externalOrderId !== undefined) {
            updateQuery += `, external_order_id = $${paramCount++}`;
            params.push(externalOrderId);
        }
        if (deliveryPerson !== undefined) {
            updateQuery += `, delivery_person = $${paramCount++}`;
            params.push(deliveryPerson);
        }
        if (deliveryPersonId !== undefined) {
            updateQuery += `, delivery_person_id = $${paramCount++}`;
            params.push(deliveryPersonId);
        }
        if (deliveryInstructions !== undefined) {
            updateQuery += `, delivery_instructions = $${paramCount++}`;
            params.push(deliveryInstructions);
        }
        if (pickupLat !== undefined) {
            updateQuery += `, pickup_lat = $${paramCount++}`;
            params.push(pickupLat);
        }
        if (pickupLng !== undefined) {
            updateQuery += `, pickup_lng = $${paramCount++}`;
            params.push(pickupLng);
        }
        if (pickupAddress !== undefined) {
            updateQuery += `, pickup_address = $${paramCount++}`;
            params.push(pickupAddress);
        }
        if (dropoffLat !== undefined) {
            updateQuery += `, dropoff_lat = $${paramCount++}`;
            params.push(dropoffLat);
        }
        if (dropoffLng !== undefined) {
            updateQuery += `, dropoff_lng = $${paramCount++}`;
            params.push(dropoffLng);
        }
        if (dropoffAddress !== undefined) {
            updateQuery += `, dropoff_address = $${paramCount++}`;
            params.push(dropoffAddress);
        }

        // Update current tracking location (if provided)
        if (lat !== undefined && lng !== undefined) {
            updateQuery += `, location_lat = $${paramCount++}, location_lng = $${paramCount++}`;
            params.push(lat, lng);
        }

        // Finish update query
        updateQuery += ` WHERE id = $${paramCount} RETURNING *`;
        params.push(id);

        const result = await query(updateQuery, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        // Add history entry if status or location changed
        if (statusId || (lat !== undefined && lng !== undefined)) {
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
