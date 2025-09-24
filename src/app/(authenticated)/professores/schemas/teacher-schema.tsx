import { z } from "zod";

const message = "Este campo é obrigatório";

export const teacherSchema = z.object({
  firstName: z.string().nonempty(message),
  lastName: z.string().nonempty(message),
  birthDate: z.string().nonempty(message),
  cpf: z.string().nonempty(message),
  rg: z.string().optional(),
  phone: z.string().nonempty(message),
  instagram: z.string().optional(),
  priceHour: z.string().nonempty(message),
  pixKey: z.string().nonempty(message),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;