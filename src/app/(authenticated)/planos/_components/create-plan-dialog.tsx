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

import { PlanSchema, planSchema } from "../schemas/plan-schema";
import PlanForm from "./plan-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPlan } from "@/api/plan";

export function CreatePlanDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const planForm = useForm<PlanSchema>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      weeklyClasses: 1,
      durationInDays: 30,
      isSecondary: false,
      price: '',
    },
  });

  const {
    mutate: createPlanMutation,
    isPending,
  } = useMutation({
    mutationKey: ["createPlan"],
    mutationFn: async (data: PlanSchema) => await createPlan(data),
    onSuccess: () => {
      toast.success("Plano criado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao criar plano");
    },
  });

  const handleSubmit = (data: PlanSchema) => createPlanMutation(data);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) planForm.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Novo Plano
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-2xl gap-8 max-h-[90vh] min-h-[80vh] overflow-y-auto">
        <DialogHeader className="h-fit">
          <DialogTitle>Novo Plano</DialogTitle>
        </DialogHeader>
        <PlanForm
          form={planForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
