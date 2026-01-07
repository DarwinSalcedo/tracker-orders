import { query } from '../config/db.js';

export const getDashboardStats = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        // 1. Average Delivery Time (for completed orders)
        // delivery_time = difference between 'delivered' status timestamp and 'created' order timestamp
        // This is complex because we need to join order_history. 
        // Simpler approximation: updated_at - created_at for 'delivered'/'completed' orders.
        const avgDeliveryQuery = `
            SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60) as avg_minutes
            FROM orders
            WHERE company_id = $1 
            AND current_status_id IN (SELECT id FROM order_statuses WHERE code IN ('delivered', 'completed'))
        `;

        // 2. Counts by Status
        const statusCountsQuery = `
            SELECT s.label, COUNT(o.id) as count
            FROM orders o
            JOIN order_statuses s ON o.current_status_id = s.id
            WHERE o.company_id = $1
            GROUP BY s.label
        `;

        // 3. Top Delivery Persons
        const topDriversQuery = `
            SELECT u.username, COUNT(o.id) as deliveries
            FROM orders o
            JOIN users u ON o.delivery_person_id = u.id
            WHERE o.company_id = $1 
            AND o.current_status_id IN (SELECT id FROM order_statuses WHERE code IN ('delivered', 'completed'))
            GROUP BY u.username
            ORDER BY deliveries DESC
            LIMIT 5
        `;

        // 4. Weekly Volume (Last 7 Days)
        const weeklyVolumeQuery = `
            SELECT TO_CHAR(created_at, 'Day') as day, COUNT(*) as count
            FROM orders
            WHERE company_id = $1 
            AND created_at >= NOW() - INTERVAL '7 days'
            GROUP BY TO_CHAR(created_at, 'Day'), created_at::date
            ORDER BY created_at::date
        `;

        const [avgRes, statusRes, topDriversRes, weeklyRes] = await Promise.all([
            query(avgDeliveryQuery, [companyId]),
            query(statusCountsQuery, [companyId]),
            query(topDriversQuery, [companyId]),
            query(weeklyVolumeQuery, [companyId])
        ]);

        const avgMinutes = Math.round(avgRes.rows[0]?.avg_minutes || 0);

        // Format time nicely
        const hours = Math.floor(avgMinutes / 60);
        const mins = avgMinutes % 60;
        const avgTimeFormatted = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

        res.json({
            avgDeliveryTime: avgTimeFormatted,
            statusDistribution: statusRes.rows,
            topDrivers: topDriversRes.rows,
            weeklyVolume: weeklyRes.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};
