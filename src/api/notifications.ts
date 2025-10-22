import api from "@/config/api";

export interface PendingNotifications {
  trialStudents: number;
  workedHours: number;
  expenses: number;
  total: number;
}

export const getPendingNotifications = async (): Promise<PendingNotifications> => {
  const { data } = await api.get("/api/v1/notifications/pending");
  return data;
};

