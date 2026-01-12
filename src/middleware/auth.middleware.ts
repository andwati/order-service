import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next({
      status: 401,
      message: "Missing or invalid Authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next({
      status: 401,
      message: "Missing token",
    });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;

    next();
  } catch {
    next({
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }
}
