import { z } from "zod";

const message = "Este campo é obrigatório";

export const planSchema = z.object({
  name: z.string().nonempty(message),
  weeklyClasses: z.number().min(1, "Deve ser pelo menos 1 aula por semana"),
  durationInDays: z.number().min(1, "Duração deve ser pelo menos 1 dia"),
  isSecondary: z.boolean(),
  price: z.string()
});

export type PlanSchema = z.infer<typeof planSchema>;
