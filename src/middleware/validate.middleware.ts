import type { ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";

interface ParsedRequest {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  query?: Record<string, unknown>;
}

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as ParsedRequest;
      
      // Update request with parsed values (including defaults)
      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params;
      if (parsed.query) req.query = parsed.query as Record<string, string>;
      
      next();
    } catch (err) {
      next(err);
    }
  };

