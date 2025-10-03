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

import { MetricSchema, metricSchema } from "../schemas/metric-schema";
import MetricForm from "./metric-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MetricTable } from "@/interfaces/metrics";

type UpdateMetricDialogProps = {
  metric: MetricTable;
};

export function UpdateMetricDialog({ metric }: UpdateMetricDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const metricForm = useForm<MetricSchema>({
    resolver: zodResolver(metricSchema),
    defaultValues: {
      format: metric.format,
      duration: metric.duration,
      quantity: metric.quantity,
      title: metric.title,
      postDate: metric.postDate,
      reach: metric.reach,
      saves: metric.saves,
      shares: metric.shares,
      likes: metric.likes,
      comments: metric.comments,
      reposts: metric.reposts,
      linkClicks: metric.linkClicks,
    },
    values: {
      format: metric.format,
      duration: metric.duration,
      quantity: metric.quantity,
      title: metric.title,
      postDate: metric.postDate,
      reach: metric.reach,
      saves: metric.saves,
      shares: metric.shares,
      likes: metric.likes,
      comments: metric.comments,
      reposts: metric.reposts,
      linkClicks: metric.linkClicks,
    },
  });

  const { mutate: updateMetricMutation, isPending } = useMutation({
    mutationKey: ["updateMetric", metric.id],
    mutationFn: async (data: MetricSchema) => {
      // Simular API call - em produção seria uma chamada real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Auto-calculate metrics
      const totalEngagement = data.likes + data.shares + data.comments + data.reposts + data.saves;
      const engagement = data.reach > 0 ? (totalEngagement / data.reach) * 100 : 0;
      const ctr = data.reach > 0 ? (data.linkClicks / data.reach) * 100 : 0;
      
      const updatedMetric = {
        ...metric,
        ...data,
        engagement: Number(engagement.toFixed(2)),
        ctr: Number(ctr.toFixed(2)),
        updatedAt: new Date().toISOString(),
      };
      
      return updatedMetric;
    },
    onSuccess: () => {
      toast.success("Métrica atualizada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar métrica");
    },
  });

  const { mutate: deleteMetricMutation, isPending: isDeletePending } =
    useMutation({
      mutationKey: ["deleteMetric", metric.id],
      mutationFn: async () => {
        // Simular API call - em produção seria uma chamada real
        await new Promise(resolve => setTimeout(resolve, 1000));
        return metric.id;
      },
      onSuccess: () => {
        toast.success("Métrica deletada com sucesso");
        queryClient.invalidateQueries({ queryKey: ["metrics"] });
        setOpen(false);
      },
      onError: () => {
        toast.error("Erro ao deletar métrica");
      },
    });

  const handleSubmit = (data: MetricSchema) => updateMetricMutation(data);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        if (!isOpen) {
          metricForm.reset({
            format: metric.format,
            duration: metric.duration,
            quantity: metric.quantity,
            title: metric.title,
            postDate: metric.postDate,
            reach: metric.reach,
            saves: metric.saves,
            shares: metric.shares,
            likes: metric.likes,
            comments: metric.comments,
            reposts: metric.reposts,
            linkClicks: metric.linkClicks,
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
          <DialogTitle>Editar Métrica</DialogTitle>
        </DialogHeader>
        <MetricForm
          form={metricForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onDelete={() => deleteMetricMutation()}
          onDeleteLoading={isDeletePending}
        />
      </DialogContent>
    </Dialog>
  );
}
