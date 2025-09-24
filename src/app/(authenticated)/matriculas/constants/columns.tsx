import { StudentTable } from "@/interfaces/students";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UpdateEnrollmentDialog } from "../_components/update-enrollment-dialog";

const statusLabel = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELED: "Cancelado",
};

export const columns: ColumnDef<StudentTable>[] = [
  { accessorKey: "studentName", header: "Nome do Aluno" },
  { accessorKey: "daysToExpire", header: "Prazo para Expirar" },
  {
    accessorKey: "phone",
    header: "WhatsApp",
    cell: ({ row }) => {
      if (!row.original.phone) return '-';
      const formattedPhone = row.original.phone.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      return (
        <a
          className="text-purple-600 underline"
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
              "border-yellow-500 bg-yellow-50 text-yellow-500",
            row.original.status === "PAID" &&
              "border-green-500 bg-green-50 text-green-500",
            row.original.status === "CANCELED" &&
              "border-red-500 bg-red-50 text-red-500"
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
          <UpdateEnrollmentDialog enrollment={row.original} />
        </div>
      );
    },
  },
];
