import { z } from "zod";

export const paymentSchema = z.object({
  dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
  amount: z.string().min(1, "Valor é obrigatório"),
});

export type PaymentSchema = z.infer<typeof paymentSchema>;
