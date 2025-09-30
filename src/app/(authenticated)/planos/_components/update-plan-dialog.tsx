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
import { Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PlanSchema, planSchema } from "../schemas/plan-schema";
import PlanForm from "./plan-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePlan, updatePlan } from "@/api/plan";
import { PlanTable } from "@/interfaces/plan";

type UpdatePlanDialogProps = {
  plan: PlanTable;
};

export function UpdatePlanDialog({ plan }: UpdatePlanDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const planForm = useForm<PlanSchema>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: plan.name || "",
      weeklyClasses: plan.weeklyClasses || 1,
      durationInDays: plan.durationInDays || 30,
      isSecondary: !!plan.isSecondary || false,
      price: plan?.price?.toFixed(2) || "",
    },
    values: {
      name: plan.name || "",
      weeklyClasses: plan.weeklyClasses || 1,
      durationInDays: plan.durationInDays || 30,
      isSecondary: !!plan.isSecondary || false,
      price: plan?.price?.toFixed(2) || "",
    },
  });

  const { mutate: updatePlanMutation, isPending } = useMutation({
    mutationKey: ["updatePlan", plan.id],
    mutationFn: async (data: PlanSchema) => await updatePlan(plan.id, data),
    onSuccess: () => {
      toast.success("Plano atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar plano");
    },
  });

  const { mutate: deletePlanMutation, isPending: isDeletePending } =
    useMutation({
      mutationKey: ["deletePlan", plan.id],
      mutationFn: async () => await deletePlan(plan.id),
      onSuccess: () => {
        toast.success("Plano deletado com sucesso");
        queryClient.invalidateQueries({ queryKey: ["plans"] });
        setOpen(false);
      },
      onError: () => {
        toast.error("Erro ao deletar plano");
      },
    });

  const handleSubmit = (data: PlanSchema) => updatePlanMutation(data);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        if (!isOpen) {
          planForm.reset({
            name: plan.name || "",
            weeklyClasses: plan.weeklyClasses || 1,
            durationInDays: plan.durationInDays || 30,
            isSecondary: !!plan.isSecondary || false,
            price: (plan.price).toString() || "",
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-blue-500 text-blue-500 bg-blue-50"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-2xl gap-8 max-h-[90vh] min-h-[80vh] overflow-y-auto">
        <DialogHeader className="h-fit">
          <DialogTitle>Editar Plano</DialogTitle>
        </DialogHeader>
        <PlanForm
          form={planForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onDelete={() => deletePlanMutation()}
          onDeleteLoading={isDeletePending}
        />
      </DialogContent>
    </Dialog>
  );
}
