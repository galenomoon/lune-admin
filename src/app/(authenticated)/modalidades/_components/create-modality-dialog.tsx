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
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { modalitySchema, ModalitySchema } from "../schemas/modality-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createModality } from "@/api/modality";
import ModalityForm from "./modality-form";

export function CreateModalityDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const modalityForm = useForm<ModalitySchema>({
    resolver: zodResolver(modalitySchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: createModalityMutation, isPending } = useMutation({
    mutationKey: ["createModality"],
    mutationFn: async (data: ModalitySchema) => await createModality(data),
    onSuccess: () => {
      toast.success("Modalidade criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["modalities"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao criar modalidade");
    },
  });

  const handleSubmit = (data: ModalitySchema) => createModalityMutation(data);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) modalityForm.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Nova Modalidade
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-8 sm:min-w-4xl max-h-[90vh] min-h-[40vh] ">
        <DialogHeader className="h-fit">
          <DialogTitle>Nova Modalidade</DialogTitle>
        </DialogHeader>
        <ModalityForm
          form={modalityForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
