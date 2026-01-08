import express from "express";
import { validateLicense } from "../services/validation.service.js";

const router = express.Router();

router.post("/validate", (req, res) => {
  const { app_id, license_key, machine_id } = req.body;

  if (!app_id || !license_key || !machine_id) {
    return res.status(400).json({ error: "INVALID_REQUEST" });
  }

  const result = validateLicense({ app_id, license_key, machine_id });
  res.json(result);
});

export default router;
