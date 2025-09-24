"use client";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./constants/columns";
import { getStudents } from "@/api/student";
import { useQuery } from "@tanstack/react-query";
import { CreateEnrollmentDialog } from "./_components/create-enrollment-dialog";

export default function Enrollments() {
  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <section className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Matrículas</h1>
        <section>
          <CreateEnrollmentDialog />
        </section>
      </section>
      <DataTable columns={columns} data={students || []} isLoading={isLoading} />
    </div>
  );
}
