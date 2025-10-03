import api from "@/config/api";
import { PersonalDataSchema } from "@/schemas/enrollment";
import { 
  CreateEnrollmentPayload,
  UpdateEnrollmentData 
} from "@/interfaces/enrollment";

export const cancelEnrollment = async (enrollmentId: string) => {
  const { data } = await api.post("/api/v1/enrollment/cancel/" + enrollmentId);
  return data;
};

export const createEnrollment = async (enrollmentData: CreateEnrollmentPayload) => {
  const { data } = await api.post("/api/v1/enrollment", enrollmentData);
  return data;
};

export const updateEnrollment = async (enrollmentId: string, updateData: UpdateEnrollmentData) => {
  const { data } = await api.patch(`/api/v1/enrollment/${enrollmentId}`, updateData);
  return data;
};

export const renewEnrollment = async (enrollmentId: string, planId: string) => {
  const { data } = await api.post(`/api/v1/enrollment/renew/${enrollmentId}`, { planId });
  return data;
};

export const updateStudent = async (studentId: string, studentData: Partial<PersonalDataSchema>) => {
  const { data } = await api.patch(`/api/v1/students/${studentId}`, studentData);
  return data;
};

export const generateSignatureLink = async (enrollmentId: string) => {
  const { data } = await api.post(`/api/v1/contracts/generate-link/${enrollmentId}`);
  return data;
};