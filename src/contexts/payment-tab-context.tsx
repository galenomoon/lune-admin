"use client";
import {
  deletePayment,
  togglePaymentStatus,
  updatePayment,
} from "@/api/payment";
import { Payment } from "@/interfaces/payment";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface PaymentTabContextType {
  isEditingPayment: boolean;
  openEditPaymentForm: (payment: Payment) => void;
  closeEditPaymentForm: () => void;
  currentPayment: Payment | null;
  togglePaymentStatusMutation: UseMutationResult<void, Error, Payment>;
  updatePaymentMutation: UseMutationResult<void, Error, Payment>;
  deletePaymentMutation: UseMutationResult<void, Error, Payment>;
}

export const PaymentTabContext = createContext<PaymentTabContextType>({
  isEditingPayment: false,
  openEditPaymentForm: () => {},
  closeEditPaymentForm: () => {},
  currentPayment: null,
  togglePaymentStatusMutation: {} as UseMutationResult<void, Error, Payment>,
  updatePaymentMutation: {} as UseMutationResult<void, Error, Payment>,
  deletePaymentMutation: {} as UseMutationResult<void, Error, Payment>,
});

export const PaymentTabProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [isEditingPayment, setIsEditingPayment] = useState(false);

  const queryClient = useQueryClient();

  const togglePaymentStatusMutation = useMutation({
    mutationKey: ["toggle-payment"],
    mutationFn: (payment: Payment) => togglePaymentStatus(payment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"]});      
      queryClient.invalidateQueries({ queryKey: ["students"]});      
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"]});

      toast.success("Pagamento atualizado com sucesso");
    },
    onError: () => toast.error("Erro ao atualizar pagamento"),
  });

  const updatePaymentMutation = useMutation({
    mutationKey: ["update-payment"],
    mutationFn: (payment: Payment) =>
      updatePayment(payment.id, {
        amount: payment.amount,
        dueDate: payment.dueDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"]});      
      queryClient.invalidateQueries({ queryKey: ["students"]});      
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"]});
      toast.success("Pagamento atualizado com sucesso");
      closeEditPaymentForm();
    },
    onError: () => toast.error("Erro ao atualizar pagamento"),
  });

  const deletePaymentMutation = useMutation({
    mutationKey: ["delete-payment"],
    mutationFn: (payment: Payment) => deletePayment(payment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"]});      
      queryClient.invalidateQueries({ queryKey: ["students"]});      
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"]});
      closeEditPaymentForm();
      toast.success("Pagamento deletado com sucesso");
    },
    onError: () => toast.error("Erro ao deletar pagamento"),
  });

  const openEditPaymentForm = (payment: Payment) => {
    setCurrentPayment(payment);
    setIsEditingPayment(true);
  };

  const closeEditPaymentForm = () => {
    setIsEditingPayment(false);
    setCurrentPayment(null);
  };

  return (
    <PaymentTabContext.Provider
      value={{
        isEditingPayment,
        openEditPaymentForm,
        closeEditPaymentForm,
        currentPayment,
        updatePaymentMutation,
        deletePaymentMutation,
        togglePaymentStatusMutation,
      }}
    >
      {children}
    </PaymentTabContext.Provider>
  );
};

export const usePaymentTab = () => {
  return useContext(PaymentTabContext);
};
