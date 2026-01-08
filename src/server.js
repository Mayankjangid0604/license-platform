import express from "express";
import validateRoutes from "./routes/validate.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import healthRoutes from "./routes/health.routes.js";
import "./db/database.js";

const app = express();
app.use(express.json());

// order does NOT matter now
app.use("/health", healthRoutes);
app.use("/api", validateRoutes);
app.use("/admin", adminRoutes);

app.get("/", (_, res) => {
  res.send("Universal License Platform ONLINE");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("License server running on port", PORT);
});
