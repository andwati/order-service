import { UserRepository } from "../repositories/user.repo.js";

export class UserService {
  static async getAll() {
    const users = await UserRepository.findAll();
    return users.map((user) => ({
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}
