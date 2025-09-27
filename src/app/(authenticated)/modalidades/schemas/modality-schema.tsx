import { z } from "zod";

export const modalitySchema = z.object({
  name: z.string().min(1, "Nome da modalidade é obrigatório"),
});

export type ModalitySchema = z.infer<typeof modalitySchema>;