import api from "@/config/api";

export const cancelEnrollment = async (enrollmentId: string) => {
  const { data } = await api.post("enrollment/cancel/" + enrollmentId);
  return data;
};