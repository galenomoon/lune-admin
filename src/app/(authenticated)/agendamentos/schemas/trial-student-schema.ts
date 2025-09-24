import { z } from "zod";

const message = "Este campo é obrigatório";

export const trialStudentSchema = z.object({
  lead: z.object({
    firstName: z.string().nonempty(message),
    lastName: z.string().nonempty(message),
    phone: z.string().nonempty(message),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    cpf: z.string().optional().or(z.literal("")),
  }),
  gridItem: z.object({
    dayOfWeek: z.string().nonempty(message),
    startTime: z.string().nonempty(message),
    endTime: z.string().nonempty(message),
    class: z.object({
      name: z.string().nonempty(message),
      description: z.string().optional().or(z.literal("")),
      modalityId: z.string().nonempty(message),
      teacherId: z.string().optional().or(z.literal("")),
      classLevelId: z.string().nonempty(message),
      maxStudents: z.number().min(1, "Máximo de alunos deve ser pelo menos 1"),
    }),
  }),
  date: z.string().nonempty(message),
});

export type TrialStudentSchema = z.infer<typeof trialStudentSchema>;

