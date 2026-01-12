import { ProductModel } from "../models/product.model";

export class ProductService {
  static async create(data: { name: string; price: number; stock: number }) {
    const product = await ProductModel.create(data);
    return product;
  }

  static async list() {
    return ProductModel.find().lean();
  }

  static async update(
    id: string,
    data: Partial<{ name: string; price: number; stock: number }>,
  ) {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );

    if (!product) {
      throw { statusCode: 404, message: "Product not found" };
    }

    return product;
  }
}
