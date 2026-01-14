import type { ClientSession } from "mongoose";
import { UserModel } from "../models/user.model.js";
import type { UserDocument } from "../models/user.model.js";

export class UserRepository {
  static findAll(): Promise<UserDocument[]> {
    return UserModel.find().select("-passwordHash");
  }

  static findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email });
  }

  static findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id);
  }

  static create(
    data: Pick<UserDocument, "email" | "passwordHash" | "role">,
    session?: ClientSession,
  ): Promise<UserDocument> {
    const user = new UserModel(data);
    return user.save();
  }
}
