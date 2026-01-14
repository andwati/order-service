import { connectDB } from "../config/db.js";
import { ProductModel } from "../models/product.model.js";
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

const PRODUCTS = [
  {
    name: "Wireless Mouse",
    price: 2500, // $25.00
    stock: 100,
  },
  {
    name: "Mechanical Keyboard",
    price: 12000, // $120.00
    stock: 50,
  },
  {
    name: "USB-C Hub",
    price: 4500, // $45.00
    stock: 75,
  },
  {
    name: "Monitor Stand",
    price: 3500, // $35.00
    stock: 200,
  },
  {
    name: "Gaming Headset",
    price: 8000, // $80.00
    stock: 30,
  }
];

async function seed() {
  try {
    logger.info("Connecting to database...");
    await connectDB();
    logger.info("Connected to database.");

    logger.info("Clearing products...");
    await ProductModel.deleteMany({});
    logger.info("Products cleared.");

    logger.info("Seeding products...");
    await ProductModel.insertMany(PRODUCTS);
    logger.info("Products seeded successfully.");

    process.exit(0);
  } catch (error) {
    logger.error("Error seeding database:", { error });
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
