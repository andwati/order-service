import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type UserRole = "admin" | "customer";

export interface UserDocument {
  _id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<UserDocument>("User", userSchema);
