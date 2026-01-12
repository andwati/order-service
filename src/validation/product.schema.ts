import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    price: z.number().int().positive(),
    stock: z.number().int().nonnegative(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z
    .object({
      name: z.string().min(1),
      price: z.number().int().positive(),
      stock: z.number().int().nonnegative(),
    })
    .partial(),
});
