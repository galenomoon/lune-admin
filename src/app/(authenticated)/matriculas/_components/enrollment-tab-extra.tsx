import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEnrollmentTab } from "@/contexts/enrollment-tab-context";
import {
  GridClass,
  ClassFormData,
  ModalityFormData,
  PlanFormData,
} from "@/interfaces/enrollment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEnrollmentFormData } from "@/api/student";
import { addEnrollment } from "@/api/enrollment";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { EnrollmentFormSkeleton } from "@/components/ui/skeleton-form";

// Schema para adicionar matrícula extra
const enrollmentExtraSchema = z.object({
  modalityId: z.string().min(1, "Modalidade é obrigatória"),
  classId: z.string().min(1, "Turma é obrigatória"),
  planId: z.string().min(1, "Plano é obrigatório"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  paymentDay: z.string().min(1, "Dia de pagamento é obrigatório"),
});

type EnrollmentExtraSchema = z.infer<typeof enrollmentExtraSchema>;

const EnrollmentTabExtra = () => {
  const { currentStudent, closeAddEnrollmentForm } = useEnrollmentTab();

  const queryClient = useQueryClient();

  const { data: formData, isLoading } = useQuery({
    queryKey: ["enrollment-form-data"],
    queryFn: getEnrollmentFormData,
  });

  const form = useForm<EnrollmentExtraSchema>({
    resolver: zodResolver(enrollmentExtraSchema),
    defaultValues: {
      modalityId: "",
      classId: "",
      planId: "",
      startDate: "",
      paymentDay: "",
    },
  });

  const selectedModality = form.watch("modalityId");
  const selectedPlanId = form.watch("planId");

  // Filtrar classes baseado na modalidade selecionada
  const filteredClasses =
    formData?.classes?.filter(
      (classe: ClassFormData) =>
        classe.modalityId === selectedModality && classe.gridClasses.length > 0
    ) || [];

  // Buscar plano selecionado para pegar durationInDays
  const selectedPlan = formData?.plans?.find(
    (plan: PlanFormData) => plan.id === selectedPlanId
  );

  const addEnrollmentMutation = useMutation({
    mutationKey: ["add-enrollment"],
    mutationFn: (data: EnrollmentExtraSchema) => {
      if (!currentStudent?.personalData?.id) {
        throw new Error("Student ID not found");
      }
      if (!selectedPlan?.durationInDays) {
        throw new Error("Plan duration not found");
      }

      return addEnrollment(currentStudent.personalData.id, {
        planId: data.planId,
        classId: data.classId,
        startDate: new Date(data.startDate),
        paymentDay: Number(data.paymentDay),
        durationInDays: selectedPlan.durationInDays,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Matrícula extra adicionada com sucesso");
      closeAddEnrollmentForm();
    },
    onError: () => {
      toast.error("Erro ao adicionar matrícula extra");
    },
  });

  const onSubmit = (data: EnrollmentExtraSchema) => {
    addEnrollmentMutation.mutate(data);
  };

  return (
    <section className="flex flex-col h-full w-full overflow-y-auto pb-12">
      <CardHeader className="mb-6 gap-1 w-full px-0">
        <section className="flex flex-row gap-1">
          <Button variant="ghost" onClick={closeAddEnrollmentForm}>
            <ChevronLeft size={18} />
          </Button>
          <article className="flex flex-col gap-1">
            <CardTitle>Matrícula Extra</CardTitle>
            <CardDescription>
              Adicione uma nova matrícula para{" "}
              {currentStudent?.personalData?.firstName}{" "}
              {currentStudent?.personalData?.lastName}
            </CardDescription>
          </article>
        </section>
      </CardHeader>

      <SkeletonWrapper
        isPending={isLoading}
        SkeletonComponent={EnrollmentFormSkeleton}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 h-full w-full"
          >
            <div className="flex flex-col space-y-6 w-full">
              {/* Plano */}
              <FormField
                control={form.control}
                name="planId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plano</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formData?.plans?.map((plan: PlanFormData) => (
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <>
                      <FormItem>
                        <FormLabel>Turma</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Limpar data de início quando trocar de turma
                            form.setValue("startDate", "");
                          }}
                          disabled={!selectedModality}
                          value={field.value}
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
                                  {label} - {days}, das {gridItem?.startTime}{" "}
                                  às {gridItem?.endTime}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>

                      {/* Data de início */}
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
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
                                    type="button"
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
                        )}
                      />
                    </>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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

            {/* Botões de ação */}
            <section className="flex gap-2 justify-end items-end h-full mt-auto">
              <Button
                disabled={addEnrollmentMutation.isPending}
                className="w-30"
                type="submit"
              >
                {addEnrollmentMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Adicionar"
                )}
              </Button>
            </section>
          </form>
        </Form>
      </SkeletonWrapper>
    </section>
  );
};

export { EnrollmentTabExtra };

