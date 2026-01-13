import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: "Validation Error",
        details: err.issues,
      },
    });
    return;
  }

  console.error(err);
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message,
    },
  });
}
