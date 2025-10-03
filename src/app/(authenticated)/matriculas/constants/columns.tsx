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
