import { UserRepository } from "../repositories/user.repo.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import type { UserRole } from "../models/user.model.js";

export class AuthService {
  static async register(email: string, password: string, role: UserRole = "customer") {
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw { statusCode: 409, message: "Email already registered" };
    }

    const passwordHash = await hashPassword(password);

    const user = await UserRepository.create({
      email,
      passwordHash,
      role,
    });

    return { id: user._id, email: user.email, role: user.role };
  }

  static async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw { statusCode: 401, message: "Invalid credentials" };
    }

    return {
      token: signToken({ sub: user._id, role: user.role }),
    };
  }
}
