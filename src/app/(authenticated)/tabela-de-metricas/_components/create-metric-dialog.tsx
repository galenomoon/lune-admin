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

import { MetricSchema, metricSchema } from "../schemas/metric-schema";
import MetricForm from "./metric-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function CreateMetricDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const metricForm = useForm<MetricSchema>({
    resolver: zodResolver(metricSchema),
    defaultValues: {
      format: "reels",
      duration: undefined,
      quantity: undefined,
      title: "",
      postDate: new Date().toISOString(),
      reach: 0,
      saves: 0,
      shares: 0,
      likes: 0,
      comments: 0,
      reposts: 0,
      linkClicks: 0,
    },
  });

  const {
    mutate: createMetricMutation,
    isPending,
  } = useMutation({
    mutationKey: ["createMetric"],
    mutationFn: async (data: MetricSchema) => {
      // Simular API call - em produção seria uma chamada real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Auto-calculate metrics
      const totalEngagement = data.likes + data.shares + data.comments + data.reposts + data.saves;
      const engagement = data.reach > 0 ? (totalEngagement / data.reach) * 100 : 0;
      const ctr = data.reach > 0 ? (data.linkClicks / data.reach) * 100 : 0;
      
      const newMetric = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        engagement: Number(engagement.toFixed(2)),
        ctr: Number(ctr.toFixed(2)),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newMetric;
    },
    onSuccess: () => {
      toast.success("Métrica criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao criar métrica");
    },
  });

  const handleSubmit = (data: MetricSchema) => createMetricMutation(data);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) metricForm.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Nova Métrica
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-2xl gap-8 max-h-[90vh] min-h-[80vh] overflow-y-auto">
        <DialogHeader className="h-fit">
          <DialogTitle>Nova Métrica</DialogTitle>
        </DialogHeader>
        <MetricForm
          form={metricForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
