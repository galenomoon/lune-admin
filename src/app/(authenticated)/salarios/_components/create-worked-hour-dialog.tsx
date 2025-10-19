"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import WorkedHourForm from "./worked-hour-form";
import api from "@/config/api";

interface CreateWorkedHourDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: number;
  selectedYear: number;
}

export default function CreateWorkedHourDialog({
  isOpen,
  onClose,
  selectedMonth,
  selectedYear,
}: CreateWorkedHourDialogProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/api/v1/worked-hours", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Registro criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["worked-hours", selectedMonth, selectedYear] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erro ao criar registro");
    },
  });

  const handleSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Registro de Aula</DialogTitle>
        </DialogHeader>
        <WorkedHourForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={createMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}


