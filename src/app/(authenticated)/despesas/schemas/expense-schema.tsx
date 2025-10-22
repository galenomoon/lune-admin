import { z } from "zod";

export const expenseSchema = z.object({
  name: z.string().min(1, "Nome da despesa é obrigatório"),
  description: z.string().optional(),
  amount: z.string().min(1, "Valor é obrigatório"),
  dueDay: z.string().min(1, "Dia do vencimento é obrigatório"),
});

export type ExpenseSchema = z.infer<typeof expenseSchema>;

