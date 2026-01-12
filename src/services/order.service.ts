import mongoose from "mongoose";
import { ProductModel } from "../models/product.model";
import { OrderModel } from "../models/order.model";

export class OrderService {
  static async createOrder(
    userId: string,
    items: { productId: string; quantity: number }[],
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const productIds = items.map((i) => i.productId);

      const products = await ProductModel.find({
        _id: { $in: productIds },
      }).session(session);

      if (products.length !== productIds.length) {
        throw { statusCode: 400, message: "One or more products not found" };
      }

      const orderItems = [];
      let total = 0;

      for (const item of items) {
        const product = products.find((p) => p._id === item.productId)!;

        if (item.quantity <= 0) {
          throw {
            statusCode: 400,
            message: "Quantity must be greater than zero",
          };
        }

        if (product.stock < item.quantity) {
          throw {
            statusCode: 409,
            message: `Insufficient stock for product ${product._id}`,
          };
        }

        product.stock -= item.quantity;
        await product.save({ session });

        orderItems.push({
          productId: product._id,
          quantity: item.quantity,
          unitPrice: product.price,
        });

        total += product.price * item.quantity;
      }

      const order = await OrderModel.create(
        [
          {
            userId,
            items: orderItems,
            total,
            status: "created",
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return order[0];
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  static async listOrders(userId: string, role: "admin" | "customer") {
    if (role === "admin") {
      return OrderModel.find().lean();
    }
    return OrderModel.find({ userId }).lean();
  }

  static async payOrder(orderId: string) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw { statusCode: 404, message: "Order not found" };
    }

    if (order.status === "paid") {
      return order;
    }

    if (order.status === "cancelled") {
      throw { statusCode: 409, message: "Order is cancelled" };
    }

    order.status = "paid";
    await order.save();
    return order;
  }

  static async cancelOrder(orderId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await OrderModel.findById(orderId).session(session);
      if (!order) {
        throw { statusCode: 404, message: "Order not found" };
      }

      if (order.status === "cancelled") {
        await session.commitTransaction();
        return order;
      }

      if (order.status === "paid") {
        throw {
          statusCode: 409,
          message: "Paid orders cannot be cancelled",
        };
      }

      for (const item of order.items) {
        await ProductModel.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } },
          { session },
        );
      }

      order.status = "cancelled";
      await order.save({ session });

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
