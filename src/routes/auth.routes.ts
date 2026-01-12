import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { authRateLimiter } from "../middleware/rateLimit.middleware";
import { registerSchema, loginSchema } from "../validation/auth.schema";

const router = Router();

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
