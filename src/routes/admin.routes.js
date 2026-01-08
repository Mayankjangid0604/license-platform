import express from "express";
import { nanoid } from "nanoid";
import { db } from "../db/database.js";
import { adminGuard } from "../middleware/admin.guard.js";
import { APP_STATUS, LICENSE_STATUS } from "../config/constants.js";

const router = express.Router();
router.use(adminGuard);

/* ------------------ APPS ------------------ */

// Create App
router.post("/apps", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "NAME_REQUIRED" });

  const app_id = nanoid(10);

  db.prepare(
    "INSERT INTO apps (app_id, name, status, created_at) VALUES (?, ?, ?, ?)"
  ).run(app_id, name, APP_STATUS.ACTIVE, new Date().toISOString());

  res.json({ app_id, name });
});

// Enable / Disable App
router.patch("/apps/:app_id/status", (req, res) => {
  const { status } = req.body;
  const { app_id } = req.params;

  if (![APP_STATUS.ACTIVE, APP_STATUS.DISABLED].includes(status)) {
    return res.status(400).json({ error: "INVALID_STATUS" });
  }

  db.prepare(
    "UPDATE apps SET status = ? WHERE app_id = ?"
  ).run(status, app_id);

  res.json({ app_id, status });
});

/* ------------------ LICENSES ------------------ */

// Generate License
router.post("/licenses", (req, res) => {
  const { app_id, expires_at = null } = req.body;
  if (!app_id) return res.status(400).json({ error: "APP_ID_REQUIRED" });

  const license_key = nanoid(20);

  db.prepare(
    "INSERT INTO licenses (license_key, app_id, status, expires_at, created_at) VALUES (?, ?, ?, ?, ?)"
  ).run(
    license_key,
    app_id,
    LICENSE_STATUS.ACTIVE,
    expires_at,
    new Date().toISOString()
  );

  res.json({ license_key, app_id });
});

// Change License Status
router.patch("/licenses/:license_key/status", (req, res) => {
  const { status } = req.body;
  const { license_key } = req.params;

  if (![LICENSE_STATUS.ACTIVE, LICENSE_STATUS.DISABLED, LICENSE_STATUS.REVOKED].includes(status)) {
    return res.status(400).json({ error: "INVALID_STATUS" });
  }

  db.prepare(
    "UPDATE licenses SET status = ? WHERE license_key = ?"
  ).run(status, license_key);

  res.json({ license_key, status });
});

// Reset Machine Binding
router.delete("/licenses/:license_key/machine", (req, res) => {
  const { license_key } = req.params;

  db.prepare(
    "DELETE FROM machines WHERE license_key = ?"
  ).run(license_key);

  res.json({ license_key, machine_reset: true });
});

export default router;
