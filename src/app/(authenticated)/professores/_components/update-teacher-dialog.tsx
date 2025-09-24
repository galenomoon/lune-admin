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

import { TeacherSchema, teacherSchema } from "../schemas/teacher-schema";
import TeacherForm from "./teacher-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTeacher, updateTeacher } from "@/api/teacher";
import { TeacherTable } from "@/interfaces/teacher";
import { dateToString } from "@/utils/parse-date";
import { floatToCurrency } from "@/utils/parse-currency";

type UpdateTeacherDialogProps = {
  teacher: TeacherTable;
};

export function UpdateTeacherDialog({ teacher }: UpdateTeacherDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const teacherForm = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      firstName: teacher.firstName || "",
      lastName: teacher.lastName || "",
      cpf: teacher.cpf || "",
      rg: teacher.rg || "",
      birthDate: dateToString(teacher.birthDate) || "",
      priceHour: floatToCurrency(teacher.priceHour * 10) || "",
      phone: teacher.phone || "",
      instagram: teacher.instagram || "",
      pixKey: teacher.pixKey || "",
    },
  });

  const {
    mutate: updateTeacherMutation,
    isPending,
  } = useMutation({
    mutationKey: ["updateTeacher", teacher.id],
    mutationFn: async (data: TeacherSchema) =>
      await updateTeacher(teacher.id, data),
    onSuccess: () => {
      toast.success("Professor atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar professor");
    },
  });

  const {
    mutate: deleteTeacherMutation,
    isPending: isDeletePending,
  } = useMutation({
    mutationKey: ["deleteTeacher", teacher.id],
    mutationFn: async () => await deleteTeacher(teacher.id),
    onSuccess: () => {
      toast.success("Professor deletado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao deletar professor");
    },
  });

  const handleSubmit = (data: TeacherSchema) => updateTeacherMutation(data);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        if (!isOpen) teacherForm.reset({
          firstName: teacher.firstName || "",
          lastName: teacher.lastName || "",
          cpf: teacher.cpf || "",
          rg: teacher.rg || "",
          birthDate: dateToString(teacher.birthDate) || "",
        });

        teacherForm.reset({
          firstName: teacher.firstName || "",
          lastName: teacher.lastName || "",
          cpf: teacher.cpf || "",
          rg: teacher.rg || "",
          priceHour: floatToCurrency(teacher.priceHour * 100) || "",
          phone: teacher.phone || "",
          instagram: teacher.instagram || "",
          pixKey: teacher.pixKey || "",
          birthDate: dateToString(teacher.birthDate) || "",
        });
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
      <DialogContent className="flex flex-col min-w-2xl gap-8 h-fit">
        <DialogHeader className="h-fit">
          <DialogTitle>Editar Professor</DialogTitle>
        </DialogHeader>
        <TeacherForm
          form={teacherForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onDelete={() => deleteTeacherMutation()}
          onDeleteLoading={isDeletePending}
        />
      </DialogContent>
    </Dialog>
  );
}
