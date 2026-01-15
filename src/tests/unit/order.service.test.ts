import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { OrderService } from "../../services/order.service.js";
import { OrderRepository } from "../../repositories/order.repo.js";
import { ProductRepository } from "../../repositories/product.repo.js";

vi.mock("mongoose", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import("mongoose");

  const startSession = vi.fn().mockResolvedValue({
    startTransaction: vi.fn(),
    commitTransaction: vi.fn(),
    abortTransaction: vi.fn(),
    endSession: vi.fn(),
  });

  return {
    ...actual,
    default: {
      ...(actual as any).default,
      startSession,
    },
    startSession,
  };
});

vi.mock("../../repositories/order.repo.js");
vi.mock("../../repositories/product.repo.js");

describe("OrderService", () => {
  const mockedOrderRepo = vi.mocked(OrderRepository);
  const mockedProductRepo = vi.mocked(ProductRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("listOrders", () => {
    it("lists all orders for admin role", async () => {
      const orders = [{ id: "1" }];
      // @ts-ignore
      mockedOrderRepo.findAll.mockResolvedValueOnce(orders as never);

      const result = await OrderService.listOrders("user-id", "admin");

      expect(mockedOrderRepo.findAll).toHaveBeenCalledOnce();
      expect(result).toEqual(orders);
    });

    it("lists user orders for non-admin role", async () => {
      const orders = [{ id: "2" }];
      // @ts-ignore
      mockedOrderRepo.findByUser.mockResolvedValueOnce(orders as never);

      const result = await OrderService.listOrders("user-123", "customer");

      expect(mockedOrderRepo.findByUser).toHaveBeenCalledWith("user-123");
      expect(result).toEqual(orders);
    });
  });

  describe("payOrder", () => {
    it("throws 400 for invalid id", async () => {
      await expect(OrderService.payOrder(undefined)).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });
});
