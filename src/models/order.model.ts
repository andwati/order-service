import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type OrderStatus = "created" | "paid" | "cancelled";

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDocument {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>(
  {
    productId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const orderSchema = new Schema<OrderDocument>(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: OrderItem[]) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },
    total: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["created", "paid", "cancelled"],
      default: "created",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The order ID
 *         userId:
 *           type: string
 *           description: The user ID who placed the order
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unitPrice:
 *                 type: number
 *         total:
 *           type: number
 *           description: The total order amount in cents
 *         status:
 *           type: string
 *           enum: [created, paid, cancelled]
 *           description: The order status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the order was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the order was updated
 */
export const OrderModel = model<OrderDocument>("Order", orderSchema);
