import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createOrderSchema,
  orderIdParamSchema,
} from "../validation/order.schema";

const router = Router();

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
