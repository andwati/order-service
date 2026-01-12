import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../validation/product.schema";

const router = Router();

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
