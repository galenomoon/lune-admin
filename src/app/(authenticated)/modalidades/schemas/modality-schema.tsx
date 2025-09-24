import { z } from "zod";

const message = "Este campo é obrigatório";

export const modalitySchema = z.object({
  name: z.string().nonempty(message),
});

export type ModalitySchema = z.infer<typeof modalitySchema>;