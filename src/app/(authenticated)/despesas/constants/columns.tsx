import { ColumnDef } from "@tanstack/react-table";
import { Expense } from "@/interfaces/expense";
import { UpdateExpenseDialog } from "../_components/update-expense-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ActionsExpenseButtons from "../_components/actions-expense-buttons";

export const columns: ColumnDef<Expense>[] = [
  { 
    accessorKey: "name", 
    header: "Nome" 
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => row.original.description || "-",
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
    accessorKey: "dueDay",
    header: "Dia do Vencimento",
    cell: ({ row }) => {
      return `Todo dia ${row.original.dueDay}`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors = {
        PENDING: "bg-yellow-50 border-yellow-500 text-yellow-500 dark:bg-yellow-900 dark:border-yellow-900 dark:text-yellow-200",
        PAID: "bg-green-50 border-green-500 text-green-500 dark:bg-green-900 dark:border-green-900 dark:text-green-200",
        OVERDUE: "bg-red-50 border-red-500 text-red-500 dark:bg-orange-900 dark:border-orange-900 dark:text-orange-200",
      };
      const statusLabel = {
        PENDING: "Pendente",
        PAID: "Pago",
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
    cell: ({ row }) => (
      <div className="flex gap-2">
        <ActionsExpenseButtons expense={row.original} />
        <UpdateExpenseDialog expense={row.original} />
      </div>
    ),
  },
];

