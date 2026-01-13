import express from "express";
import type { Application } from "express";
import cors from "cors";
import morgan from "morgan";

import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import docsRoutes from "./routes/docs.routes.js";

const app: Application = express();

//global middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);
// swagger ui
app.use("/docs", docsRoutes);

// error handling middleware
app.use(errorHandler);

export default app;
