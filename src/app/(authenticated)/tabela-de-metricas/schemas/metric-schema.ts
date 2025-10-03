import { z } from "zod";

export const metricSchema = z.object({
  format: z.enum(["reels", "carousel", "static-photo", "live"], {
    required_error: "Formato é obrigatório",
  }),
  duration: z.number().min(0, "Duração deve ser maior ou igual a 0").optional(),
  quantity: z.number().min(1, "Quantidade deve ser pelo menos 1").optional(),
  title: z.string().min(1, "Título é obrigatório"),
  postDate: z.string().min(1, "Data de postagem é obrigatória"),
  reach: z.number().min(0, "Alcance deve ser maior ou igual a 0"),
  saves: z.number().min(0, "Salvamentos deve ser maior ou igual a 0"),
  shares: z.number().min(0, "Compartilhamento deve ser maior ou igual a 0"),
  likes: z.number().min(0, "Likes deve ser maior ou igual a 0"),
  comments: z.number().min(0, "Comentários deve ser maior ou igual a 0"),
  reposts: z.number().min(0, "Repost deve ser maior ou igual a 0"),
  linkClicks: z.number().min(0, "Cliques no link deve ser maior ou igual a 0"),
}).refine((data) => {
  // Conditional validation: if format is carousel, quantity is required
  if (data.format === "carousel" && (!data.quantity || data.quantity < 1)) {
    return false;
  }
  // If format is reels, live or video, duration is required
  if (["reels", "live"].includes(data.format) && (!data.duration || data.duration < 1)) {
    return false;
  }
  return true;
}, {
  message: "Formato inválido: carrossel precisa de quantidade, reels/live precisam de duração",
  path: ["format"],
});

export type MetricSchema = z.infer<typeof metricSchema>;
