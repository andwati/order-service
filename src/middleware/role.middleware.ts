import type { Request, Response, NextFunction } from "express";

export function requireRole(role: "admin" | "customer") {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({
        statusCode: 401,
        message: "Unauthenticated",
      });
    }

    if (req.user.role !== role) {
      return next({
        statusCode: 403,
        message: "Forbidden",
      });
    }

    next();
  };
}
