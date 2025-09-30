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

import { TeacherSchema, teacherSchema } from "../schemas/teacher-schema";
import TeacherForm from "./teacher-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTeacher } from "@/api/teacher";

export function CreateTeacherDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const teacherForm = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      cpf: "",
      rg: "",
      birthDate: "",
      priceHour: "",
      phone: "",
      instagram: "",
      pixKey: "",
    },
  });

  const {
    mutate: createTeacherMutation,
    isPending,
  } = useMutation({
    mutationKey: ["createTeacher"],
    mutationFn: async (data: TeacherSchema) => await createTeacher(data),
    onSuccess: () => {
      toast.success("Professor criado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao criar professor");
    },
  });

  const handleSubmit = (data: TeacherSchema) => createTeacherMutation(data);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) teacherForm.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Novo Professor
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-8 sm:min-w-4xl max-h-[90vh] min-h-[80vh] " >
        <DialogHeader className="h-fit">
          <DialogTitle>Novo Professor</DialogTitle>
        </DialogHeader>
        <TeacherForm
          form={teacherForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
