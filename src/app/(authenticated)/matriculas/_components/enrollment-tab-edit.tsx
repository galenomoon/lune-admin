import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEnrollmentTab } from "@/contexts/enrollment-tab-context";
import {
  GridClass,
  ClassFormData,
  ModalityFormData,
} from "@/interfaces/enrollment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEnrollmentFormData } from "@/api/student";
import { updateEnrollment } from "@/api/enrollment";
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
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { EnrollmentFormSkeleton } from "@/components/ui/skeleton-form";

// Schema para edição de matrícula
const enrollmentEditSchema = z.object({
  modalityId: z.string().min(1, "Modalidade é obrigatória"),
  classId: z.string().min(1, "Turma é obrigatória"),
  generatedLink: z.string().optional(),
});

type EnrollmentEditSchema = z.infer<typeof enrollmentEditSchema>;

const EnrollmentTabEdit = () => {
  const { currentEnrollment, closeEditEnrollmentForm } = useEnrollmentTab();

  const queryClient = useQueryClient();

  const { data: formData, isLoading } = useQuery({
    queryKey: ["enrollment-form-data"],
    queryFn: getEnrollmentFormData,
  });

  const form = useForm<EnrollmentEditSchema>({
    resolver: zodResolver(enrollmentEditSchema),
    values: {
      modalityId: currentEnrollment?.class?.modality?.id || "",
      classId: currentEnrollment?.class?.id || "",
      generatedLink: "",
    },
  });

  const selectedModality = form.watch("modalityId");

  // Filtrar classes baseado na modalidade selecionada
  const filteredClasses =
    formData?.classes?.filter(
      (classe: ClassFormData) =>
        classe.modalityId === selectedModality && classe.gridClasses.length > 0
    ) || [];

  const updateEnrollmentMutation = useMutation({
    mutationKey: ["update-enrollment"],
    mutationFn: (data: EnrollmentEditSchema) => {
      if (!currentEnrollment?.id) throw new Error("Enrollment ID not found");
      return updateEnrollment(currentEnrollment.id, { classId: data.classId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Matrícula atualizada com sucesso");
      closeEditEnrollmentForm();
    },
    onError: () => {
      toast.error("Erro ao atualizar matrícula");
    },
  });

  const onSubmit = (data: EnrollmentEditSchema) => {
    updateEnrollmentMutation.mutate(data);
  };

  return (
    <section className="flex flex-col h-full w-full overflow-y-auto pb-12">
      <CardHeader className="mb-6 gap-1 w-full px-0">
        <section className="flex flex-row gap-1">
          <Button variant="ghost" onClick={closeEditEnrollmentForm}>
            <ChevronLeft size={18} />
          </Button>
          <article className="flex flex-col gap-1">
            <CardTitle>Editar Matrícula</CardTitle>
            <CardDescription>
              Edite os dados da matrícula: {currentEnrollment?.plan?.name} -{" "}
              {currentEnrollment?.class?.modality?.name}
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
            <div className="flex  flex-col space-y-6 w-full ">
              {/* Grid para Modalidade e Turma */}
              <div className="grid grid-cols-1  gap-4 w-full ">
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

                {/* Turma */}
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turma</FormLabel>
                      <Select
                        onValueChange={field.onChange}
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
            </div>

            {/* Botões de ação */}
            <section className="flex gap-2 justify-end items-end h-full mt-auto">
              <Button
                disabled={updateEnrollmentMutation.isPending}
                className="w-30"
                type="submit"
              >
                {updateEnrollmentMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Salvar"
                )}
              </Button>
            </section>
          </form>
        </Form>
      </SkeletonWrapper>
    </section>
  );
};

export { EnrollmentTabEdit };
