import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authRateLimiter } from "../middleware/rateLimit.middleware.js";
import { registerSchema, loginSchema } from "../validation/auth.schema.js";

const router: Router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  AuthController.register,
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  AuthController.login,
);

export default router;
