import { z } from "zod";

export const settingsSchema = z.object({
  trialClassPrice: z.string().min(1, "Valor da aula avulsa é obrigatório"),
  teacherCommissionPerEnrollment: z.string().min(1, "Comissão por matrícula é obrigatória"),
  teacherCommissionPerTrialClass: z.string().min(1, "Comissão por aula avulsa é obrigatória"),
});

export type SettingsSchema = z.infer<typeof settingsSchema>;

