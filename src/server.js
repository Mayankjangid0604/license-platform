import express from "express";
import healthRoutes from "./routes/health.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import validateRoutes from "./routes/validate.routes.js";
import "./db/database.js";

const app = express();
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/admin", adminRoutes);   // ✅ THIS WAS MISSING
app.use("/api", validateRoutes);

app.get("/", (req, res) => {
  res.send("Universal License Platform ONLINE");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("License server running on port", PORT);
});
