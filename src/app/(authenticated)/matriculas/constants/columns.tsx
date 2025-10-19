import { StudentTable } from "@/interfaces/students";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UpdateEnrollmentDialog } from "../_components/update-enrollment-dialog";
import { Clock, User } from "lucide-react";

const statusLabel = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELED: "Cancelado",
  OVERDUE: "Atrasado",
  RENEW: "Renovar",
};

export const columns: ColumnDef<StudentTable>[] = [
  {
    accessorKey: "studentName",
    header: "Nome do Aluno",
    cell: ({ row }) => {
      return (
        <a
          className=" flex items-center gap-2"
          href={`https://wa.me/${row.original.phone}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <User size={16} className="text-blue-500" />
          {row.original.studentName}
        </a>
      );
    },
  },
  {
    accessorKey: "plans",
    header: "Planos",
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1">
          {row.original.plans?.map((plan, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300"
            >
              {plan}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "modalities",
    header: "Modalidades",
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1">
          {row.original.modalities?.map((modality, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-300"
            >
              {modality}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={"outline"}
          className={cn(
            "font-semibold",
            row.original.status === "PENDING" &&
              "border-yellow-100 bg-yellow-100 text-yellow-900 dark:border-yellow-900 dark:bg-yellow-900 dark:text-yellow-200",
            row.original.status === "PAID" &&
              "border-green-100 bg-green-100 text-green-900 dark:border-green-900 dark:bg-green-900 dark:text-green-200",
            row.original.status === "CANCELED" &&
              "border-red-100 bg-red-100 text-red-900 dark:border-red-900 dark:bg-red-900 dark:text-red-200",
            row.original.status === "OVERDUE" &&
              "border-orange-100 bg-orange-100 text-orange-900 dark:border-orange-900 dark:bg-orange-900 dark:text-orange-200",
            row.original.status === "RENEW" &&
              "border-blue-100 bg-blue-100 text-blue-900 dark:border-blue-900 dark:bg-blue-900 dark:text-blue-200"
          )}
        >
          {statusLabel[row.original.status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "daysToExpire",
    header: "Prazo para Expirar",
    cell: ({ row }) => {
      return (
        <span className="flex items-center gap-2 text-gray-500">
          {row.original.daysToExpire && <Clock size={16} className="" />}
          {row.original.daysToExpire}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <UpdateEnrollmentDialog currentStudent={row.original} />
        </div>
      );
    },
  },
];
