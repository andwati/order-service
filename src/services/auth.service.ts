import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model";
import { signToken } from "../utils/jwt";

const SALT_ROUNDS = 10;

export class AuthService {
  static async register(email: string, password: string) {
    const existing = await UserModel.findOne({ email });
    if (existing) {
      throw { statusCode: 409, message: "Email already registered" };
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await UserModel.create({
      email,
      passwordHash,
      role: "customer",
    });

    return {
      id: user._id,
      email: user.email,
      role: user.role,
    };
  }

  static async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw { statusCode: 401, message: "Invalid credentials" };
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw { statusCode: 401, message: "Invalid credentials" };
    }

    const token = signToken({
      sub: user._id,
      role: user.role,
    });

    return { token };
  }
}
