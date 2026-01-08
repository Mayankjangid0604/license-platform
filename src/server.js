import express from "express";
import validateRoutes from "./routes/validate.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import "./db/database.js";
import healthRoutes from "./routes/health.routes.js";



const app = express();
app.use(express.json());
app.use("/health", healthRoutes);
app.use("/api", validateRoutes);
app.use("/admin", adminRoutes);

app.get("/", (_, res) => {
  res.send("Universal License Platform ONLINE");
});

app.listen(3000, () => {
  console.log("License server running on port 3000");
});
