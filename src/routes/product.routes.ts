import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validation/product.schema.js";

const router: Router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  validate(createProductSchema),
  ProductController.create,
);

router.patch(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  validate(updateProductSchema),
  ProductController.update,
);

router.get("/", ProductController.list);

export default router;
