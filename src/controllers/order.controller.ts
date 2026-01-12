import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service";

export class OrderController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { items } = req.body;

      const order = await OrderService.createOrder(userId, items);

      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const role = req.user!.role;

      const orders = await OrderService.listOrders(userId, role);

      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  }

  static async pay(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const order = await OrderService.payOrder(id);

      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const order = await OrderService.cancelOrder(id);

      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  }
}
