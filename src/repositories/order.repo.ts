import type { ClientSession } from "mongoose";
import { OrderModel, type OrderDocument } from "../models/order.model.js";

export class OrderRepository {
  static create(
    data: Omit<OrderDocument, "_id" | "createdAt" | "updatedAt">,
    session?: ClientSession,
  ): Promise<OrderDocument> {
    const order = new OrderModel(data);
    return order.save({ session: session ?? undefined });
  }

  static findById(id: string, session?: ClientSession) {
    const query = OrderModel.findById(id);
    return session ? query.session(session) : query;
  }

  static findAll() {
    return OrderModel.find().lean();
  }

  static findByUser(userId: string) {
    return OrderModel.find({ userId }).lean();
  }

  static save(
    order: OrderDocument & {
      save: (options?: {
        session?: ClientSession | null;
      }) => Promise<OrderDocument>;
    },
    session?: ClientSession,
  ) {
    return order.save({ session: session ?? null });
  }
}
