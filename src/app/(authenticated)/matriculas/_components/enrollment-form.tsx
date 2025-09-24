import { FormInput } from "@/components/forms/form-input";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EnrollmentSchema } from "@/schemas/enrollment";
import React from "react";
import { Button } from "@/components/ui/button";

export default function EnrollmentForm({
  form,
  onSubmit,
}: {
  form: UseFormReturn<EnrollmentSchema>;
  onSubmit: (data: EnrollmentSchema) => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full justify-between">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <FormInput
            name="startDate"
            control={form.control}
            label="Data de início"
            placeholder="DD/MM/AAAA"
          />
          <FormInput
            name="planId"
            control={form.control}
            label="Plano"
            placeholder="Digite o plano"
          />
          <FormInput
            name="paymentDay"
            control={form.control}
            label="Dia de pagamento"
            placeholder="Digite o dia de pagamento"
          />
          <FormInput
            name="classId"
            control={form.control}
            label="Turma"
            placeholder="Digite a turma"
          />
          <FormInput
            name="signature"
            control={form.control}
            label="Assinatura"
            placeholder="Digite a assinatura"
          />
        </div>
        <div className="flex w-full justify-end mt-4">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
}
