"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ExpenseSchema, expenseSchema } from "../schemas/expense-schema";
import ExpenseForm from "./expense-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createExpense } from "@/api/expense";

export function CreateExpenseDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const expenseForm = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: "",
      description: "",
      amount: "",
      dueDay: "",
    },
  });

  const {
    mutate: createExpenseMutation,
    isPending,
  } = useMutation({
    mutationKey: ["createExpense"],
    mutationFn: async (data: ExpenseSchema) => await createExpense(data),
    onSuccess: () => {
      toast.success("Despesa criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao criar despesa");
    },
  });

  const handleSubmit = (data: ExpenseSchema) => createExpenseMutation(data);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) expenseForm.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Nova Despesa
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-2xl gap-8 max-h-[90vh] min-h-[80vh] overflow-y-auto">
        <DialogHeader className="h-fit">
          <DialogTitle>Nova Despesa</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          form={expenseForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

