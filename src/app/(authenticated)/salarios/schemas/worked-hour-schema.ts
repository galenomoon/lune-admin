import { z } from "zod";

export const updateWorkedHourTeacherSchema = z.object({
  teacherId: z.string().min(1, "Professor é obrigatório"),
});

export const updateWorkedHourStatusSchema = z.object({
  status: z.enum(["PENDING", "DONE", "APPROVED", "REJECTED", "CANCELED"]),
});

export type UpdateWorkedHourTeacherSchema = z.infer<typeof updateWorkedHourTeacherSchema>;
export type UpdateWorkedHourStatusSchema = z.infer<typeof updateWorkedHourStatusSchema>;


