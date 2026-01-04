import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ordersRoutes from "./routes/orders.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import statusesRoutes from "./routes/statuses.routes.js";

import { query } from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));

// Test DB connection
query('SELECT NOW()')
  .then((res) => console.log('Database connected successfully:', res.rows[0]))
  .catch((err) => console.error('Database connection failed:', err.message));

// Auth Routes
app.use("/api/auth", authRoutes);

// User Management Routes
app.use("/api/users", usersRoutes);

// Status Management Routes
app.use("/api/statuses", statusesRoutes);

// Backoffice Routes
app.use("/api", ordersRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/track", async (req, res) => {
  const { trackingId, email } = req.body;

  if (!trackingId) {
    return res.status(400).json({ error: "Tracking ID is required" });
  }

  try {
    // 1. Get Order details with current status
    const orderRes = await query(
      `SELECT o.*, s.code as status_code, s.label as status_label 
       FROM orders o
       JOIN order_statuses s ON o.current_status_id = s.id
     WHERE o.id = $1`,
      [trackingId]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRes.rows[0];

    // Security Check: If order has email, req must provide matching email
    if (order.email && (!email || email.toLowerCase() !== order.email.toLowerCase())) {
      return res.status(403).json({ error: "Invalid credentials for this order" });
    }

    // 2. Get Order History
    const historyRes = await query(
      `SELECT h.*, s.label as status_label, s.description as status_description 
       FROM order_history h
       JOIN order_statuses s ON h.status_id = s.id
       WHERE h.order_id = $1
       ORDER BY h.timestamp ASC`,
      [trackingId]
    );

    res.json({
      trackingId: order.id,
      status: order.status_code,
      statusLabel: order.status_label,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      email: order.email,
      externalOrderId: order.external_order_id,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      location: { lat: order.location_lat, lng: order.location_lng },
      pickup: { lat: order.pickup_lat, lng: order.pickup_lng },
      dropoff: { lat: order.dropoff_lat, lng: order.dropoff_lng },
      deliveryPerson: order.delivery_person,
      deliveryInstructions: order.delivery_instructions,
      history: historyRes.rows.map(h => ({
        status: h.status_label,
        description: h.status_description,
        timestamp: h.timestamp,
        location: { lat: h.location_lat, lng: h.location_lng }
      }))
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
