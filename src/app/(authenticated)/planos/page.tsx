"use client";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./constants/columns";
import { getPlans } from "@/api/plan";
import { CreatePlanDialog } from "./_components/create-plan-dialog";

export default function Plans() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

  return (
    <div className="grid grid-cols-1 max-w-full gap-4">
      <section className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Planos</h1>
        <CreatePlanDialog />
      </section>
      <DataTable columns={columns} data={plans || []} isLoading={isLoading} />
    </div>
  );
}
