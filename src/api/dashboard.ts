import api from "@/config/api";

export const getDashboard = async (month?: number, year?: number) => {
  const params = new URLSearchParams();
  if (month) params.append("month", month.toString());
  if (year) params.append("year", year.toString());

  const { data } = await api.get(`/api/v2/payments/dashboard/stats`, {
    params,
  });
  return data;
};
