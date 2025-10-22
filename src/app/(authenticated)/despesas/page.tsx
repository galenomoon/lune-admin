"use client";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./constants/columns";
import { getExpenses } from "@/api/expense";
import { CreateExpenseDialog } from "./_components/create-expense-dialog";
import { SettingsForm } from "./_components/settings-form";
import { Separator } from "@/components/ui/separator";

export default function Expenses() {
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  return (
    <div className="grid grid-cols-1 max-w-full gap-6">
      {/* Seção de Valores Fixos */}
      <SettingsForm />

      <Separator />

      {/* Seção de Despesas */}
      <section className="flex w-full justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Despesas Mensais</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas despesas recorrentes mensais
          </p>
        </div>
        <CreateExpenseDialog />
      </section>
      <DataTable columns={columns} data={expenses || []} isLoading={isLoading} />
    </div>
  );
}

