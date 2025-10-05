import { z } from "zod";

export const planSchema = z.object({
  name: z.string().min(1, "Nome do plano é obrigatório"),
  weeklyClasses: z.number().min(1, "Deve ser pelo menos 1 aula por semana"),
  durationInDays: z.number().min(1, "Duração deve ser pelo menos 1 dia"),
  isSecondary: z.boolean(),
  price: z.string().min(1, "Preço é obrigatório")
});

export type PlanSchema = z.infer<typeof planSchema>;
