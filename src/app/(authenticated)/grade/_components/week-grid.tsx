"use client";
import React, { useState } from "react";
import { GridItem, GridSchedule } from "@/interfaces/grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, User2, Star, Clock, Clock1, Phone, Calendar } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dateToString } from "@/utils/parse-date";

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
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [selectedGridItem, setSelectedGridItem] = useState<GridItem | null>(null);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const handleOpenStudentsModal = (item: GridItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedGridItem(item);
    setIsStudentsModalOpen(true);
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
    if (enrolledStudents === 0) return "bg-zinc-800 text-zinc-300";
    const percentage = (enrolledStudents / maxStudents) * 100;
    if (percentage >= 100) return "bg-red-900 text-red-200";
    if (percentage >= 80) return "bg-yellow-900 text-yellow-200";
    return "bg-green-900 text-green-200";
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
                      <TableCell className="font-medium text-center h-[90px] m-2 text-xs text-muted-foreground flex items-center justify-center">
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

                        const hasTrialStudents = item?.trialStudentsList?.length as never as number > 0;
                        const qtdTrialStudents = item?.trialStudentsList?.length as never as number;

                        return (
                          <TableCell key={dayKey} className="p-1">
                            {item ? (
                              <div
                                className="p-2 rounded-lg border flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
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
                                      {item.description} • {item.level}
                                    </div>
                                  </article>
                                  <div className="flex items-center w-full justify-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={`text-xs cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(
                                        item.enrolledStudents || 0,
                                        item.maxStudents || 1
                                      )}`}
                                      onClick={(e) => handleOpenStudentsModal(item, e)}
                                    >
                                      <User2 className="w-4 h-4" />
                                      {item.enrolledStudents || 0}/
                                      {item.maxStudents || 1}
                                    </Badge>
                                    {!hasTrialStudents ? (
                                      <></>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={(e) => handleOpenStudentsModal(item, e)}
                                      >
                                        <Star className="w-4 h-4" />
                                        {qtdTrialStudents}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="
                                    rounded-lg border border-zinc-800 border-dashed
                                    flex items-center justify-center h-[90px] w-full"
                              >
                                <p className="text-xs text-zinc-800">
                                  horário vazio
                                </p>
                              </div>
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
        </CardContent>
      </Card>

      {/* Modal de Alunos */}
      <Dialog open={isStudentsModalOpen} onOpenChange={setIsStudentsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Alunos - {selectedGridItem?.modality} • {selectedGridItem?.level}
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="enrolled" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="enrolled" className="gap-2">
                <User2 className="w-4 h-4" />
                Matriculados ({selectedGridItem?.enrolledStudentsList?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="trial" className="gap-2">
                <Star className="w-4 h-4" />
                Aula Experimental ({selectedGridItem?.trialStudentsList?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="enrolled" className="space-y-4">
              <div className="max-h-[400px] overflow-y-auto">
                {selectedGridItem?.enrolledStudentsList && selectedGridItem.enrolledStudentsList.length > 0 ? (
                  <div className="space-y-2">
                    {selectedGridItem.enrolledStudentsList.map((enrollment) => (
                      <Card key={enrollment.id} className="h-fit py-0">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User2 className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {enrollment.student?.firstName} {enrollment.student?.lastName}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <User2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum aluno matriculado nesta aula</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trial" className="space-y-4">
              <div className="max-h-[400px] overflow-y-auto">
                {selectedGridItem?.trialStudentsList && selectedGridItem.trialStudentsList.length > 0 ? (
                  <div className="space-y-2">
                    {selectedGridItem.trialStudentsList.map((trialStudent) => (
                      <Card key={trialStudent.id} className="h-fit py-0">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <Star className="w-5 h-5 text-yellow-500" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {trialStudent.lead?.firstName} {trialStudent.lead?.lastName}
                                </p>
                                <div className="text-sm text-muted-foreground space-y-0.5">
                                  <p className="flex items-center  gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {dateToString(trialStudent.date)}
                                  </p>
                                  {trialStudent.lead?.phone && (
                                    <p className="flex items-center  gap-2">
                                      <Phone className="w-4 h-4" />
                                      {trialStudent.lead.phone}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum aluno experimental agendado nesta aula</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
