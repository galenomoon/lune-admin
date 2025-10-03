import { z } from "zod";

export const signatureSchema = z.object({
  signature: z.string().min(1, "Assinatura é obrigatória"),
});

export type SignatureSchema = z.infer<typeof signatureSchema>;
