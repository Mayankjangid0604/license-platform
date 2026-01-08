// src/routes/health.routes.js
import express from "express";
import { SERVER_ID } from "../config/constants.js";

const router = express.Router();

router.get("/", (_, res) => {
  res.json({
    status: "ONLINE",
    server_id: SERVER_ID,
    server_time: new Date().toISOString()
  });
});

export default router;
