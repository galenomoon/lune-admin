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
      date: selectedDate ? selectedDate.toISOString() : "",
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
      date: selectedDate ? selectedDate.toISOString() : "",
    },
  });

  const { mutate: createTrialStudentMutation, isPending } = useMutation({
    mutationKey: ["createTrialStudent"],
    mutationFn: async (data: TrialStudentSchema) => {
      // Transformar os dados do schema para o formato esperado pela API
      // Baseado no payload do TrialClassForm do lune-web
      const transformedData = {
        lead: {
          firstName: data.lead.firstName,
          lastName: data.lead.lastName,
          phone: data.lead.phone,
          instagram: data.lead.instagram,
          modalityOfInterest: data.modalityId, // Adicionado baseado no TrialClassForm
          preferencePeriod: data.gridItem.startTime, // Adicionado baseado no TrialClassForm
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
          const date = new Date(data.date);
          date.setHours(date.getHours() + 3); // Ajuste de timezone como no TrialClassForm
          return date.toISOString();
        })(),
      };
      return await createTrialStudent(transformedData as unknown as TrialStudent);
    },
    onSuccess: () => {
      toast.success("Aula experimental criada com sucesso");
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
          selectedDate={selectedDate}
        />
      </DialogContent>
    </Dialog>
  );
}
