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

import { TrialStudentSchema, trialStudentSchema } from "../schemas/trial-student-schema";
import TrialStudentForm from "./trial-student-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTrialStudent, updateTrialStudent } from "@/api/trial-student";
import { TrialStudent } from "@/interfaces/trial-student";
import { useQuery } from "@tanstack/react-query";
import { getModalities } from "@/api/modality";
import { getTeachers } from "@/api/teacher";
import { getClassLevels } from "@/api/class-level";

type UpdateTrialStudentDialogProps = {
  trialStudent: TrialStudent;
};

export function UpdateTrialStudentDialog({ trialStudent }: UpdateTrialStudentDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const trialStudentForm = useForm<TrialStudentSchema>({
    resolver: zodResolver(trialStudentSchema),
    defaultValues: {
      lead: {
        firstName: trialStudent.lead?.firstName || "",
        lastName: trialStudent.lead?.lastName || "",
        phone: trialStudent.lead?.phone || "",
        email: trialStudent.lead?.email || "",
        cpf: trialStudent.lead?.cpf || "",
      },
      gridItem: {
        dayOfWeek: trialStudent.gridItem?.dayOfWeek || "",
        startTime: trialStudent.gridItem?.startTime || "",
        endTime: trialStudent.gridItem?.endTime || "",
        class: {
          name: trialStudent.gridItem?.class?.name || "",
          description: trialStudent.gridItem?.class?.description || "",
          modalityId: trialStudent.gridItem?.class?.modalityId || "",
          teacherId: trialStudent.gridItem?.class?.teacherId || "",
          classLevelId: trialStudent.gridItem?.class?.classLevelId || "",
          maxStudents: trialStudent.gridItem?.class?.maxStudents || 15,
        },
      },
      date: trialStudent.date || "",
    },
    values: {
      lead: {
        firstName: trialStudent.lead?.firstName || "",
        lastName: trialStudent.lead?.lastName || "",
        phone: trialStudent.lead?.phone || "",
        email: trialStudent.lead?.email || "",
        cpf: trialStudent.lead?.cpf || "",
      },
      gridItem: {
        dayOfWeek: trialStudent.gridItem?.dayOfWeek || "",
        startTime: trialStudent.gridItem?.startTime || "",
        endTime: trialStudent.gridItem?.endTime || "",
        class: {
          name: trialStudent.gridItem?.class?.name || "",
          description: trialStudent.gridItem?.class?.description || "",
          modalityId: trialStudent.gridItem?.class?.modalityId || "",
          teacherId: trialStudent.gridItem?.class?.teacherId || "",
          classLevelId: trialStudent.gridItem?.class?.classLevelId || "",
          maxStudents: trialStudent.gridItem?.class?.maxStudents || 15,
        },
      },
      date: trialStudent.date || "",
    },
  });

  // Buscar dados para os selects
  const { data: modalities = [] } = useQuery({
    queryKey: ["modalities"],
    queryFn: getModalities,
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const { data: classLevels = [] } = useQuery({
    queryKey: ["classLevels"],
    queryFn: getClassLevels,
  });

  const { mutate: updateTrialStudentMutation, isPending } = useMutation({
    mutationKey: ["updateTrialStudent", trialStudent.id],
    mutationFn: async (data: TrialStudentSchema) => await updateTrialStudent(trialStudent.id, data),
    onSuccess: () => {
      toast.success("Aula experimental atualizada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["trialStudents"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar aula experimental");
    },
  });

  const { mutate: deleteTrialStudentMutation, isPending: isDeletePending } =
    useMutation({
      mutationKey: ["deleteTrialStudent", trialStudent.id],
      mutationFn: async () => await deleteTrialStudent(trialStudent.id),
      onSuccess: () => {
        toast.success("Aula experimental deletada com sucesso");
        queryClient.invalidateQueries({ queryKey: ["trialStudents"] });
        setOpen(false);
      },
      onError: () => {
        toast.error("Erro ao deletar aula experimental");
      },
    });

  const handleSubmit = (data: TrialStudentSchema) => updateTrialStudentMutation(data);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        if (!isOpen) {
          trialStudentForm.reset({
            lead: {
              firstName: trialStudent.lead?.firstName || "",
              lastName: trialStudent.lead?.lastName || "",
              phone: trialStudent.lead?.phone || "",
              email: trialStudent.lead?.email || "",
              cpf: trialStudent.lead?.cpf || "",
            },
            gridItem: {
              dayOfWeek: trialStudent.gridItem?.dayOfWeek || "",
              startTime: trialStudent.gridItem?.startTime || "",
              endTime: trialStudent.gridItem?.endTime || "",
              class: {
                name: trialStudent.gridItem?.class?.name || "",
                description: trialStudent.gridItem?.class?.description || "",
                modalityId: trialStudent.gridItem?.class?.modalityId || "",
                teacherId: trialStudent.gridItem?.class?.teacherId || "",
                classLevelId: trialStudent.gridItem?.class?.classLevelId || "",
                maxStudents: trialStudent.gridItem?.class?.maxStudents || 15,
              },
            },
            date: trialStudent.date || "",
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
      <DialogContent className="flex flex-col min-w-4xl gap-8 h-fit max-h-[90vh] overflow-y-auto">
        <DialogHeader className="h-fit">
          <DialogTitle>Editar Aula Experimental</DialogTitle>
        </DialogHeader>
        <TrialStudentForm
          form={trialStudentForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onDelete={() => deleteTrialStudentMutation()}
          onDeleteLoading={isDeletePending}
          modalities={modalities}
          teachers={teachers}
          classLevels={classLevels}
        />
      </DialogContent>
    </Dialog>
  );
}

