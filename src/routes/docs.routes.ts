import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";
import { Router } from "express";

const router: Router = express.Router();

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
