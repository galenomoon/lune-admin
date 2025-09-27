import { z } from "zod";

export const teacherSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  cpf: z.string().min(1, "CPF é obrigatório"),
  rg: z.string().optional(),
  phone: z.string().min(1, "Telefone é obrigatório"),
  instagram: z.string().optional(),
  priceHour: z.string().min(1, "Preço por hora é obrigatório"),
  pixKey: z.string().min(1, "Chave PIX é obrigatória"),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;