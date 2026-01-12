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

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a product
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 *       403:
 *         description: Not authorized
 */
router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  validate(createProductSchema),
  ProductController.create,
);

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     tags:
 *       - Products
 *     summary: Update a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.patch(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  validate(updateProductSchema),
  ProductController.update,
);

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: List all products
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", ProductController.list);

export default router;
