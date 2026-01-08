// src/server.js
import express from "express";
import healthRoutes from "./routes/health.routes.js";

const app = express();
app.use(express.json());

// REGISTER HEALTH FIRST
app.use("/health", healthRoutes);

// ROOT
app.get("/", (req, res) => {
  res.send("Universal License Platform ONLINE");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("License server running on port", PORT);
});
