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
      default: uuidv4,
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

export const ProductModel = model<ProductDocument>("Product", productSchema);
