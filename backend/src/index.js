import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ordersRoutes from "./routes/orders.routes.js";

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

// Backoffice Routes
app.use("/api", ordersRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/track", async (req, res) => {
  const { trackingId, email } = req.body;

  if (!trackingId || !email) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    // 1. Get Order details with current status
    const orderRes = await query(
      `SELECT o.*, s.code as status_code, s.label as status_label 
       FROM orders o
       JOIN order_statuses s ON o.current_status_id = s.id
       WHERE o.id = $1 AND o.email = $2`,
      [trackingId, email]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRes.rows[0];

    // 2. Get Order History
    const historyRes = await query(
      `SELECT h.*, s.label as status_label 
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
      location: { lat: order.location_lat, lng: order.location_lng },
      pickup: { lat: order.pickup_lat, lng: order.pickup_lng },
      dropoff: { lat: order.dropoff_lat, lng: order.dropoff_lng },
      history: historyRes.rows.map(h => ({
        status: h.status_label,
        date: h.timestamp,
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
