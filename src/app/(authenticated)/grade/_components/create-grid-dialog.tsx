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
  GridFormSchema,
  gridFormSchema,
} from "../schemas/grid-schema";
import GridForm from "./grid-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createGridItem } from "@/api/grid";
import { GridFormData } from "@/interfaces/grid";

type CreateGridDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  formData: GridFormData;
};

export function CreateGridDialog({
  isOpen,
  onClose,
  formData,
}: CreateGridDialogProps) {
  const queryClient = useQueryClient();

  const gridForm = useForm<GridFormSchema>({
    resolver: zodResolver(gridFormSchema),
    defaultValues: {
      class: {
        maxStudents: 1,
        modalityId: "",
        classLevelId: "",
        teacherId: "",
        description: "",
      },
      gridItems: [
        {
          dayOfWeek: "",
          startTime: "",
          endTime: "",
        },
      ],
    },
  });

  const { mutate: createGridItemMutation, isPending } = useMutation({
    mutationKey: ["createGridItem"],
    mutationFn: async (data: GridFormSchema) => {
      return await createGridItem(data);
    },
    onSuccess: () => {
      toast.success("Horário adicionado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["grid-items"] });
      onClose();
      gridForm.reset();
    },
    onError: () => {
      toast.error("Erro ao adicionar horário");
    },
  });

  const handleSubmit = (data: GridFormSchema) =>
    createGridItemMutation(data);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
          gridForm.reset();
        }
      }}
    >
      <DialogContent className="flex flex-col min-w-4xl gap-8 h-fit max-h-[90vh] min-h-[80vh] overflow-y-auto">
        <DialogHeader className="h-fit">
          <DialogTitle>Aula na Grade</DialogTitle>
        </DialogHeader>
        <GridForm
          form={gridForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
          formData={formData}
        />
      </DialogContent>
    </Dialog>
  );
}

