import { z } from "zod";

export const gridItemSchema = z.object({
  dayOfWeek: z.string().min(1, "Dia da semana é obrigatório"),
  startTime: z.string().min(1, "Horário de início é obrigatório"),
  endTime: z.string().min(1, "Horário de fim é obrigatório"),
});

export const gridFormSchema = z.object({
  class: z.object({
    id: z.string().optional(),
    maxStudents: z.number().min(1, "Quantidade máxima de alunos deve ser pelo menos 1"),
    modalityId: z.string().min(1, "Modalidade é obrigatória"),
    classLevelId: z.string().min(1, "Nível é obrigatório"),
    teacherId: z.string().min(1, "Professor é obrigatório"),
    description: z.string().min(1, "Faixa etária é obrigatória"),
  }),
  gridItems: z.array(gridItemSchema).min(1, "Pelo menos um horário é obrigatório"),
});

export type GridFormSchema = z.infer<typeof gridFormSchema>;
export type GridItemSchema = z.infer<typeof gridItemSchema>;
