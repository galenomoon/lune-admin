"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGridItems, getGridFormData } from "@/api/grid";
import WeekGrid from "./_components/week-grid";
import { GridItem, GridFilters } from "@/interfaces/grid";
import { CreateGridDialog } from "./_components/create-grid-dialog";
import { UpdateGridDialog } from "./_components/update-grid-dialog";
import GridFiltersComponent from "./_components/grid-filters";

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

  if (isFormDataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
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
  );
}
