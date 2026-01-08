// src/server.js
import express from "express";
import validateRoutes from "./routes/validate.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import healthRoutes from "./routes/health.routes.js";
import "./db/database.js";

const app = express();
app.use(express.json());

// health (public)
app.use("/health", healthRoutes);

// license validation (public)
app.use("/api", validateRoutes);

// admin (protected by x-admin-key)
app.use("/admin", adminRoutes);

// root
app.get("/", (_, res) => {
  res.send("Universal License Platform ONLINE");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("License server running on port", PORT);
});
