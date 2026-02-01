import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EnrollmentSchema } from "@/schemas/enrollment";
import React from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getEnrollmentFormData } from "@/api/student";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { SignatureCanvasComponent } from "@/components/signature-canvas";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { EnrollmentFormSkeleton } from "@/components/ui/skeleton-form";
import { 
  GridClass, 
  ClassFormData, 
  ModalityFormData,
  PlanFormData 
} from "@/interfaces/enrollment";


export default function EnrollmentForm({
  form,
  onSubmit,
  isCreateEnrollmentLoading,
}: {
  form: UseFormReturn<EnrollmentSchema>;
  onSubmit: (data: EnrollmentSchema) => void;
  isCreateEnrollmentLoading: boolean;
}) {
  const { data: formData, isLoading } = useQuery({
    queryKey: ["enrollment-form-data"],
    queryFn: getEnrollmentFormData,
  });

  const selectedModality = form.watch("modalityId");

  // Filtrar classes baseado na modalidade selecionada
  const filteredClasses =
    formData?.classes?.filter(
      (classe: ClassFormData) =>
        classe.modalityId === selectedModality && classe.gridClasses.length > 0
    ) || [];

  // Filtrar planos baseado na duração (se necessário)
  const filteredPlans = formData?.plans || [];

  return (
    <SkeletonWrapper
      isPending={isLoading}
      SkeletonComponent={EnrollmentFormSkeleton}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <div className="flex-1 overflow-y-auto pr-2">
            {/* Header da aba */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Dados da Matrícula</h2>
              <p className="text-sm text-muted-foreground">
                Configure os detalhes da matrícula do aluno
              </p>
            </div>

            <div className="space-y-6">
              {/* Grid para campos principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plano */}
                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plano</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um plano" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredPlans.map((plan: PlanFormData) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}{" "}
                              | {plan.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Modalidade */}
                <FormField
                  control={form.control}
                  name="modalityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modalidade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma modalidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formData?.modalities?.map(
                            (modality: ModalityFormData) => (
                              <SelectItem key={modality.id} value={modality.id}>
                                {modality.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Turma - campo grande */}
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turma</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Limpar data de início quando trocar de turma
                        form.setValue("startDate", "");
                      }}
                      defaultValue={field.value}
                      disabled={!selectedModality}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma turma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredClasses.map((classe: ClassFormData) => {
                          const days = classe.gridClasses
                            .map(({ dayOfWeek }: GridClass) => {
                              const dayMap: Record<string, string> = {
                                sunday: "Dom",
                                monday: "Seg",
                                tuesday: "Ter",
                                wednesday: "Qua",
                                thursday: "Qui",
                                friday: "Sex",
                                saturday: "Sáb",
                              };
                              return dayMap[dayOfWeek] || dayOfWeek;
                            })
                            .join(", ");

                          const [gridItem] = classe.gridClasses;
                          const label = `${classe.modality.name} ${classe.description} | ${classe.classLevel.name}`;

                          return (
                            <SelectItem key={classe.id} value={classe.id}>
                              {label} - {days}, das {gridItem?.startTime} às{" "}
                              {gridItem?.endTime}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Grid para data de início e dia de pagamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data de início */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => {
                    const selectedClassId = form.watch("classId");
                    const selectedClass = formData?.classes?.find(
                      (classe: ClassFormData) => classe.id === selectedClassId
                    );

                    // Função para verificar se uma data é válida (tem aula na turma selecionada)
                    const isDateValid = (date: Date) => {
                      if (!selectedClass) return false;

                      const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, etc.
                      const dayMap: Record<number, string> = {
                        0: "sunday",
                        1: "monday",
                        2: "tuesday",
                        3: "wednesday",
                        4: "thursday",
                        5: "friday",
                        6: "saturday",
                      };

                      const dayName = dayMap[dayOfWeek];
                      return selectedClass.gridClasses.some(
                        (gridClass: GridClass) =>
                          gridClass.dayOfWeek === dayName
                      );
                    };

                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de início</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={!selectedClassId}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "dd/MM/yyyy", {
                                    locale: ptBR,
                                  })
                                ) : (
                                  <span>
                                    {selectedClassId
                                      ? "Selecione a data"
                                      : "Selecione uma turma primeiro"}
                                  </span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(date?.toISOString())
                              }
                              disabled={(date) =>
                                date < new Date() || !isDateValid(date)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                        {selectedClassId && (
                          <p className="text-xs text-muted-foreground">
                            Apenas datas com aulas da turma selecionada estão
                            disponíveis
                          </p>
                        )}
                      </FormItem>
                    );
                  }}
                />

                {/* Dia de pagamento */}
                <FormField
                  control={form.control}
                  name="paymentDay"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Dia de pagamento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o dia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">Todo dia 5</SelectItem>
                          <SelectItem value="10">Todo dia 10</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Assinatura - campo grande */}
              <FormField
                control={form.control}
                name="signature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assinatura Digital</FormLabel>
                    <FormControl>
                      <SignatureCanvasComponent
                        onSignatureChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex w-full justify-end mt-6 flex-shrink-0">
            <Button type="submit" className="w-full" disabled={isCreateEnrollmentLoading}>
              {isCreateEnrollmentLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Criar Matrícula"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </SkeletonWrapper>
  );
}
