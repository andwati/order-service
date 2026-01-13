import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";

export class UserController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAll();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
}
