import mongoose from "mongoose";
import { ProductRepository } from "../repositories/product.repo.js";
import { OrderRepository } from "../repositories/order.repo.js";

export class OrderService {
  static listOrders(userId: string, role: string) {
    if (String(role).toLowerCase() === "admin") {
      return OrderRepository.findAll();
    }

    return OrderRepository.findByUser(userId);
  }
  static async payOrder(id: string | string[] | undefined) {
    if (!id || Array.isArray(id)) {
      throw { statusCode: 400, message: "Invalid order id" };
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await OrderRepository.findById(id, session);

      if (!order) {
        throw { statusCode: 404, message: "Order not found" };
      }

      if (order.status === "paid") {
        throw { statusCode: 409, message: "Order is already paid" };
      }

      if (order.status === "cancelled") {
        throw { statusCode: 409, message: "Cannot pay a cancelled order" };
      }

      order.status = "paid";
      await OrderRepository.save(order, session);

      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
  static async cancelOrder(id: string | string[] | undefined) {
    if (!id || Array.isArray(id)) {
      throw { statusCode: 400, message: "Invalid order id" };
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await OrderRepository.findById(id, session);

      if (!order) {
        throw { statusCode: 404, message: "Order not found" };
      }

      if (order.status === "cancelled") {
        throw { statusCode: 409, message: "Order is already cancelled" };
      }

      // restore stock for each item
      for (const item of order.items) {
        await ProductRepository.incrementStock(
          item.productId,
          item.quantity,
          session,
        );
      }

      order.status = "cancelled";
      await OrderRepository.save(order, session);

      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
  static async createOrder(
    userId: string,
    items: { productId: string; quantity: number }[],
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const productIds = items.map((i) => i.productId);
      const products = await ProductRepository.findByIds(productIds, session);

      if (products.length !== productIds.length) {
        throw { statusCode: 400, message: "One or more products not found" };
      }

      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = products.find((p) => p._id === item.productId)!;

        if (product.stock < item.quantity) {
          throw {
            statusCode: 409,
            message: `Insufficient stock for product ${product._id}`,
          };
        }

        await ProductRepository.decrementStock(
          product._id,
          item.quantity,
          session,
        );

        orderItems.push({
          productId: product._id,
          quantity: item.quantity,
          unitPrice: product.price,
        });

        total += product.price * item.quantity;
      }

      const order = await OrderRepository.create(
        {
          userId,
          items: orderItems,
          total,
          status: "created",
        },
        session,
      );

      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
