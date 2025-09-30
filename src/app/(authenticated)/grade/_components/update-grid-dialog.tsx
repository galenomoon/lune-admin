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
import { deleteGridItem, updateGridItem } from "@/api/grid";
import { GridFormData, GridItem } from "@/interfaces/grid";
import { useEffect } from "react";

type UpdateGridDialogProps = {
  gridItem: GridItem;
  onClose?: () => void;
  formData: GridFormData;
};

export function UpdateGridDialog({
  gridItem,
  onClose,
  formData,
}: UpdateGridDialogProps) {
  const queryClient = useQueryClient();

  const gridForm = useForm<GridFormSchema>({
    resolver: zodResolver(gridFormSchema),
    defaultValues: {
      class: {
        id: gridItem?.class?.id || "",
        maxStudents: gridItem?.maxStudents || 1,
        modalityId: gridItem?.class?.modalityId || "",
        classLevelId: gridItem?.class?.classLevelId || "",
        teacherId: gridItem?.class?.teacherId || "",
        description: gridItem?.class?.description || "",
      },
      gridItems: [
        {
          dayOfWeek: gridItem?.dayOfWeek || "",
          startTime: gridItem?.startTime || "",
          endTime: gridItem?.endTime || "",
        },
      ],
    },
  });

  // Atualizar o formulário quando gridItem mudar
  useEffect(() => {
    if (gridItem) {
      const formData = {
        class: {
          id: gridItem?.class?.id || "",
          maxStudents: gridItem?.maxStudents || 1,
          modalityId: gridItem?.class?.modalityId || "",
          classLevelId: gridItem?.class?.classLevelId || "",
          teacherId: gridItem?.class?.teacherId || "",
          description: gridItem?.class?.description || "",
        },
        gridItems: [
          {
            dayOfWeek: gridItem?.dayOfWeek || "",
            startTime: gridItem?.startTime || "",
            endTime: gridItem?.endTime || "",
          },
        ],
      };
      
      // Resetar o formulário com os dados
      gridForm.reset(formData);
      
      // Forçar a atualização do estado local também
      setTimeout(() => {
        gridForm.setValue("gridItems", formData.gridItems);
      }, 100);
    }
  }, [gridItem, gridForm]);

  const { mutate: updateGridItemMutation, isPending } = useMutation({
    mutationKey: ["updateGridItem", gridItem?.id],
    mutationFn: async (data: GridFormSchema) => {
      return await updateGridItem(gridItem?.class?.id || "", data);
    },
    onSuccess: () => {
      toast.success("Horário atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["grid-items"] });
      onClose?.();
    },
    onError: () => {
      toast.error("Erro ao atualizar horário");
    },
  });

  const { mutate: deleteGridItemMutation, isPending: isDeletePending } =
    useMutation({
      mutationKey: ["deleteGridItem", gridItem?.id],
      mutationFn: async () => await deleteGridItem(gridItem?.id),
      onSuccess: () => {
        toast.success("Horário deletado com sucesso");
        queryClient.invalidateQueries({ queryKey: ["grid-items"] });
        onClose?.();
      },
      onError: () => {
        toast.error("Erro ao deletar horário");
      },
    });

  const handleSubmit = (data: GridFormSchema) =>
    updateGridItemMutation(data);

  const isOpen = !gridItem ? false : true;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        onClose?.();

        if (!isOpen) {
          gridForm.reset({
            class: {
              id: gridItem?.class?.id || "",
              maxStudents: gridItem?.maxStudents || 1,
              modalityId: gridItem?.class?.modalityId || "",
              classLevelId: gridItem?.class?.classLevelId || "",
              teacherId: gridItem?.class?.teacherId || "",
              description: gridItem?.class?.description || "",
            },
            gridItems: [
              {
                dayOfWeek: gridItem?.dayOfWeek || "",
                startTime: gridItem?.startTime || "",
                endTime: gridItem?.endTime || "",
              },
            ],
          });
        }
      }}
    >
      <DialogContent className="flex flex-col min-w-4xl gap-8 h-fit max-h-[90vh] min-h-[80vh] overflow-y-auto">
        <DialogHeader className="h-fit">
          <DialogTitle>Editar Aula na Grade</DialogTitle>
        </DialogHeader>
        <GridForm
          form={gridForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onDelete={() => deleteGridItemMutation()}
          onDeleteLoading={isDeletePending}
          formData={formData}
        />
      </DialogContent>
    </Dialog>
  );
}
