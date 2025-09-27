import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres").min(1, "Senha é obrigatória"),
});

export type LoginSchema = z.infer<typeof loginSchema>;