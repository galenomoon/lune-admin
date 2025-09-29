import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { GridFormSchema } from "../schemas/grid-schema";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
import { GridFormData } from "@/interfaces/grid";
import { DAY_LABELS, AGE_RANGE_OPTIONS, generateTimeOptions } from "../constants/grid";

interface GridFormProps {
  form: UseFormReturn<GridFormSchema>;
  onSubmit: (data: GridFormSchema) => void;
  isLoading: boolean;
  onDelete?: () => void;
  onDeleteLoading?: boolean;
  formData: GridFormData;
}

export default function GridForm({
  form,
  onSubmit,
  isLoading,
  onDelete,
  onDeleteLoading,
  formData,
}: GridFormProps) {
  const [gridItems, setGridItems] = useState([
    { dayOfWeek: "", startTime: "", endTime: "" },
  ]);

  // Sincronizar gridItems com os dados do formulário
  const watchedGridItems = form.watch("gridItems");
  useEffect(() => {
    if (watchedGridItems && watchedGridItems.length > 0) {
      setGridItems(watchedGridItems);
    }
  }, [watchedGridItems]);

  // Sincronizar também quando o formulário for resetado
  useEffect(() => {
    const formGridItems = form.getValues("gridItems");
    if (formGridItems && formGridItems.length > 0) {
      setGridItems(formGridItems);
    }
  }, [form]);

  // Sincronizar quando o formulário for resetado externamente
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "gridItems" && value.gridItems && Array.isArray(value.gridItems)) {
        const validGridItems = value.gridItems.filter((item): item is { dayOfWeek: string; startTime: string; endTime: string } => 
          item !== undefined && 
          typeof item.dayOfWeek === 'string' && 
          typeof item.startTime === 'string' && 
          typeof item.endTime === 'string'
        );
        if (validGridItems.length > 0) {
          setGridItems(validGridItems);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const addGridItem = () => {
    const newGridItems = [
      ...gridItems,
      { dayOfWeek: "", startTime: "", endTime: "" },
    ];
    setGridItems(newGridItems);
    form.setValue("gridItems", newGridItems);
  };

  const removeGridItem = (index: number) => {
    if (gridItems.length > 1) {
      const newGridItems = gridItems.filter((_, i) => i !== index);
      setGridItems(newGridItems);
      form.setValue("gridItems", newGridItems);
    }
  };

  const updateGridItem = (index: number, field: string, value: string) => {
    const newGridItems = gridItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setGridItems(newGridItems);
    
    // Atualizar o formulário também
    form.setValue("gridItems", newGridItems);
  };

  const handleSubmit = (data: GridFormSchema) => {
    const payload = {
      ...data,
      gridItems,
    };
    onSubmit(payload);
  };

  const dayOptions = Object.entries(DAY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const maxStudentsOptions = Array.from({ length: 20 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col h-full justify-between"
      >
        <section className="space-y-6">
          {/* Dados da Aula */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Aula</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Modalidade */}
              <FormField
                control={form.control}
                name="class.modalityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma modalidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formData?.modalities?.map((modality) => (
                          <SelectItem key={modality.id} value={modality.id}>
                            {modality.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nível */}
              <FormField
                control={form.control}
                name="class.classLevelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formData?.classLevels?.map((classLevel) => (
                          <SelectItem key={classLevel.id} value={classLevel.id}>
                            {classLevel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Professor */}
              <FormField
                control={form.control}
                name="class.teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um professor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formData?.teachers?.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.firstName} {teacher.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Faixa Etária */}
              <FormField
                control={form.control}
                name="class.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faixa Etária</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma faixa etária" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AGE_RANGE_OPTIONS?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Quantidade Máxima de Alunos */}
            <FormField
              control={form.control}
              name="class.maxStudents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade Máxima de Alunos</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a quantidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {maxStudentsOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dia e Horário */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dia e Horário</h3>
            
            <div className="space-y-4">
              {gridItems.map((gridItem, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    {/* Dia da Semana */}
                    <div>
                      <label className="text-sm font-medium">Dia da semana</label>
                      <Select
                        value={gridItem.dayOfWeek}
                        onValueChange={(value) => updateGridItem(index, "dayOfWeek", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {dayOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Horário de Início */}
                    <div>
                      <label className="text-sm font-medium">Horário de início</label>
                      <Select
                        value={gridItem.startTime}
                        onValueChange={(value) => updateGridItem(index, "startTime", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateTimeOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Horário de Fim */}
                    <div>
                      <label className="text-sm font-medium">Horário de fim</label>
                      <Select
                        value={gridItem.endTime}
                        onValueChange={(value) => updateGridItem(index, "endTime", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateTimeOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-2">
                    {gridItems.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeGridItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {index === gridItems.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={addGridItem}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
          <Button type="submit" className="px-12" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
