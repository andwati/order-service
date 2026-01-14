import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router: Router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users (Admin only)
 *     description: Retrieve a list of all registered users. This endpoint is restricted to administrators only.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user ID
 *                   email:
 *                     type: string
 *                     description: The user's email
 *                   role:
 *                     type: string
 *                     enum: [customer, admin]
 *                     description: The user's role
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Account creation date
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Last update date
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/", authMiddleware, requireRole("admin"), UserController.getAll);

export default router;
