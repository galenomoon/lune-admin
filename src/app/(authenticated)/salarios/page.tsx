"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWorkedHours } from "@/api/worked-hours";
import MonthNavigation from "./_components/month-navigation";
import SalaryCards from "./_components/salary-cards";
import WorkedHoursTable from "./_components/worked-hours-table";
import CreateWorkedHourDialog from "./_components/create-worked-hour-dialog";
import UpdateWorkedHourDialog from "./_components/update-worked-hour-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkedHour } from "@/interfaces/worked-hours";

export default function SalariosPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWorkedHour, setEditingWorkedHour] = useState<WorkedHour | null>(null);

  const { data: workedHoursData, isLoading } = useQuery({
    queryKey: ["worked-hours", selectedMonth, selectedYear],
    queryFn: () => getWorkedHours(selectedMonth, selectedYear),
  });

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
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Registro
          </Button>
        </div>
      </section>

      {/* Cards */}
      {workedHoursData?.cards && <SalaryCards cards={workedHoursData.cards} />}

      {/* Tabela de Registros */}
      <WorkedHoursTable
        workedHours={workedHoursData?.workedHours || []}
        isLoading={isLoading}
        onEdit={(workedHour) => setEditingWorkedHour(workedHour)}
      />

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

