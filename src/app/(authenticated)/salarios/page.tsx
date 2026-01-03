"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getWorkedHours, getWorkedHoursByTeacher, createBatchWorkedHours } from "@/api/worked-hours";
import { getTeachers } from "@/api/teacher";
import MonthNavigation from "./_components/month-navigation";
import SalaryCards from "./_components/salary-cards";
import WorkedHoursTable from "./_components/worked-hours-table";
import TeacherSalaryTable from "./_components/teacher-salary-table";
import CreateWorkedHourDialog from "./_components/create-worked-hour-dialog";
import UpdateWorkedHourDialog from "./_components/update-worked-hour-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, List, Users, RefreshCw, UserCircle, X } from "lucide-react";
import { WorkedHour } from "@/interfaces/worked-hours";
import { toast } from "sonner";

export default function SalariosPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | undefined>(undefined);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWorkedHour, setEditingWorkedHour] = useState<WorkedHour | null>(null);
  const [activeTab, setActiveTab] = useState("geral");
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);

  const queryClient = useQueryClient();

  const { data: teachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const { data: workedHoursData, isLoading } = useQuery({
    queryKey: ["worked-hours", selectedMonth, selectedYear, selectedTeacherId],
    queryFn: () => getWorkedHours(selectedMonth, selectedYear, selectedTeacherId),
  });

  const { data: teacherSalaryData, isLoading: isLoadingTeachers } = useQuery({
    queryKey: ["worked-hours-by-teacher", selectedMonth, selectedYear],
    queryFn: () => getWorkedHoursByTeacher(selectedMonth, selectedYear),
  });

  const handleCreateBatch = async () => {
    setIsCreatingBatch(true);
    try {
      const result = await createBatchWorkedHours();
      
      // Atualizar queries para refletir os novos dados
      await queryClient.invalidateQueries({
        queryKey: ["worked-hours", selectedMonth, selectedYear, selectedTeacherId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["worked-hours-by-teacher", selectedMonth, selectedYear],
      });
      
      toast.success(`Registros criados com sucesso! Total: ${result.count} aulas.`);
    } catch (error) {
      console.error("Erro ao criar batch:", error);
      toast.error("Erro ao criar registros de aulas. Tente novamente.");
    } finally {
      setIsCreatingBatch(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <section className="flex w-full justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Salários</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe os pagamentos dos professores
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MonthNavigation
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
          {activeTab === "geral" && (
            <>
              <Select
                value={selectedTeacherId || "all"}
                onValueChange={(value) => setSelectedTeacherId(value === "all" ? undefined : value)}
              >
                <SelectTrigger className="w-[200px]">
                  <UserCircle className="h-4 w-4" />
                  <SelectValue placeholder="Filtrar por professor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os professores</SelectItem>
                  {teachers?.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTeacherId && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedTeacherId(undefined)}
                  title="Remover filtro"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={handleCreateBatch}
                disabled={isCreatingBatch}
                variant="outline"
                size="icon"
                title="Criar registros de aulas do dia"
              >
                <RefreshCw className={`h-4 w-4 ${isCreatingBatch ? "animate-spin" : ""}`} />
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Registro
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Cards */}
      {workedHoursData?.cards && <SalaryCards cards={workedHoursData.cards} />}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="geral" className="gap-2">
            <List className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="por-professor" className="gap-2">
            <Users className="h-4 w-4" />
            Por Professor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <WorkedHoursTable
            workedHours={workedHoursData?.workedHours || []}
            isLoading={isLoading}
            onEdit={(workedHour) => setEditingWorkedHour(workedHour)}
          />
        </TabsContent>

        <TabsContent value="por-professor">
          <TeacherSalaryTable
            teachers={teacherSalaryData?.teachers || []}
            isLoading={isLoadingTeachers}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog de Criação */}
      <CreateWorkedHourDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      {/* Dialog de Edição */}
      <UpdateWorkedHourDialog
        workedHour={editingWorkedHour}
        onClose={() => setEditingWorkedHour(null)}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </div>
  );
}

