"use client";
import React from "react";
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

import { ModalitySchema, modalitySchema } from "../schemas/modality-schema";
import ModalityForm from "./modality-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteModality, updateModality } from "@/api/modality";
import { ModalityTable } from "@/interfaces/modality";

type UpdateModalityDialogProps = {
  modality: ModalityTable;
};

export function UpdateModalityDialog({ modality }: UpdateModalityDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const modalityForm = useForm<ModalitySchema>({
    resolver: zodResolver(modalitySchema),
    defaultValues: {
      name: modality.name || "",
    },
  });

  const {
    mutate: updateModalityMutation,
    isPending,
  } = useMutation({
    mutationKey: ["updateModality", modality.id],
    mutationFn: async (data: ModalitySchema) =>
      await updateModality(modality.id, data),
    onSuccess: () => {
      toast.success("Modalidade atualizada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["modalities"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar modalidade");
    },
  });

  const {
    mutate: deleteModalityMutation,
    isPending: isDeletePending,
  } = useMutation({
    mutationKey: ["deleteModality", modality.id],
    mutationFn: async () => await deleteModality(modality.id),
    onSuccess: () => {
      toast.success("Modalidade deletada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["modalities"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao deletar modalidade");
    },
  });

  const handleSubmit = (data: ModalitySchema) => updateModalityMutation(data);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) modalityForm.reset();
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
      <DialogContent className="flex flex-col gap-8 sm:min-w-4xl max-h-[90vh] min-h-[40vh] " >
        <DialogHeader className="h-fit">
          <DialogTitle>Editar Modalidade</DialogTitle>
        </DialogHeader>
        <ModalityForm
          form={modalityForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onDelete={() => deleteModalityMutation()}
          onDeleteLoading={isDeletePending}
        />
      </DialogContent>
    </Dialog>
  );
}
