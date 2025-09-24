import api from "@/config/api";
import { TrialStudent } from "@/interfaces/trial-student";

export const getTrialStudents = async (): Promise<TrialStudent[]> => {
  const { data } = await api.get("api/v1/trial-students");
  return data?.list || [];
};
