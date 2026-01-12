import { ProductRepository } from "../repositories/product.repo.js";

export class ProductService {
  static create(data: { name: string; price: number; stock: number }) {
    return ProductRepository.create(data);
  }

  static list() {
    return ProductRepository.findAll();
  }

  static async update(
    id: string,
    data: Partial<{ name: string; price: number; stock: number }>,
  ) {
    const product = await ProductRepository.updateById(id, data);
    if (!product) {
      throw { statusCode: 404, message: "Product not found" };
    }
    return product;
  }
}
