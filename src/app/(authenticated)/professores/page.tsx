"use client";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./constants/columns";
import { getTeachers } from "@/api/teacher";
import { CreateTeacherDialog } from "./_components/create-teacher-dialog";

export default function Teachers() {
  const { data: teachers, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <section className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Professores</h1>
        <CreateTeacherDialog />
      </section>
      <DataTable columns={columns} data={teachers || []} isLoading={isLoading} />
    </div>
  );
}
