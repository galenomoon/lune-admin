import { ColumnDef } from "@tanstack/react-table";
import { PlanTable } from "@/interfaces/plan";
import { UpdatePlanDialog } from "../_components/update-plan-dialog";

export const columns: ColumnDef<PlanTable>[] = [
  { accessorKey: "name", header: "Nome" },
  { 
    accessorKey: "weeklyClasses", 
    header: "Aulas por semana",
    cell: ({ row }) => {
      return `${row.original.weeklyClasses} aulas`;
    }
  },
  {
    accessorKey: "durationInDays",
    header: "Duração de Contrato",
    cell: ({ row }) => {
      const days = row.original.durationInDays;
      if (days === 30) return "1 mês";
      if (days === 60) return "2 meses";
      if (days === 90) return "3 meses";
      if (days === 180) return "6 meses";
      if (days === 365) return "1 ano";
      return `${days} dias`;
    }
  },
  {
    accessorKey: "price",
    header: "Mensalidade",
    cell: ({ row }) => {
      return row.original.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }
  },
  {
    accessorKey: "enrollmentsQuantity",
    header: "Matrículas",
    cell: ({ row }) => {
      return `${row.original.enrollmentsQuantity} alunos`;
    }
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <UpdatePlanDialog plan={row.original} />
  },
];
