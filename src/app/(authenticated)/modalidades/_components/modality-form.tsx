import { FormInput } from "@/components/forms/form-input";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ModalitySchema } from "../schemas/modality-schema";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ModalityForm({
  form,
  onSubmit,
  isLoading,
  onDelete,
  onDeleteLoading,
}: {
  form: UseFormReturn<ModalitySchema>;
  onSubmit: (data: ModalitySchema) => void;
  isLoading: boolean;
  onDelete?: () => void;
  onDeleteLoading?: boolean;
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full justify-between"
      >
        <FormInput
          name="name"
          control={form.control}
          label="Nome"
          placeholder="Digite o nome da modalidade"
        />
        <div className="flex w-full justify-end mt-6 gap-2">
          {onDelete && (
            <Button type="button" variant="destructive" className="px-12" disabled={onDeleteLoading} onClick={onDelete}>
              {onDeleteLoading ? <Loader2 className="size-4 animate-spin" /> : "Deletar"}
            </Button>
          )}
          <Button type="submit" className="px-12" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Salvar"}
          </Button>

        </div>
      </form>
    </Form>
  );
}
