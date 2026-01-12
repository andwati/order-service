import type { ClientSession } from "mongoose";
import { ProductModel } from "../models/product.model.js";
import type { ProductDocument } from "../models/product.model.js";

export class ProductRepository {
  static findAll(): Promise<ProductDocument[]> {
    return ProductModel.find().lean();
  }

  static findByIds(
    ids: string[],
    session?: ClientSession,
  ): Promise<ProductDocument[]> {
    return ProductModel.find({ _id: { $in: ids } }).session(session ?? null);
  }

  static findById(id: string): Promise<ProductDocument | null> {
    return ProductModel.findById(id);
  }

  static create(
    data: Pick<ProductDocument, "name" | "price" | "stock">,
  ): Promise<ProductDocument> {
    return ProductModel.create(data);
  }

  static updateById(
    id: string,
    update: Partial<Pick<ProductDocument, "name" | "price" | "stock">>,
  ): Promise<ProductDocument | null> {
    return ProductModel.findByIdAndUpdate(id, update, { new: true });
  }

  static decrementStock(id: string, quantity: number, session: ClientSession) {
    return ProductModel.updateOne(
      { _id: id, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { session },
    );
  }

  static incrementStock(id: string, quantity: number, session: ClientSession) {
    return ProductModel.updateOne(
      { _id: id },
      { $inc: { stock: quantity } },
      { session },
    );
  }
}
