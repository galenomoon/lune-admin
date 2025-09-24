import { z } from "zod";

export const personalDataSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.string(),
  cpf: z.string(),
  rg: z.string(),
  phone: z.string(),
  instagram: z.string(),
  email: z.string().email(),
  obs: z.string(),
});

export const addressSchema = z.object({
  street: z.string(),
  number: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  state: z.string(),
  complement: z.string().optional(),
  cep: z.string(),
});

export const enrollmentSchema = z.object({
  startDate: z.string(),
  planId: z.string(),
  paymentDay: z.string(),
  classId: z.string(),
  signature: z.string(),
});

export type PersonalDataSchema = z.infer<typeof personalDataSchema>;
export type AddressSchema = z.infer<typeof addressSchema>;
export type EnrollmentSchema = z.infer<typeof enrollmentSchema>;
