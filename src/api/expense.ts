import { ExpenseSchema } from "@/app/(authenticated)/despesas/schemas/expense-schema";
import api from "@/config/api";
import { Expense } from "@/interfaces/expense";
import { currencyToFloat } from "@/utils/parse-currency";

export const getExpenses = async () => {
  const { data } = await api.get<Expense[]>("api/v1/expenses", {});
  return data;
};

export const createExpense = async (expense: ExpenseSchema) => {
  const parsedExpense = {
    ...expense,
    amount: currencyToFloat(expense.amount),
    dueDay: Number(expense.dueDay),
  };
  const { data } = await api.post<Expense>("api/v1/expenses", parsedExpense);
  return data;
};

export const updateExpense = async (id: string, expense: ExpenseSchema) => {
  const parsedExpense = {
    ...expense,
    amount: currencyToFloat(expense.amount),
    dueDay: Number(expense.dueDay),
  };
  const { data } = await api.patch<Expense>(`api/v1/expenses/${id}`, parsedExpense);
  return data;
};

export const deleteExpense = async (id: string) => {
  const { data } = await api.delete<Expense>(`api/v1/expenses/${id}`);
  return data;
};

export const payExpense = async (id: string) => {
  const { data } = await api.patch<Expense>(`api/v1/expenses/${id}/pay`);
  return data;
};

export const unpayExpense = async (id: string) => {
  const { data } = await api.patch<Expense>(`api/v1/expenses/${id}/unpay`);
  return data;
};

export const getPendingExpenses = async (): Promise<{ count: number }> => {
  const { data } = await api.get("/api/v1/expenses/pending/count");
  return data;
};

