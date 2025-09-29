"use client";
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPendingTrialStudents,
  updateTrialStudentStatus,
} from "@/api/trial-student";
import { toast } from "sonner";

const statusOptions = [
  {
    value: "CONVERTED",
    label: "Convertida em Matrícula",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "NOT_CONVERTED",
    label: "Não Convertida",
    color: "bg-red-100 text-red-800",
  },
  {
    value: "CANCELLED",
    label: "Cancelada",
    color: "bg-gray-100 text-gray-800",
  },
];

export default function PendingTrialStudentsTable() {
  const queryClient = useQueryClient();

  const { data: pendingData, isLoading } = useQuery({
    queryKey: ["pending-trial-students"],
    queryFn: getPendingTrialStudents,
  });

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateTrialStudentStatus(id, status),
    onSuccess: () => {
      toast.success("Status atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["pending-trial-students"] });
      queryClient.invalidateQueries({ queryKey: ["trial-students"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar status");
    },
  });

  const handleStatusChange = (trialStudentId: string, newStatus: string) => {
    
    updateStatus({ id: trialStudentId, status: newStatus });
  };

  const trialStudents = pendingData?.data || [];

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  const getDayLabel = (dayOfWeek: string) => {
    const dayLabels: Record<string, string> = {
      monday: "Segunda-feira",
      tuesday: "Terça-feira",
      wednesday: "Quarta-feira",
      thursday: "Quinta-feira",
      friday: "Sexta-feira",
      saturday: "Sábado",
      sunday: "Domingo",
    };
    return dayLabels[dayOfWeek] || dayOfWeek;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Aulas Pendentes de Status</h3>
          <p className="text-sm text-muted-foreground">
            Defina o status final das aulas experimentais que já aconteceram
          </p>
        </div>
        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
          {trialStudents.length} pendente{trialStudents.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Data da Aula</TableHead>
              <TableHead>Modalidade</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Status Atual</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Carregando pendências...
                </TableCell>
              </TableRow>
            ) : (
              trialStudents.map((trialStudent) => (
                <TableRow key={trialStudent.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {trialStudent.lead?.firstName}{" "}
                          {trialStudent.lead?.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trialStudent.lead?.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {format(new Date(trialStudent.date), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getDayLabel(trialStudent.gridItem?.dayOfWeek || "")}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {trialStudent.gridItem?.class?.modality?.name}{" "}
                        <span className="italic text-xs text-muted-foreground">
                          (
                          {
                            trialStudent.gridItem?.class?.teacher?.firstName?.split(
                              " "
                            )[0]
                          }
                          )
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {trialStudent.gridItem?.class?.classLevel?.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatTime(trialStudent.gridItem?.startTime || "")} -{" "}
                        {formatTime(trialStudent.gridItem?.endTime || "")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-yellow-600 border-yellow-300"
                    >
                      Pendente
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={trialStudent.status}
                      onValueChange={(value) =>
                        handleStatusChange(trialStudent.id, value)
                      }
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  option.color.split(" ")[0]
                                }`}
                              />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {trialStudents.length === 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            Nenhuma aula pendente de status no momento
          </div>
        </div>
      )}
    </div>
  );
}
