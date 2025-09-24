import api from "@/config/api";

export const togglePaymentStatus = async (paymentId: string) => {
  const { data } = await api.post("api/v1/payments/toggle/" + paymentId);
  return data;
};

export const updatePayment = async (
  paymentId: string,
  payload: { amount: number; dueDate: Date }
) => {
  const { data } = await api.patch("api/v1/payments/" + paymentId, payload);
  return data;
};
