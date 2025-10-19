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
import { updateWorkedHour, deleteWorkedHour, UpdateWorkedHourData } from "@/api/worked-hours";
import { WorkedHour } from "@/interfaces/worked-hours";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface UpdateWorkedHourDialogProps {
  workedHour: WorkedHour | null;
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

export default function UpdateWorkedHourDialog({
  workedHour,
  onClose,
  selectedMonth,
  selectedYear,
}: UpdateWorkedHourDialogProps) {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateWorkedHourData) => {
      if (!workedHour?.id) throw new Error("ID not found");
      return await updateWorkedHour(workedHour.id, data);
    },
    onSuccess: () => {
      toast.success("Registro atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["worked-hours", selectedMonth, selectedYear] });
      onClose();
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "Erro ao atualizar registro");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!workedHour?.id) throw new Error("ID not found");
      return await deleteWorkedHour(workedHour.id);
    },
    onSuccess: () => {
      toast.success("Registro deletado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["worked-hours", selectedMonth, selectedYear] });
      setIsDeleteDialogOpen(false);
      onClose();
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "Erro ao deletar registro");
    },
  });

  const handleSubmit = (data: WorkedHourFormData) => {
    const updateData: UpdateWorkedHourData = {
      workedAt: data.workedAt.toISOString(),
      status: data.status,
      teacherId: data.teacherId,
    };
    updateMutation.mutate(updateData);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (!workedHour) return null;

  return (
    <>
      <Dialog open={!!workedHour} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Registro de Aula</DialogTitle>
          </DialogHeader>
          <WorkedHourForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={updateMutation.isPending}
            defaultValues={{
              teacherId: workedHour.teacherId,
              modalityId: "", // Será preenchido automaticamente pelo form
              classId: "", // Será preenchido pelo classId do workedHour
              workedAt: new Date(workedHour.workedAt),
              newEnrollmentsCount: workedHour.newEnrollmentsCount,
              status: workedHour.status,
            }}
            onDelete={() => setIsDeleteDialogOpen(true)}
            isDeleting={deleteMutation.isPending}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este registro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

