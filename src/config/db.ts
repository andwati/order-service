import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.mongoUri);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}
