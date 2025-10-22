"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema, settingsSchema } from "../schemas/settings-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettings, updateSettings } from "@/api/settings";
import { FormInput } from "@/components/forms/form-input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsForm() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const settingsForm = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      trialClassPrice: "40",
      teacherCommissionPerEnrollment: "20",
      teacherCommissionPerTrialClass: "0",
    },
  });

  useEffect(() => {
    if (settings) {
      settingsForm.reset({
        trialClassPrice: settings.trialClassPrice.toString(),
        teacherCommissionPerEnrollment: settings.teacherCommissionPerEnrollment.toString(),
        teacherCommissionPerTrialClass: settings.teacherCommissionPerTrialClass.toString(),
      });
    }
  }, [settings, settingsForm]);

  const { mutate: updateSettingsMutation, isPending } = useMutation({
    mutationKey: ["updateSettings"],
    mutationFn: async (data: SettingsSchema) => await updateSettings(data),
    onSuccess: () => {
      toast.success("Configurações atualizadas com sucesso");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar configurações");
    },
  });

  const handleSubmit = (data: SettingsSchema) => updateSettingsMutation(data);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valores Fixos</CardTitle>
          <CardDescription>
            Configure valores padrão utilizados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valores Fixos</CardTitle>
        <CardDescription>
          Configure valores padrão utilizados no sistema como preços de aulas e comissões
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...settingsForm}>
          <form onSubmit={settingsForm.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                name="trialClassPrice"
                control={settingsForm.control}
                label="Valor da Aula Avulsa"
                placeholder="Digite o valor"
                mask="R$ 99,99"
                maskOptions={{
                  placeholder: "R$ 00,00",
                  showMaskOnHover: true,
                }}
              />
              <FormInput
                name="teacherCommissionPerEnrollment"
                control={settingsForm.control}
                label="Comissão por Matrícula"
                placeholder="Digite o valor"
                mask="R$ 99,99"
                maskOptions={{
                  placeholder: "R$ 00,00",
                  showMaskOnHover: true,
                }}
              />
              <FormInput
                name="teacherCommissionPerTrialClass"
                control={settingsForm.control}
                label="Comissão por Aula Avulsa"
                placeholder="Digite o valor"
                mask="R$ 99,99"
                maskOptions={{
                  placeholder: "R$ 00,00",
                  showMaskOnHover: true,
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

