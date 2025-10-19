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
import { createTrialStudent } from "@/api/trial-student";
import { TrialStudent } from "@/interfaces/trial-student";

type CreateTrialStudentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
};

export function CreateTrialStudentDialog({
  isOpen,
  onClose,
  selectedDate,
}: CreateTrialStudentDialogProps) {
  const queryClient = useQueryClient();

  const trialStudentForm = useForm<TrialStudentSchema>({
    resolver: zodResolver(trialStudentSchema),
    defaultValues: {
      lead: {
        firstName: "",
        lastName: "",
        phone: "",
        instagram: "",
      },
      gridItem: {
        id: "",
        dayOfWeek: "",
        startTime: "",
        endTime: "",
      },
      modalityId: "",
      classId: "",
      dates: selectedDate ? [selectedDate.toISOString()] : [],
    },
    values: {
      lead: {
        firstName: "",
        lastName: "",
        phone: "",
        instagram: "",
      },
      gridItem: {
        id: "",
        dayOfWeek: "",
        startTime: "",
        endTime: "",
      },
      modalityId: "",
      classId: "",
      dates: selectedDate ? [selectedDate.toISOString()] : [],
    },
  });

  const { mutate: createTrialStudentMutation, isPending } = useMutation({
    mutationKey: ["createTrialStudent"],
    mutationFn: async (data: TrialStudentSchema) => {
      // Criar um agendamento para cada data selecionada
      const promises = data.dates.map(async (dateStr) => {
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
            const date = new Date(dateStr);
            date.setHours(date.getHours() + 3); // Ajuste de timezone
            return date.toISOString();
          })(),
        };
        return await createTrialStudent(transformedData as unknown as TrialStudent);
      });

      // Aguardar todas as criações
      return await Promise.all(promises);
    },
    onSuccess: (results) => {
      const count = results.length;
      toast.success(
        count === 1 
          ? "Aula experimental criada com sucesso" 
          : `${count} aulas experimentais criadas com sucesso`
      );
      queryClient.invalidateQueries({ queryKey: ["trial-students"] });
      onClose();
      trialStudentForm.reset();
    },
    onError: () => {
      toast.error("Erro ao criar aula experimental");
    },
  });

  const handleSubmit = (data: TrialStudentSchema) =>
    createTrialStudentMutation(data);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
          trialStudentForm.reset();
        }
      }}
    >
      <DialogContent className="flex flex-col md:min-w-4xl gap-8 h-fit max-h-[90vh] min-h-[80vh] overflow-y-auto">
        <DialogHeader className="h-fit">
          <DialogTitle>Nova Aula Experimental</DialogTitle>
        </DialogHeader>
        <TrialStudentForm
          form={trialStudentForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
