"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import WorkedHourForm from "./worked-hour-form";
import api from "@/config/api";

interface CreateWorkedHourDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: number;
  selectedYear: number;
}

interface WorkedHourFormData {
  teacherId: string;
  modalityId: string;
  classId: string;
  workedAt: Date;
  newEnrollmentsCount: number;
  status?: "PENDING" | "DONE" | "CANCELED";
}

interface CreateWorkedHourApiData {
  teacherId: string;
  classId: string;
  workedAt: string;
  newEnrollmentsCount: number;
  status?: "PENDING" | "DONE" | "CANCELED";
}

export default function CreateWorkedHourDialog({
  isOpen,
  onClose,
  selectedMonth,
  selectedYear,
}: CreateWorkedHourDialogProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CreateWorkedHourApiData) => {
      const response = await api.post("/api/v1/worked-hours", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Registro criado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["worked-hours", selectedMonth, selectedYear],
      });
      onClose();
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(error?.response?.data?.message || "Erro ao criar registro");
    },
  });

  const handleSubmit = (data: WorkedHourFormData) => {
    const apiData: CreateWorkedHourApiData = {
      teacherId: data.teacherId,
      classId: data.classId,
      workedAt: data.workedAt.toISOString(),
      newEnrollmentsCount: data.newEnrollmentsCount,
      status: data.status || "DONE",
    };
    createMutation.mutate(apiData);
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
