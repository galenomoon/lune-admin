"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGridItems, getGridFormData } from "@/api/grid";
import WeekGrid from "./_components/week-grid";
import { GridItem, GridFilters } from "@/interfaces/grid";
import { CreateGridDialog } from "./_components/create-grid-dialog";
import { UpdateGridDialog } from "./_components/update-grid-dialog";
import GridFiltersComponent from "./_components/grid-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock1 } from "lucide-react";

const GridPageSkeleton = () => {
  const dayNames = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  return (
    <div className="grid grid-cols-1 max-w-full gap-4">
      <section className="flex w-full justify-between items-center flex-shrink-0">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </section>

      <div className="space-y-4">
        {/* Header com busca e filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2">
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Grade de Horários Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[60dvh] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-20 border-b">
                <TableRow className="border-b">
                  <TableHead className="w-20 font-semibold flex items-center justify-center">
                    <Clock1 className="w-4 h-4" />
                  </TableHead>
                  {dayNames.map((day) => (
                    <TableHead
                      key={day}
                      className="text-center min-w-32 font-semibold"
                    >
                      {day}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 6 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="font-medium text-center h-[90px] m-2 text-xs text-muted-foreground flex items-center justify-center">
                      <Skeleton className="h-5 w-12" />
                    </TableCell>
                    {dayNames.map((_, colIndex) => (
                      <TableCell key={colIndex} className="p-1">
                        <div className="p-2 rounded-lg border flex flex-col items-center justify-center text-center h-[90px]">
                          <div className="space-y-2 w-full">
                            <Skeleton className="h-4 w-24 mx-auto" />
                            <Skeleton className="h-3 w-20 mx-auto" />
                            <Skeleton className="h-3 w-28 mx-auto" />
                            <div className="flex items-center w-full justify-center gap-4 mt-2">
                              <Skeleton className="h-5 w-12" />
                              <Skeleton className="h-5 w-8" />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function GradePage() {
  const [editingItem, setEditingItem] = useState<GridItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<GridFilters>({
    name: "",
    ageRange: "",
    teacherId: "",
    modalityId: "",
    classLevelId: "",
  });

  const { data: gridData, isLoading } = useQuery({
    queryKey: ["grid-items", filters],
    queryFn: () => getGridItems(filters),
  });

  const { data: formData, isLoading: isFormDataLoading } = useQuery({
    queryKey: ["grid-form-data"],
    queryFn: getGridFormData,
  });

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, name: search }));
  };

  const handleEdit = (item: GridItem) => {
    setEditingItem(item);
  };

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCleanFilters = () => {
    setFilters({
      name: "",
      ageRange: "",
      teacherId: "",
      modalityId: "",
      classLevelId: "",
    });
  };

  const filterLength = Object.values(filters).filter(
    (value) => value !== ""
  ).length;

  return (
    <SkeletonWrapper
      SkeletonComponent={GridPageSkeleton}
      isPending={isFormDataLoading}
    >
      <div className="grid grid-cols-1 max-w-full gap-4">
        <section className="flex w-full justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold">Grade de Aulas</h1>
            <p className="text-muted-foreground">
              Gerencie a grade de aulas semanais da escola
            </p>
          </div>
        </section>
        <WeekGrid
          data={gridData?.data || []}
          isLoading={isLoading}
          onSearch={handleSearch}
          onCreate={handleCreate}
          onEdit={handleEdit}
          cleanFilters={handleCleanFilters}
          filterLength={filterLength}
          FilterChildren={() => (
            <GridFiltersComponent
              formData={
                formData || {
                  modalities: [],
                  teachers: [],
                  classLevels: [],
                  classes: [],
                }
              }
              selectedFilter={filters}
              setSelectedFilter={setFilters}
            />
          )}
        />

        <CreateGridDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          formData={
            formData || {
              modalities: [],
              teachers: [],
              classLevels: [],
              classes: [],
            }
          }
        />

        {editingItem && (
          <UpdateGridDialog
            gridItem={editingItem}
            onClose={() => setEditingItem(null)}
            formData={
              formData || {
                modalities: [],
                teachers: [],
                classLevels: [],
                classes: [],
              }
            }
          />
        )}
      </div>
    </SkeletonWrapper>
  );
}
