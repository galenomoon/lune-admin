import { FormInput } from "@/components/forms/form-input";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { PersonalDataSchema } from "@/schemas/enrollment";
import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PersonalDataForm({
  form,
  onSubmit,
}: {
  form: UseFormReturn<PersonalDataSchema>;
  onSubmit: (data: PersonalDataSchema) => void;
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full justify-between"
      >
        <section>
          <CardHeader className="mb-6 gap-1 w-full px-0">
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para continuar
            </CardDescription>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <FormInput
              name="firstName"
              control={form.control}
              label="Nome"
              placeholder="Digite o nome"
            />
            <FormInput
              name="lastName"
              control={form.control}
              label="Sobrenome"
              placeholder="Digite o sobrenome"
            />
            <FormInput
              name="birthDate"
              control={form.control}
              label="Data de nascimento"
              placeholder="DD/MM/AAAA"
              mask="99/99/9999"
              maskOptions={{
                placeholder: "__/__/____",
                showMaskOnHover: true,
              }}
            />
            <FormInput
              name="cpf"
              control={form.control}
              label="CPF"
              placeholder="000.000.000-00"
              mask="999.999.999-99"
              maskOptions={{
                placeholder: "___.___.___-__",
                showMaskOnHover: true,
              }}
            />
            <FormInput
              name="rg"
              control={form.control}
              label="RG"
              placeholder="00.000.000-0"
              mask="99.999.999-[9|A]"
              maskOptions={{
                placeholder: "__.___.___-_",
                showMaskOnHover: true,
              }}
            />
            <FormInput
              name="phone"
              control={form.control}
              label="Telefone"
              placeholder="(00) 00000-0000"
              mask="(99) 99999-9999"
              maskOptions={{
                placeholder: "(__) _____-____",
                showMaskOnHover: true,
              }}
            />
            <FormInput
              name="instagram"
              control={form.control}
              label="Instagram"
              placeholder="@instagram"
              mask="@*********************"
              maskOptions={{
                placeholder: "@                     ",
                showMaskOnHover: true,
              }}
            />
            <FormInput
              name="email"
              control={form.control}
              label="Email"
              placeholder="email@email.com"
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
