import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createOrderSchema,
  orderIdParamSchema,
} from "../validation/order.schema.js";

const router: Router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole("customer"),
  validate(createOrderSchema),
  OrderController.create,
);

router.get("/", authMiddleware, OrderController.list);

router.post(
  "/:id/pay",
  authMiddleware,
  validate(orderIdParamSchema),
  OrderController.pay,
);

router.post(
  "/:id/cancel",
  authMiddleware,
  validate(orderIdParamSchema),
  OrderController.cancel,
);

export default router;
