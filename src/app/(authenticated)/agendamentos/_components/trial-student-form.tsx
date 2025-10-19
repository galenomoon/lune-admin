import { FormInput } from "@/components/forms/form-input";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TrialStudentSchema } from "../schemas/trial-student-schema";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getEnrollmentFormData } from "@/api/student";
import {
  GridClass,
  ClassFormData,
  ModalityFormData
} from "@/interfaces/enrollment";
import { Badge } from "@/components/ui/badge";

interface TrialStudentFormProps {
  form: UseFormReturn<TrialStudentSchema>;
  onSubmit: (data: TrialStudentSchema) => void;
  isLoading: boolean;
  onDelete?: () => void;
  onDeleteLoading?: boolean;
}

export default function TrialStudentForm({
  form,
  onSubmit,
  isLoading,
  onDelete,
  onDeleteLoading,
}: TrialStudentFormProps) {
  const { data: formData, isLoading: isFormDataLoading } = useQuery({
    queryKey: ["enrollment-form-data"],
    queryFn: getEnrollmentFormData,
  });

  const selectedModality = form.watch("modalityId");
  const selectedClassId = form.watch("classId");

  // Filtrar classes baseado na modalidade selecionada
  const filteredClasses =
    formData?.classes?.filter(
      (classe: ClassFormData) =>
        classe.modalityId === selectedModality && classe.gridClasses.length > 0
    ) || [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full justify-between"
      >
        <section className="space-y-6">
          {/* Dados do Aluno */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Aluno</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="lead.firstName"
                control={form.control}
                label="Nome"
                placeholder="Digite o nome"
              />
              <FormInput
                name="lead.lastName"
                control={form.control}
                label="Sobrenome"
                placeholder="Digite o sobrenome"
              />
              <FormInput
                name="lead.phone"
                control={form.control}
                label="Telefone"
                placeholder="(11) 99999-9999"
                mask="(99) 99999-9999"
              />
              <FormInput
                name="lead.instagram"
                control={form.control}
                label="Instagram"
                placeholder="@usuario"
              />
            </div>
          </div>

          {/* Dados da Aula */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados da Aula</h3>

            {/* Modalidade e Turma */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Modalidade */}
              <FormField
                control={form.control}
                name="modalityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidade</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("classId", ""); // Limpar turma ao trocar modalidade
                        form.setValue("dates", []); // Limpar datas ao trocar modalidade
                      }}
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

              {/* Turma */}
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turma e Horário</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("dates", []); // Limpar datas ao trocar turma
                        
                        // Preencher dados do gridItem baseado na turma selecionada
                        const selectedClass = formData?.classes?.find(
                          (classe: ClassFormData) => classe.id === value
                        );
                        if (selectedClass && selectedClass.gridClasses.length > 0) {
                          const [gridItem] = selectedClass.gridClasses;
                          form.setValue("gridItem.id", gridItem.id);
                          form.setValue("gridItem.dayOfWeek", gridItem.dayOfWeek);
                          form.setValue("gridItem.startTime", gridItem.startTime);
                          form.setValue("gridItem.endTime", gridItem.endTime);
                        }
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
            </div>

            {/* Datas */}
            <FormField
              control={form.control}
              name="dates"
              render={({ field }) => {
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
                    (gridClass: GridClass) => gridClass.dayOfWeek === dayName
                  );
                };

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const minDate = addDays(today, -7); // 7 dias no passado

                const selectedDates = (field.value || []).map((dateStr: string) => new Date(dateStr));

                const removeDate = (dateToRemove: string) => {
                  const currentDates = field.value || [];
                  field.onChange(currentDates.filter((d: string) => d !== dateToRemove));
                };

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Datas das Aulas</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              (!field.value || field.value.length === 0) && "text-muted-foreground"
                            )}
                            disabled={!selectedClassId}
                          >
                            <span>
                              {selectedClassId
                                ? field.value && field.value.length > 0
                                  ? `${field.value.length} data(s) selecionada(s)`
                                  : "Selecione uma ou mais datas"
                                : "Selecione uma turma primeiro"}
                            </span>
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="multiple"
                          selected={selectedDates}
                          onSelect={(dates) => {
                            if (dates) {
                              field.onChange(Array.from(dates).map((d) => d.toISOString()));
                            }
                          }}
                          disabled={(date) => {
                            const dateOnly = new Date(date);
                            dateOnly.setHours(0, 0, 0, 0);
                            return dateOnly < minDate || !isDateValid(date);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {/* Mostrar datas selecionadas como badges */}
                    {field.value && field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((dateStr: string) => (
                          <Badge key={dateStr} variant="secondary" className="flex items-center gap-1">
                            {format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR })}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeDate(dateStr)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}

                    <FormMessage />
                    {selectedClassId && (
                      <p className="text-xs text-muted-foreground">
                        Selecione uma ou mais datas (até 7 dias no passado e qualquer data no futuro). Apenas datas com aulas da turma selecionada estão disponíveis.
                      </p>
                    )}
                  </FormItem>
                );
              }}
            />
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
          <Button type="submit" className="px-12" disabled={isLoading || isFormDataLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}