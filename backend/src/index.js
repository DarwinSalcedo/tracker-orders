import express from "express";
import cors from "cors";

import { query } from "./config/db.js";

const app = express();

app.use(express.json());
app.use(cors());

// Test DB connection
query('SELECT NOW()')
  .then((res) => console.log('Database connected successfully:', res.rows[0]))
  .catch((err) => console.error('Database connection failed:', err.message));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/track", (req, res) => {
  const { trackingId, email } = req.body;

  if (!trackingId || !email) {
    return res.status(400).json({ error: "Missing data" });
  }

  // Mock response
  res.json({
    trackingId,
    status: "in_transit",
    history: [
      { status: "Order placed", date: "2025-01-01" },
      { status: "In transit", date: "2025-01-03" }
    ],
    location: { lat: 19.4326, lng: -99.1332 }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
