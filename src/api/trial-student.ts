import api from "@/config/api";
import { TrialStudent } from "@/interfaces/trial-student";

export const getTrialStudents = async (): Promise<TrialStudent[]> => {
  const { data } = await api.get("api/v1/trial-students");
  return data?.list || [];
};

export const deleteTrialStudent = async (id: string): Promise<void> => {
  const { data } = await api.delete(`api/v1/trial-students/${id}`);
  return data;
};

export const createTrialStudent = async (trialStudent: TrialStudent): Promise<TrialStudent> => {
  const { data } = await api.post("api/v1/trial-students", trialStudent);
  return data;
};

export const updateTrialStudent = async (id: string, trialStudent: TrialStudent): Promise<TrialStudent> => {
  const { data } = await api.patch(`api/v1/trial-students/${id}`, trialStudent);
  return data;
};

// V2 Endpoints
export const getPendingTrialStudents = async (): Promise<{
  count: number;
  data: TrialStudent[];
}> => {
  const { data } = await api.get("api/v2/trial-students/pending");
  return data;
};

export const updateTrialStudentStatus = async (
  id: string,
  status: string
): Promise<TrialStudent> => {
  const { data } = await api.patch(`api/v2/trial-students/${id}/status`, { status });
  return data;
};
