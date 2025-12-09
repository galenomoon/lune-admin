"use client";
import { DataTable } from "@/components/ui/data-table";
import React, { useState } from "react";
import { columns } from "./constants/columns";
import { getStudents } from "@/api/student";
import { useQuery } from "@tanstack/react-query";
import { CreateEnrollmentDialog } from "./_components/create-enrollment-dialog";
import { EnrollmentFilters } from "./_components/enrollment-filters";

export default function Enrollments() {
  const [filters, setFilters] = useState<EnrollmentFilters>({
    search: "",
    planId: "",
    modalityId: "",
  });

  const { data: students, isLoading } = useQuery({
    queryKey: ["students", filters],
    queryFn: () => getStudents(filters),
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <section className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Matrículas</h1>
        <section>
          <CreateEnrollmentDialog />
        </section>
      </section>
      <EnrollmentFilters filters={filters} onFiltersChange={setFilters} />
      <DataTable columns={columns} data={students || []} isLoading={isLoading} />
    </div>
  );
}
