import type { Request, Response, NextFunction } from "express";

export function requireRole(roles: "admin" | "customer" | ("admin" | "customer")[]) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({
        statusCode: 401,
        message: "Unauthenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role as "admin" | "customer")) {
      return next({
        statusCode: 403,
        message: "Forbidden",
      });
    }

    next();
  };
}
