import { FormInput } from "@/components/forms/form-input";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TeacherSchema } from "../schemas/teacher-schema";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function TeacherForm({
  form,
  onSubmit,
  isLoading,
  onDelete,
  onDeleteLoading,
}: {
  form: UseFormReturn<TeacherSchema>;
  onSubmit: (data: TeacherSchema) => void;
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
              placeholder="Digite a data de nascimento"
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
              mask="999.999.999-99"
              maskOptions={{
                placeholder: "___.___.___-__",
                showMaskOnHover: true,
              }}
              placeholder="Digite o CPF"
            />
            <FormInput
              name="rg"
              control={form.control}
              mask="99.999.999-9|A"
              maskOptions={{
                placeholder: "__. ___.___-__",
                showMaskOnHover: true,
              }}
              label="RG"
              placeholder="Digite o RG"
            />
            <FormInput
              name="phone"
              mask="(99) [9]9999-9999"
              maskOptions={{
                placeholder: "(__) _____-____",
                showMaskOnHover: true,
              }}
              control={form.control}
              label="Telefone"
              placeholder="Digite o telefone"
            />
            <FormInput
              name="instagram"
              control={form.control}
              label="Instagram"
              placeholder="Digite o Instagram"
            />
            <FormInput
              name="priceHour"
              control={form.control}
              label="Valor Hora"
              placeholder="Digite o valor hora"
              mask="R$ 99,99"
              maskOptions={{
                placeholder: "R$ 00,00",
                showMaskOnHover: true,
              }}
            />
          </div>
          <FormInput
            name="pixKey"
            control={form.control}
            label="Chave PIX"
            placeholder="Digite a chave pix"
          />
        </section>
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
