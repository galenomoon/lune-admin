import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEnrollmentTab } from "@/contexts/enrollment-tab-context";
import { PlanFormData } from "@/interfaces/enrollment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEnrollmentFormData } from "@/api/student";
import { renewEnrollment } from "@/api/enrollment";
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
const enrollmentRenewSchema = z.object({
  planId: z.string().min(1, "Plano é obrigatório"),
});

type EnrollmentEditSchema = z.infer<typeof enrollmentRenewSchema>;

const EnrollmentTabRenew = () => {
  const { currentEnrollment, closeRenewEnrollmentForm } = useEnrollmentTab();

  const queryClient = useQueryClient();

  const { data: formData, isLoading } = useQuery({
    queryKey: ["enrollment-form-data"],
    queryFn: getEnrollmentFormData,
  });

  const form = useForm<EnrollmentEditSchema>({
    resolver: zodResolver(enrollmentRenewSchema),
    values: {
      planId: currentEnrollment?.plan?.id || "",
    },
  });

  const renewEnrollmentMutation = useMutation({
    mutationKey: ["update-enrollment"],
    mutationFn: (data: EnrollmentEditSchema) => {
      if (!currentEnrollment?.id) throw new Error("Enrollment ID not found");
      return renewEnrollment(currentEnrollment.id, data.planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Matrícula atualizada com sucesso");
      closeRenewEnrollmentForm();
    },
    onError: () => {
      toast.error("Erro ao atualizar matrícula");
    },
  });

  const onSubmit = (data: EnrollmentEditSchema) => {
    renewEnrollmentMutation.mutate(data);
  };

  return (
    <section className="flex flex-col h-full w-full overflow-y-auto pb-12">
      <CardHeader className="mb-6 gap-1 w-full px-0">
        <section className="flex flex-row gap-1">
          <Button variant="ghost" onClick={closeRenewEnrollmentForm}>
            <ChevronLeft size={18} />
          </Button>
          <article className="flex flex-col gap-1">
            <CardTitle>Renovar Matrícula</CardTitle>
            <CardDescription>
              Renove os dados da matrícula: {currentEnrollment?.plan?.name} -{" "}
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
                          {formData?.plans?.map((plan: PlanFormData) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                              /mês | {plan.name}
                            </SelectItem>
                          ))}
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
                disabled={renewEnrollmentMutation.isPending}
                className="w-30"
                type="submit"
              >
                {renewEnrollmentMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Renovar"
                )}
              </Button>
            </section>
          </form>
        </Form>
      </SkeletonWrapper>
    </section>
  );
};

export { EnrollmentTabRenew };
