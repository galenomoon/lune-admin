"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  TrialStudentSchema,
  trialStudentSchema,
} from "../schemas/trial-student-schema";
import TrialStudentForm from "./trial-student-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTrialStudent, updateTrialStudent } from "@/api/trial-student";
import { TrialStudent } from "@/interfaces/trial-student";

type UpdateTrialStudentDialogProps = {
  trialStudent: TrialStudent;
  onClose?: () => void;
};

export function UpdateTrialStudentDialog({
  trialStudent,
  onClose,
}: UpdateTrialStudentDialogProps) {
  const queryClient = useQueryClient();

  const trialStudentForm = useForm<TrialStudentSchema>({
    resolver: zodResolver(trialStudentSchema),
    values: {
      lead: {
        firstName: trialStudent?.lead?.firstName || "",
        lastName: trialStudent?.lead?.lastName || "",
        phone: trialStudent?.lead?.phone || "",
        instagram: trialStudent?.lead?.instagram || "",
      },
      gridItem: {
        id: trialStudent?.gridItem?.id || "",
        dayOfWeek: trialStudent?.gridItem?.dayOfWeek || "",
        startTime: trialStudent?.gridItem?.startTime || "",
        endTime: trialStudent?.gridItem?.endTime || "",
      },
      modalityId: trialStudent?.gridItem?.class?.modalityId || "",
      classId: trialStudent?.gridItem?.class?.id || "",
      dates: trialStudent?.date ? [trialStudent.date] : [],
    },
  });

  const { mutate: updateTrialStudentMutation, isPending } = useMutation({
    mutationKey: ["updateTrialStudent", trialStudent?.id],
    mutationFn: async (data: TrialStudentSchema) => {
      // Para update, usamos apenas a primeira data (não permitimos múltiplas datas na edição)
      const transformedData = {
        lead: {
          firstName: data.lead.firstName,
          lastName: data.lead.lastName,
          phone: data.lead.phone,
          instagram: data.lead.instagram,
          modalityOfInterest: data.modalityId,
          preferencePeriod: data.gridItem.startTime,
        },
        gridItem: {
          id: data.gridItem.id,
          dayOfWeek: data.gridItem.dayOfWeek,
          startTime: data.gridItem.startTime,
          endTime: data.gridItem.endTime,
          class: {
            id: data.classId,
            modalityId: data.modalityId,
          },
        },
        date: (() => {
          const date = new Date(data.dates[0]); // Usar a primeira data do array
          date.setHours(date.getHours() + 3); // Ajuste de timezone
          return date.toISOString();
        })(),
      };
      return await updateTrialStudent(
        trialStudent?.id,
        transformedData as unknown as TrialStudent
      );
    },
    onSuccess: () => {
      toast.success("Aula experimental atualizada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["trial-students"] });
      onClose?.();
    },
    onError: () => {
      toast.error("Erro ao atualizar aula experimental");
    },
  });

  const { mutate: deleteTrialStudentMutation, isPending: isDeletePending } =
    useMutation({
      mutationKey: ["deleteTrialStudent", trialStudent?.id],
      mutationFn: async () => await deleteTrialStudent(trialStudent?.id),
      onSuccess: () => {
        toast.success("Aula experimental deletada com sucesso");
        queryClient.invalidateQueries({ queryKey: ["trial-students"] });
        onClose?.();
      },
      onError: () => {
        toast.error("Erro ao deletar aula experimental");
      },
    });

  const handleSubmit = (data: TrialStudentSchema) =>
    updateTrialStudentMutation(data);

  const isOpen = !trialStudent ? false : true;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        onClose?.();

        if (!isOpen) {
          trialStudentForm.reset({
            lead: {
              firstName: trialStudent?.lead?.firstName || "",
              lastName: trialStudent?.lead?.lastName || "",
              phone: trialStudent?.lead?.phone || "",
              instagram: trialStudent?.lead?.instagram || "",
            },
            gridItem: {
              id: trialStudent?.gridItem?.id || "",
              dayOfWeek: trialStudent?.gridItem?.dayOfWeek || "",
              startTime: trialStudent?.gridItem?.startTime || "",
              endTime: trialStudent?.gridItem?.endTime || "",
            },
            modalityId: trialStudent?.gridItem?.class?.modalityId || "",
            classId: trialStudent?.gridItem?.class?.id || "",
            dates: trialStudent?.date ? [trialStudent.date] : [],
          });
        }
      }}
    >
      <DialogContent className="flex flex-col min-w-4xl gap-8 h-fit max-h-[90vh] min-h-[80vh] overflow-y-auto">
        <DialogHeader className="h-fit">
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>
        <TrialStudentForm
          form={trialStudentForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onDelete={() => deleteTrialStudentMutation()}
          onDeleteLoading={isDeletePending}
        />
      </DialogContent>
    </Dialog>
  );
}
