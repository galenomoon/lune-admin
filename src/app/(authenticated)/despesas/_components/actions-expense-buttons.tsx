"use client";
import { Button } from "@/components/ui/button";
import { Expense } from "@/interfaces/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { payExpense, unpayExpense } from "@/api/expense";

export default function ActionsExpenseButtons({
  expense,
}: {
  expense: Expense;
}) {
  const queryClient = useQueryClient();

  const { mutate: payMutation, isPending: isPayPending } = useMutation({
    mutationKey: ["payExpense", expense.id],
    mutationFn: async () => await payExpense(expense.id),
    onSuccess: () => {
      toast.success("Despesa marcada como paga");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => {
      toast.error("Erro ao marcar despesa como paga");
    },
  });

  const { mutate: unpayMutation, isPending: isUnpayPending } = useMutation({
    mutationKey: ["unpayExpense", expense.id],
    mutationFn: async () => await unpayExpense(expense.id),
    onSuccess: () => {
      toast.success("Despesa desmarcada como paga");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => {
      toast.error("Erro ao desmarcar despesa");
    },
  });

  if (expense.status === "PAID") {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => unpayMutation()}
        disabled={isUnpayPending}
      >
        <XCircle className="size-4 text-red-500" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => payMutation()}
      disabled={isPayPending}
    >
      <CheckCircle2 className="size-4 text-green-500" />
    </Button>
  );
}

