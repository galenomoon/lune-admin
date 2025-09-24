"use client";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./constants/columns";
import { CreateModalityDialog } from "./_components/create-modality-dialog";
import { getModalities } from "@/api/modality";

export default function Modalities() {

  const { data: modalities, isLoading } = useQuery({
    queryKey: ["modalities"],
    queryFn: getModalities,
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <section className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Modalidades</h1>
        <CreateModalityDialog />
      </section>
      <DataTable columns={columns} data={modalities || []} isLoading={isLoading} />
    </div>
  );
}
