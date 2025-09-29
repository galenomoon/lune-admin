"use client";
import React, { useState } from "react";
import { GridItem, GridSchedule } from "@/interfaces/grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, User2, Star, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface WeekGridProps {
  data: GridSchedule[];
  isLoading: boolean;
  onSearch: (search: string) => void;
  onCreate: () => void;
  onEdit: (item: GridItem) => void;
  cleanFilters: () => void;
  filterLength: number;
  FilterChildren: React.ComponentType;
}

const dayNames = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const dayKeys = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function WeekGrid({
  data,
  isLoading,
  onSearch,
  onCreate,
  onEdit,
  cleanFilters,
  filterLength,
  FilterChildren,
}: WeekGridProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const getTimeSlots = () => {
    const slots = new Set<string>();

    // Coletar apenas os horários que têm pelo menos uma aula
    data.forEach((schedule) => {
      dayKeys.forEach((dayKey) => {
        const item = schedule[dayKey as keyof GridSchedule] as GridItem;
        if (item && item.startTime) {
          slots.add(item.startTime);
        }
      });
    });

    // Converter para array e ordenar
    return Array.from(slots).sort((a, b) => {
      const [hourA, minuteA] = a.split(":").map(Number);
      const [hourB, minuteB] = b.split(":").map(Number);
      return hourA * 60 + minuteA - (hourB * 60 + minuteB);
    });
  };

  const timeSlots = getTimeSlots();


  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const getStatusColor = (enrolledStudents: number, maxStudents: number) => {
    if (enrolledStudents === 0) return "bg-gray-100 text-gray-800";
    const percentage = (enrolledStudents / maxStudents) * 100;
    if (percentage >= 100) return "bg-red-100 text-red-800";
    if (percentage >= 80) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="space-y-4">
      {/* Header com busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por modalidade..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {filterLength > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {filterLength}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <FilterChildren />
            </PopoverContent>
          </Popover>
          {filterLength > 0 && (
            <Button variant="ghost" onClick={cleanFilters}>
              Limpar
            </Button>
          )}
        </div>
        <Button onClick={onCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Aula
        </Button>
      </div>

      {/* Grade de Horários */}
      <Card>
        <CardHeader>
          <CardTitle>Grade de Aulas Semanais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Horário</TableHead>
                  {dayNames.map((day) => (
                    <TableHead key={day} className="text-center min-w-32">
                      {day}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Carregando grade...
                    </TableCell>
                  </TableRow>
                ) : timeSlots.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">
                          Nenhuma aula encontrada
                        </p>
                        <p className="text-sm">
                          Adicione uma nova aula para começar
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  timeSlots.map((timeSlot) => {
                    // Verificar se há pelo menos uma aula neste horário
                    const hasAnyClass = data.some((schedule) => {
                      return dayKeys.some((dayKey) => {
                        const item = schedule[
                          dayKey as keyof GridSchedule
                        ] as GridItem;
                        return item && item.startTime === timeSlot;
                      });
                    });

                    if (!hasAnyClass) return null;

                    return (
                      <TableRow key={timeSlot}>
                        <TableCell className="font-medium">
                          {formatTime(timeSlot)}
                        </TableCell>
                        {dayKeys.map((dayKey) => {
                          const schedule = data.find((s) => {
                            const item = s[
                              dayKey as keyof GridSchedule
                            ] as GridItem;
                            return item && item.startTime === timeSlot;
                          });
                          const item = schedule?.[
                            dayKey as keyof GridSchedule
                          ] as GridItem;
                          const hasTrialStudents =
                            item?.trialStudents &&
                            item?.trialStudents?.length > 0;

                          return (
                            <TableCell key={dayKey} className="p-1">
                              {item ? (
                                <div
                                  className="p-2 min-w-[160px] rounded-lg border flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
                                  onClick={() => onEdit(item)}
                                >
                                  <div className="space-y-1 w-full">
                                    <article className="flex flex-col gap-">
                                      <div className="font-medium text-sm">
                                        {item.modality}
                                      </div>
                                      <div className="text-xs text-gray-500 flex items-center gap-1 w-full justify-center">
                                        <Clock className="w-2.5 h-2.5" />
                                        {formatTime(item.startTime)} -{" "}
                                        {formatTime(item.endTime)}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {item.level} • {item.teacherName}
                                      </div>
                                    </article>
                                    <div className="flex items-center w-full justify-center gap-4">
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${getStatusColor(
                                          item.enrolledStudents || 0,
                                          item.maxStudents || 1
                                        )}`}
                                      >
                                        <User2 className="w-4 h-4" />
                                        {item.enrolledStudents || 0}/
                                        {item.maxStudents || 1}
                                      </Badge>
                                      {hasTrialStudents ? (
                                        <></>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          <Star className="w-4 h-4" />
                                          {item?.trialStudents?.length || 0}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-20"></div>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
