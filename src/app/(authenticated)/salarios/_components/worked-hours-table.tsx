"use client";
import { useState } from "react";
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
import { WorkedHour } from "@/interfaces/worked-hours";
import { Clock, User2, Star, UserPlus, Calendar, ListCollapse, UserCircle, DollarSign, CheckCircle } from "lucide-react";
import { dateToString } from "@/utils/parse-date";
import StudentsModal from "./students-modal";

interface WorkedHoursTableProps {
  workedHours: WorkedHour[];
  isLoading: boolean;
  onEdit: (workedHour: WorkedHour) => void;
}

const dayOfWeekMap: Record<number, string> = {
  0: "DOM",
  1: "SEG",
  2: "TER",
  3: "QUA",
  4: "QUI",
  5: "SEX",
  6: "SÁB",
};

const statusColors = {
  PENDING: "bg-yellow-900 text-yellow-200",
  DONE: "bg-green-900 text-green-200",
  CANCELED: "bg-red-900 text-red-200",
};

const statusLabels = {
  PENDING: "Pendente",
  DONE: "Realizada",
  CANCELED: "Não Realizada",
};

export default function WorkedHoursTable({
  workedHours,
  isLoading,
  onEdit,
}: WorkedHoursTableProps) {
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [selectedWorkedHour, setSelectedWorkedHour] = useState<WorkedHour | null>(null);

  const handleOpenStudentsModal = (workedHour: WorkedHour) => {
    setSelectedWorkedHour(workedHour);
    setIsStudentsModalOpen(true);
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDayOfWeek = (date: string) => {
    const d = new Date(date);
    return dayOfWeekMap[d.getDay()];
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Registros de Aulas</CardTitle>
        </CardHeader>
        <CardContent className="h-[60dvh] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-20 border-b">
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <ListCollapse className="h-4 w-4" />
                    Modalidade
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Horário
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <User2 className="h-4 w-4" />
                    Alunos
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Professor
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Conversões
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Status
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Valor
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Carregando registros...
                  </TableCell>
                </TableRow>
              ) : workedHours.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">
                        Nenhum registro encontrado
                      </p>
                      <p className="text-sm">
                        Registros de aulas aparecerão aqui
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                workedHours.map((workedHour) => {
                  const hours = workedHour.duration / 60;
                  const totalValue = hours * workedHour.priceSnapshot;

                  return (
                    <TableRow
                      key={workedHour.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onEdit(workedHour)}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {getDayOfWeek(workedHour.workedAt)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {dateToString(workedHour.workedAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {workedHour.modalityName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {workedHour.classLevel && workedHour.classDescription
                              ? `${workedHour.classLevel} • ${workedHour.classDescription}`
                              : workedHour.classLevel || workedHour.classDescription || ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-3 h-3" />
                          {formatTime(workedHour.startedAt)} -{" "}
                          {formatTime(workedHour.endedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleOpenStudentsModal(workedHour)}
                          >
                            <User2 className="w-3 h-3 mr-1" />
                            {workedHour.enrolledStudentsCount}
                          </Badge>
                          {workedHour.trialStudentsCount > 0 && (
                            <Badge
                              variant="outline"
                              className="cursor-pointer hover:opacity-80 transition-opacity bg-yellow-900 text-yellow-200"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              {workedHour.trialStudentsCount}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {workedHour.teacherName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            workedHour.newEnrollmentsCount < 1
                              ? "bg-red-900 text-red-200"
                              : "bg-green-900 text-green-200"
                          }
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          {workedHour.newEnrollmentsCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColors[workedHour.status]}
                        >
                          {statusLabels[workedHour.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        R${" "}
                        {totalValue.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Alunos */}
      {selectedWorkedHour && (
        <StudentsModal
          isOpen={isStudentsModalOpen}
          onClose={() => setIsStudentsModalOpen(false)}
          students={selectedWorkedHour.students || []}
          title={`Alunos - ${selectedWorkedHour.modalityName} • ${dateToString(selectedWorkedHour.workedAt)}`}
        />
      )}
    </>
  );
}

