import { z } from "zod";

export const trialStudentSchema = z.object({
  lead: z.object({
    firstName: z.string().min(1, "Nome é obrigatório"),
    lastName: z.string().min(1, "Sobrenome é obrigatório"),
    phone: z.string().min(1, "Telefone é obrigatório"),
    instagram: z.string().optional(),
  }),
  gridItem: z.object({
    id: z.string(),
    dayOfWeek: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  }),
  modalityId: z.string().min(1, "Modalidade é obrigatória"),
  classId: z.string().min(1, "Turma é obrigatória"),
  dates: z.array(z.string()).min(1, "Selecione pelo menos uma data"),
});

export type TrialStudentSchema = z.infer<typeof trialStudentSchema>;