import { PlanSchema } from "@/app/(authenticated)/planos/schemas/plan-schema";
import api from "@/config/api";
import { PlanTable } from "@/interfaces/plan";
import { currencyToFloat } from "@/utils/parse-currency";

export const getPlans = async () => {
  const { data } = await api.get<PlanTable[]>("api/v1/plans", {});
  return data;
};

export const createPlan = async (plan: PlanSchema) => {
  const parsedPlan = {  
    ...plan,
    price: currencyToFloat(plan.price),
  };
  const { data } = await api.post<PlanTable>("api/v1/plans", parsedPlan);
  return data;
};

export const updatePlan = async (id: string, plan: PlanSchema) => {
  const parsedPlan = {
    ...plan,
    price: parseFloat(plan.price),
  };

  const { data } = await api.patch<PlanTable>(`api/v1/plans/${id}`, parsedPlan);
  return data;
};

export const deletePlan = async (id: string) => {
  const { data } = await api.delete<PlanTable>(`api/v1/plans/${id}`);
  return data;
};
