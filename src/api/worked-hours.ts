import api from "@/config/api";
import { WorkedHoursResponse, TeacherSalaryResponse } from "@/interfaces/worked-hours";

export const getWorkedHours = async (
  month: number,
  year: number
): Promise<WorkedHoursResponse> => {
  const { data } = await api.get("/api/v1/worked-hours", {
    params: { month, year },
  });
  return data;
};

export const getWorkedHoursByTeacher = async (
  month: number,
  year: number
): Promise<TeacherSalaryResponse> => {
  const { data } = await api.get("/api/v1/worked-hours/by-teacher", {
    params: { month, year },
  });
  return data;
};

export interface UpdateWorkedHourData {
  workedAt?: string;
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  teacherId?: string;
  priceSnapshot?: number;
  status?: "PENDING" | "DONE" | "CANCELED";
}

export const updateWorkedHour = async (
  id: string,
  updateData: UpdateWorkedHourData
): Promise<void> => {
  await api.patch(`/api/v1/worked-hours/${id}`, updateData);
};

export const deleteWorkedHour = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/worked-hours/${id}`);
};

export const getPendingWorkedHours = async (): Promise<{ count: number }> => {
  const { data } = await api.get("/api/v1/worked-hours/pending/count");
  return data;
};

