"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getEnrollmentFormData } from "@/api/student";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { ModalityFormData, PlanFormData } from "@/interfaces/enrollment";

export interface EnrollmentFilters {
  search: string;
  planId: string;
  modalityId: string;
}

interface EnrollmentFiltersProps {
  filters: EnrollmentFilters;
  onFiltersChange: (filters: EnrollmentFilters) => void;
}

export function EnrollmentFilters({
  filters,
  onFiltersChange,
}: EnrollmentFiltersProps) {
  const form = useForm<EnrollmentFilters>({
    defaultValues: {
      search: filters.search || "",
      planId: filters.planId || "",
      modalityId: filters.modalityId || "",
    },
  });

  const { data: formData } = useQuery({
    queryKey: ["enrollment-form-data"],
    queryFn: getEnrollmentFormData,
  });

  const handleSubmit = (data: EnrollmentFilters) => {
    onFiltersChange(data);
  };

  const handleClear = () => {
    form.reset({
      search: "",
      planId: "",
      modalityId: "",
    });
    onFiltersChange({
      search: "",
      planId: "",
      modalityId: "",
    });
  };

  const hasActiveFilters =
    form.watch("search") ||
    form.watch("planId") ||
    form.watch("modalityId");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barra de Pesquisa */}
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder="Pesquisar por nome ou sobrenome..."
                      className="pl-9"
                      onChange={(e) => {
                        field.onChange(e);
                        form.handleSubmit(handleSubmit)();
                      }}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Filtro por Plano */}
          <FormField
            control={form.control}
            name="planId"
            render={({ field }) => (
              <FormItem className="w-full md:w-[200px]">
                <FormControl>
                  <Select
                    value={field.value || undefined}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.handleSubmit(handleSubmit)();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os planos" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData?.plans?.map((plan: PlanFormData) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Filtro por Modalidade */}
          <FormField
            control={form.control}
            name="modalityId"
            render={({ field }) => (
              <FormItem className="w-full md:w-[200px]">
                <FormControl>
                  <Select
                    value={field.value || undefined}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.handleSubmit(handleSubmit)();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as modalidades" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData?.modalities?.map((modality: ModalityFormData) => (
                        <SelectItem key={modality.id} value={modality.id}>
                          {modality.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Botão Limpar Filtros */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="w-full md:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

