import { FormInput } from "@/components/forms/form-input";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { PlanSchema } from "../schemas/plan-schema";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

export default function PlanForm({
  form,
  onSubmit,
  isLoading,
  onDelete,
  onDeleteLoading,
}: {
  form: UseFormReturn<PlanSchema>;
  onSubmit: (data: PlanSchema) => void;
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
              label="Nome do Plano"
              placeholder="Digite o nome do plano"
            />
            <FormInput
              name="weeklyClasses"
              control={form.control}
              label="Aulas por Semana"
              placeholder="Ex: 2"
              type="number"
            />
            <FormInput
              name="durationInDays"
              control={form.control}
              label="Duração em Dias"
              placeholder="Ex: 30"
              type="number"
            />
            <FormInput
              name="price"
              control={form.control}
              label="Preço"
              placeholder="Digite o preço"
              mask="R$ 999,99"
              maskOptions={{
                placeholder: "R$ 00,00",
                showMaskOnHover: true,
              }}
            />
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="isSecondary"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Plano Secundário
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Marque se este é um plano secundário/adicional
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === true}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
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
