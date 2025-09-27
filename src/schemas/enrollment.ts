import { z } from "zod";

export const personalDataSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  cpf: z.string().min(1, "CPF é obrigatório"),
  rg: z.string().optional(),
  phone: z.string().min(1, "Telefone é obrigatório"),
  instagram: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  obs: z.string().optional(),
});

export const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  state: z.string().min(1, "Estado é obrigatório"),
  complement: z.string().optional(),
  cep: z.string().min(1, "CEP é obrigatório"),
});

export const enrollmentSchema = z.object({
  startDate: z.string().min(1, "Data de início é obrigatória"),
  planId: z.string().min(1, "Plano é obrigatório"),
  paymentDay: z.string().min(1, "Dia de pagamento é obrigatório"),
  classId: z.string().min(1, "Turma é obrigatória"),
  modalityId: z.string().min(1, "Modalidade é obrigatória"),
  signature: z.string().min(1, "Assinatura é obrigatória"),
});

export type PersonalDataSchema = z.infer<typeof personalDataSchema>;
export type AddressSchema = z.infer<typeof addressSchema>;
export type EnrollmentSchema = z.infer<typeof enrollmentSchema>;
