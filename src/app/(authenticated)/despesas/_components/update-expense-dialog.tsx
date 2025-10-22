"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ExpenseSchema, expenseSchema } from "../schemas/expense-schema";
import ExpenseForm from "./expense-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteExpense, updateExpense } from "@/api/expense";
import { Expense } from "@/interfaces/expense";

export function UpdateExpenseDialog({ expense }: { expense: Expense }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const expenseForm = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: expense.name,
      description: expense.description || "",
      amount: expense.amount.toString(),
      dueDay: expense.dueDay.toString(),
    },
  });

  useEffect(() => {
    if (open) {
      expenseForm.reset({
        name: expense.name,
        description: expense.description || "",
        amount: expense.amount.toString(),
        dueDay: expense.dueDay.toString(),
      });
    }
  }, [open, expense, expenseForm]);

  const {
    mutate: updateExpenseMutation,
    isPending: isUpdating,
  } = useMutation({
    mutationKey: ["updateExpense"],
    mutationFn: async (data: ExpenseSchema) => 
      await updateExpense(expense.id, data),
    onSuccess: () => {
      toast.success("Despesa atualizada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar despesa");
    },
  });

  const {
    mutate: deleteExpenseMutation,
    isPending: isDeleting,
  } = useMutation({
    mutationKey: ["deleteExpense"],
    mutationFn: async () => await deleteExpense(expense.id),
    onSuccess: () => {
      toast.success("Despesa deletada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao deletar despesa");
    },
  });

  const handleSubmit = (data: ExpenseSchema) => updateExpenseMutation(data);
  const handleDelete = () => deleteExpenseMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-2xl gap-8 max-h-[90vh] min-h-[80vh] overflow-y-auto">
        <DialogHeader className="h-fit">
          <DialogTitle>Editar Despesa</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          form={expenseForm}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          onDelete={handleDelete}
          onDeleteLoading={isDeleting}
        />
      </DialogContent>
    </Dialog>
  );
}

