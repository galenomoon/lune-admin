import api from "@/config/api";

export const getEnrollmentByToken = async (token: string) => {
  const { data } = await api.get(`/api/v1/contracts/${token}`);
  return data;
};

export const sendSignature = async ({ token, signature }: { token: string; signature: string }) => {
  const { data } = await api.post(`/api/v1/contracts/sign/${token}`, { signature });
  return data;
};
