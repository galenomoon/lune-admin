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
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WorkedHour } from "@/interfaces/worked-hours";
import { Clock, User2, Star, UserPlus, Calendar, ListCollapse, UserCircle, DollarSign, CheckCircle, Edit, Trash2, Check, MoreVertical } from "lucide-react";
import { dateToString } from "@/utils/parse-date";
import StudentsModal from "./students-modal";
import { deleteWorkedHour, updateWorkedHour } from "@/api/worked-hours";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workedHourToDelete, setWorkedHourToDelete] = useState<WorkedHour | null>(null);

  const queryClient = useQueryClient();

  const handleOpenStudentsModal = (workedHour: WorkedHour) => {
    setSelectedWorkedHour(workedHour);
    setIsStudentsModalOpen(true);
  };

  // Mutation para deletar
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWorkedHour(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worked-hours"] });
      toast.success("Registro deletado com sucesso!");
      setIsDeleteDialogOpen(false);
      setWorkedHourToDelete(null);
    },
    onError: () => {
      toast.error("Erro ao deletar registro");
    },
  });

  // Mutation para confirmar (mudar status para DONE)
  const confirmMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "DONE" }) =>
      updateWorkedHour(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worked-hours"] });
      toast.success("Registro confirmado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao confirmar registro");
    },
  });

  const handleDeleteClick = (workedHour: WorkedHour) => {
    setWorkedHourToDelete(workedHour);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (workedHourToDelete) {
      deleteMutation.mutate(workedHourToDelete.id);
    }
  };

  const handleConfirmStatus = (workedHour: WorkedHour) => {
    confirmMutation.mutate({ id: workedHour.id, status: "DONE" });
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
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <MoreVertical className="h-4 w-4" />
                    Ações
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Carregando registros...
                  </TableCell>
                </TableRow>
              ) : workedHours.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
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
                      className="hover:bg-muted/50"
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenStudentsModal(workedHour);
                            }}
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
                      <TableCell>
                        <div className="flex gap-2">
                          {/* Botão de Confirmar - apenas se status for PENDING */}
                          {workedHour.status === "PENDING" && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmStatus(workedHour);
                              }}
                              disabled={confirmMutation.isPending}
                              className="border-green-500 text-green-500 bg-green-50"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {/* Botão de Editar */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(workedHour);
                            }}
                            className="border-blue-500 text-blue-500 bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          {/* Botão de Deletar */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(workedHour);
                            }}
                            className="border-red-500 text-red-500 bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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

      {/* Alert Dialog de Confirmação de Deleção */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este registro de horas trabalhadas?
              {workedHourToDelete && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="font-medium">
                    {workedHourToDelete.teacherName} - {workedHourToDelete.modalityName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dateToString(workedHourToDelete.workedAt)}
                  </p>
                </div>
              )}
              <p className="mt-2 text-destructive font-medium">
                Esta ação não pode ser desfeita.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

