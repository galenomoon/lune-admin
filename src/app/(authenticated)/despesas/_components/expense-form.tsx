import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ExpenseSchema } from "../schemas/expense-schema";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ExpenseForm({
  form,
  onSubmit,
  isLoading,
  onDelete,
  onDeleteLoading,
}: {
  form: UseFormReturn<ExpenseSchema>;
  onSubmit: (data: ExpenseSchema) => void;
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
        <section>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormInput
              name="name"
              control={form.control}
              label="Nome da Despesa"
              placeholder="Ex: Aluguel, Conta de Luz..."
            />
            <FormInput
              name="amount"
              control={form.control}
              label="Valor"
              placeholder="Digite o valor"
              mask="R$ 9.999,99"
              maskOptions={{
                // placeholder: "R$ ___.__",
                showMaskOnHover: true,
              }}
            />
            <FormInput
              name="dueDay"
              control={form.control}
              label="Dia do Vencimento"
              placeholder="Ex: 10"
              type="number"
            />
            <div className="col-span-2">
              <FormTextarea
                name="description"
                control={form.control}
                label="Descrição (opcional)"
                placeholder="Informações adicionais sobre a despesa..."
              />
            </div>
          </div>
        </section>
        <div className="flex w-full justify-end mt-6 gap-2">
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              className="px-12"
              disabled={onDeleteLoading}
              onClick={onDelete}
            >
              {onDeleteLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Deletar"
              )}
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

