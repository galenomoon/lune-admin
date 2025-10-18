import React from "react";
import { GridFormData, GridFilters as GridFiltersType } from "@/interfaces/grid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface GridFiltersProps {
  formData: GridFormData;
  selectedFilter: GridFiltersType;
  setSelectedFilter: (filter: GridFiltersType) => void;
}

export default function GridFilters({
  formData,
  selectedFilter,
  setSelectedFilter,
}: GridFiltersProps) {
  const ageRangeOptions = [
    { value: "Pré-Baby", label: "Pré-Baby" },
    { value: "Baby", label: "Baby" },
    { value: "Infantil", label: "Infantil" },
    { value: "Infanto-Juvenil", label: "Infanto-Juvenil" },
    { value: "Juvenil", label: "Juvenil" },
    { value: "Adulto", label: "Adulto" },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Filtros</h4>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Modalidade */}
        <div className="space-y-2">
          <Label htmlFor="modality">Modalidade</Label>
          <Select
            value={selectedFilter.modalityId}
            onValueChange={(value) =>
              setSelectedFilter({ ...selectedFilter, modalityId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as modalidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as modalidades</SelectItem>
              {formData?.modalities?.map((modality) => (
                <SelectItem key={modality.id} value={modality.id}>
                  {modality.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Professor */}
        <div className="space-y-2">
          <Label htmlFor="teacher">Professor</Label>
          <Select
            value={selectedFilter.teacherId}
            onValueChange={(value) =>
              setSelectedFilter({ ...selectedFilter, teacherId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os professores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os professores</SelectItem>
              {formData?.teachers?.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nível */}
        <div className="space-y-2">
          <Label htmlFor="classLevel">Nível</Label>
          <Select
            value={selectedFilter.classLevelId}
            onValueChange={(value) =>
              setSelectedFilter({ ...selectedFilter, classLevelId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os níveis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os níveis</SelectItem>
              {formData?.classLevels?.map((classLevel) => (
                <SelectItem key={classLevel.id} value={classLevel.id}>
                  {classLevel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Faixa Etária */}
        <div className="space-y-2">
          <Label htmlFor="ageRange">Faixa Etária</Label>
          <Select
            value={selectedFilter.ageRange}
            onValueChange={(value) =>
              setSelectedFilter({ ...selectedFilter, ageRange: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as faixas etárias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as faixas etárias</SelectItem>
              {ageRangeOptions?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

