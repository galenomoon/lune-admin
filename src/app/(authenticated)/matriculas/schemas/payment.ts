import { z } from "zod";

export const paymentSchema = z.object({
  dueDate: z.string(),
  amount: z.string(),
});

export type PaymentSchema = z.infer<typeof paymentSchema>;
