import type { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service.js";

export class ProductController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }

  static async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const products = await ProductService.list();
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (typeof id !== "string") {
        res.status(400);
        return next({ statusCode: 400, message: "Invalid product id" });
      }
      const product = await ProductService.update(id, req.body);
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  }
}
