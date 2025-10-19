"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getTeachers } from "@/api/teacher";
import { getEnrollmentFormData } from "@/api/student";
import { ClassFormData, GridClass } from "@/interfaces/enrollment";

const workedHourSchema = z.object({
  teacherId: z.string().min(1, "Professor é obrigatório"),
  modalityId: z.string().min(1, "Modalidade é obrigatória"),
  classId: z.string().min(1, "Turma é obrigatória"),
  workedAt: z.date(),
  newEnrollmentsCount: z.number().min(0, "Deve ser maior ou igual a 0"),
  status: z.enum(["PENDING", "DONE", "CANCELED"]).optional(),
  priceSnapshot: z.number().min(0, "Deve ser maior ou igual a 0").optional(),
});

type WorkedHourFormData = z.infer<typeof workedHourSchema>;

interface WorkedHourFormProps {
  onSubmit: (data: WorkedHourFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  defaultValues?: Partial<WorkedHourFormData>;
  onDelete?: () => void;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export default function WorkedHourForm({
  onSubmit,
  onCancel,
  isLoading,
  defaultValues,
  onDelete,
  isDeleting,
  isEditing,
}: WorkedHourFormProps) {
  const form = useForm<WorkedHourFormData>({
    resolver: zodResolver(workedHourSchema),
    defaultValues: defaultValues || {
      teacherId: "",
      modalityId: "",
      classId: "",
      workedAt: new Date(),
      newEnrollmentsCount: 0,
      status: "DONE",
    },
  });

  // Resetar o formulário quando defaultValues mudar
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  // Buscar professores
  const { data: teachers, isLoading: isLoadingTeachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  // Buscar dados do formulário (modalidades e turmas)
  const { data: formData } = useQuery({
    queryKey: ["enrollment-form-data"],
    queryFn: getEnrollmentFormData,
  });

  const [isSubstitute, setIsSubstitute] = useState(false);

  const selectedTeacherId = form.watch("teacherId");
  const selectedModalityId = form.watch("modalityId");
  const selectedClassId = form.watch("classId");

  // Filtrar modalidades baseado no professor selecionado (se não for aula substituta)
  const filteredModalities = isSubstitute
    ? formData?.classes
        ?.map((classe: ClassFormData) => classe.modality)
        .filter(
          (modality: { id: string; name: string }, index: number, self: Array<{ id: string; name: string }>) =>
            index === self.findIndex((m: { id: string; name: string }) => m.id === modality.id)
        ) || []
    : formData?.classes
        ?.filter((classe: ClassFormData) => classe.teacherId === selectedTeacherId)
        .map((classe: ClassFormData) => classe.modality)
        .filter(
          (modality: { id: string; name: string }, index: number, self: Array<{ id: string; name: string }>) =>
            index === self.findIndex((m: { id: string; name: string }) => m.id === modality.id)
        ) || [];

  // Filtrar classes baseado na modalidade e professor selecionados (se não for aula substituta)
  const filteredClasses = isSubstitute
    ? formData?.classes?.filter(
        (classe: ClassFormData) =>
          classe.modalityId === selectedModalityId &&
          classe.gridClasses.length > 0
      ) || []
    : formData?.classes?.filter(
        (classe: ClassFormData) =>
          classe.teacherId === selectedTeacherId &&
          classe.modalityId === selectedModalityId &&
          classe.gridClasses.length > 0
      ) || [];

  // Função para verificar se uma data é válida (tem aula na turma selecionada)
  const isDateValid = (date: Date) => {
    if (!selectedClassId) return false;

    const selectedClass = formData?.classes?.find(
      (classe: ClassFormData) => classe.id === selectedClassId
    );

    if (!selectedClass) return false;

    const dayOfWeek = date.getDay();
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

  const handleTeacherChange = (value: string) => {
    form.setValue("teacherId", value);
    form.setValue("modalityId", "");
    form.setValue("classId", "");
  };

  const handleModalityChange = (value: string) => {
    form.setValue("modalityId", value);
    form.setValue("classId", "");
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = addDays(today, -90); // 90 dias no passado

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Checkbox Aula Substituta */}
        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
          <Checkbox
            id="substitute"
            checked={isSubstitute}
            onCheckedChange={(checked) => {
              setIsSubstitute(checked as boolean);
              // Limpar seleções ao mudar o modo
              form.setValue("modalityId", "");
              form.setValue("classId", "");
            }}
          />
          <label
            htmlFor="substitute"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Aula Substituta
            <span className="text-xs text-muted-foreground block">
              Permite selecionar turmas de outros professores
            </span>
          </label>
        </div>

        {/* Professor */}
        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professor</FormLabel>
              <Select onValueChange={handleTeacherChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um professor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingTeachers ? (
                    <SelectItem value="loading" disabled>
                      Carregando...
                    </SelectItem>
                  ) : !teachers || teachers.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Nenhum professor encontrado
                    </SelectItem>
                  ) : (
                    teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName}
                      </SelectItem>
                    ))
                  )}
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
                onValueChange={handleModalityChange}
                value={field.value}
                disabled={!selectedTeacherId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma modalidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!selectedTeacherId ? (
                    <SelectItem value="empty" disabled>
                      Selecione um professor primeiro
                    </SelectItem>
                  ) : filteredModalities.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Nenhuma modalidade encontrada
                    </SelectItem>
                  ) : (
                    filteredModalities.map((modality: { id: string; name: string }) => (
                      <SelectItem key={modality.id} value={modality.id}>
                        {modality.name}
                      </SelectItem>
                    ))
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
              <FormLabel>Turma</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedModalityId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!selectedModalityId ? (
                    <SelectItem value="empty" disabled>
                      Selecione uma modalidade primeiro
                    </SelectItem>
                  ) : filteredClasses.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Nenhuma turma encontrada
                    </SelectItem>
                  ) : (
                    filteredClasses.map((classe: ClassFormData) => {
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
                    })
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data da Aula */}
        <FormField
          control={form.control}
          name="workedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da Aula</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={!selectedClassId}
                    >
                      {selectedClassId ? (
                        field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )
                      ) : (
                        <span>Selecione uma turma primeiro</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const dateOnly = new Date(date);
                      dateOnly.setHours(0, 0, 0, 0);
                      return dateOnly > today || dateOnly < minDate || !isDateValid(date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {selectedClassId && (
                <p className="text-xs text-muted-foreground">
                  Selecione uma data (até 90 dias no passado). Apenas datas com aulas da turma selecionada estão disponíveis.
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Novas Matrículas */}
        <FormField
          control={form.control}
          name="newEnrollmentsCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Novas Matrículas Convertidas</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status - Apenas no modo de edição */}
        {isEditing && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="DONE">Realizada</SelectItem>
                    <SelectItem value="CANCELED">Não Realizada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Preço por Hora - Apenas no modo de edição */}
        {isEditing && (
          <FormField
            control={form.control}
            name="priceSnapshot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço por Hora (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    placeholder="Ex: 50.00"
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Este valor só deve ser alterado se o preço original estiver incorreto
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-between items-center gap-2 pt-4">
          {onDelete ? (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isLoading || isDeleting}
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
