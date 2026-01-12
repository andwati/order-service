import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          quantity: z.number().int().positive(),
        }),
      )
      .min(1),
  }),
});

export const orderIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
