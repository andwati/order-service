import express from "express";
import * as swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";
import { Router } from "express";

const router: Router = express.Router();

router.use("/", (req, res, next) => {
  console.log("Serving Swagger UI at", req.originalUrl);
  next();
});

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
