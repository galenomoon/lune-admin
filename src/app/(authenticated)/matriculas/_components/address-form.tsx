import { FormInput } from "@/components/forms/form-input";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { AddressSchema } from "@/schemas/enrollment";
import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AddressForm({
  form,
  onSubmit,
}: {
  form: UseFormReturn<AddressSchema>;
  onSubmit: (data: AddressSchema) => void;
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full justify-between"
      >
        <section>
          <CardHeader className="mb-6 gap-1 w-full px-0">
            <CardTitle>Endereço</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para continuar
            </CardDescription>
          </CardHeader>
          <FormInput
            name="street"
            control={form.control}
            label="Rua"
            placeholder="Digite o endereço"
          />
          <div className="grid grid-cols-2 gap-4 my-4">
            <FormInput
              name="number"
              control={form.control}
              label="Número"
              placeholder="Digite o número"
            />
            <FormInput
              name="city"
              control={form.control}
              label="Cidade"
              placeholder="Digite a cidade"
            />
            <FormInput
              name="neighborhood"
              control={form.control}
              label="Bairro"
              placeholder="Digite o bairro"
            />
            <FormInput
              name="state"
              control={form.control}
              label="Estado"
              placeholder="Digite o estado"
            />
            <FormInput
              name="complement"
              control={form.control}
              label="Complemento"
              placeholder="Digite o complemento"
            />
            <FormInput
              name="cep"
              control={form.control}
              label="CEP"
              placeholder="Digite o CEP"
            />
          </div>
        </section>
        <div className="flex w-full justify-end mt-4">
          <Button type="submit">Próximo</Button>
        </div>
      </form>
    </Form>
  );
}
