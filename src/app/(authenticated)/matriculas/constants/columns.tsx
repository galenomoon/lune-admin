import { StudentTable } from "@/interfaces/students";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UpdateEnrollmentDialog } from "../_components/update-enrollment-dialog";

const statusLabel = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELED: "Cancelado",
  OVERDUE: "Atrasado",
  RENEW: "Renovar",
};

export const columns: ColumnDef<StudentTable>[] = [
  { accessorKey: "studentName", header: "Nome do Aluno" },
  { accessorKey: "daysToExpire", header: "Prazo para Expirar" },
  {
    accessorKey: "phone",
    header: "WhatsApp",
    cell: ({ row }) => {
      if (!row.original.phone) return "-";
      const formattedPhone = row.original.phone
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      return (
        <a
          className="dark:text-pink-400 text-purple-600 underline"
          href={`https://wa.me/${row.original.phone}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {formattedPhone}
        </a>
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
