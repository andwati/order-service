import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ProductDocument {
  _id: string;
  name: string;
  price: number; // cents
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
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
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The product ID
 *         name:
 *           type: string
 *           description: The product name
 *         price:
 *           type: number
 *           description: The product price in cents
 *         stock:
 *           type: number
 *           description: The product stock quantity
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the product was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the product was updated
 */
export const ProductModel = model<ProductDocument>("Product", productSchema);
