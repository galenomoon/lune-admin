"use client";
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
import { TeacherSalary } from "@/interfaces/worked-hours";
import { UserCircle, BookOpen, UserPlus, DollarSign, ListChecks, CheckCircle } from "lucide-react";
import PixPaymentPopover from "./pix-payment-popover";

interface TeacherSalaryTableProps {
  teachers: TeacherSalary[];
  isLoading: boolean;
}

export default function TeacherSalaryTable({
  teachers,
  isLoading,
}: TeacherSalaryTableProps) {

  console.log(teachers);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salários por Professor</CardTitle>
      </CardHeader>
      <CardContent className="h-[60dvh] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-20 border-b">
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  Professor
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Aulas Avulsas
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
                  <DollarSign className="h-4 w-4" />
                  Valor Hora
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total a Receber
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  Modalidades
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Ação
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Carregando dados...
                </TableCell>
              </TableRow>
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-gray-500">
                    <p className="text-lg font-medium">
                      Nenhum registro encontrado
                    </p>
                    <p className="text-sm">
                      Dados de salários de professores aparecerão aqui
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow key={teacher.teacherId} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{teacher.teacherName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-900 text-blue-200">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {teacher.totalClasses}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        teacher.newEnrollments < 1
                          ? "bg-red-900 text-red-200"
                          : "bg-green-900 text-green-200"
                      }
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      {teacher.newEnrollments}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      R${" "}
                      {teacher.priceHour.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-lg">
                      R${" "}
                      {teacher.totalToPay.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.modalities.map((modality, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-purple-900 text-purple-200 text-xs"
                        >
                          {modality}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <PixPaymentPopover
                      teacherName={teacher.teacherName}
                      pixKey={teacher.pixKey}
                      amount={teacher.totalToPay}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

