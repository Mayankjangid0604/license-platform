// src/routes/health.routes.js
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "ONLINE",
    server_time: new Date().toISOString()
  });
});

export default router;
