import type { ClientSession } from "mongoose";
import { OrderModel, type OrderDocument } from "../models/order.model.js";

export class OrderRepository {
  static create(
    data: Omit<OrderDocument, "_id" | "createdAt" | "updatedAt">,
    session: ClientSession,
  ): Promise<OrderDocument> {
    return OrderModel.create(data, { session });
  }

  static findById(id: string, session?: ClientSession) {
    return OrderModel.findById(id).session(session ?? null);
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
