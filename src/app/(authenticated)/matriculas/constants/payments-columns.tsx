import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Payment } from "@/interfaces/payment";
import { cn } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import ActionsPaymentButtons from "@/app/(authenticated)/matriculas/_components/actions-payment-buttons";
import { dateToString } from "@/utils/parse-date";

export const paymentsColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "paymentDate",
    header: "Pago em",
    cell: ({ row }) => {
      if (row.original.status !== "PAID") {
        return "-";
      }
      return dateToString(row.original.updatedAt);
    },
  },
  {
    accessorKey: "dueDate",
    header: "Vence em",
    cell: ({ row }) => {
      return dateToString(row.original.dueDate);
    },
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      return row.original.amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  {
    accessorKey: "modality",
    header: "Modalidade",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors = {
        PENDING: "bg-yellow-50 border-yellow-500 text-yellow-500",
        PAID: "bg-green-50 border-green-500 text-green-500",
        CANCELED: "bg-red-50 border-red-500 text-red-500",
        OVERDUE: "bg-red-50 border-red-500 text-red-500",
      };
      const statusLabel = {
        PENDING: "Pendente",
        PAID: "Pago",
        CANCELED: "Cancelado",
        OVERDUE: "Vencido",
      };
      return (
        <Badge
          variant="outline"
          className={cn("font-semibold", statusColors[status])}
        >
          {statusLabel[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <ActionsPaymentButtons payment={row.original} />,
  },
];

export const paymentColumnsDashboard = [
  { accessorKey: "enrollment.student.firstName", header: "Nome" },
  { accessorKey: "enrollment.student.lastName", header: "Sobrenome" },
  { accessorKey: "enrollment.class.modality.name", header: "Modalidade" },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }: { row: Row<Payment> }) => {
      return row.original.amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  {
    accessorKey: "dueDate",
    header: "Vencimento",
    cell: ({ row }: { row: Row<Payment> }) => {
      return dateToString(row.original.dueDate);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: Row<Payment> }) => {
      const status = row.original.status;
      const statusColors = {
        PENDING: "bg-yellow-50 border-yellow-500 text-yellow-500",
        PAID: "bg-green-50 border-green-500 text-green-500",
        OVERDUE: "bg-red-50 border-red-500 text-red-500",
        CANCELED: "bg-red-50 border-red-500 text-red-500",
      };
      const statusLabel = {
        PENDING: "Pendente",
        PAID: "Pago",
        OVERDUE: "Vencido",
        CANCELED: "Cancelado",
      };
      return (
        <Badge
          variant="outline"
          className={cn("font-semibold", statusColors[status])}
        >
          {statusLabel[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }: { row: Row<Payment> }) => (
      <ActionsPaymentButtons hideEditButton payment={row.original} />
    ),
  },
];
