import { ColumnDef } from "@tanstack/react-table";
import { TrialStudent } from "@/interfaces/trial-student";
import { UpdateTrialStudentDialog } from "../_components/update-trial-student-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const columns: ColumnDef<TrialStudent>[] = [
  {
    accessorKey: "lead.firstName",
    header: "Nome",
    cell: ({ row }) => {
      const lead = row.original.lead;
      return lead ? `${lead.firstName} ${lead.lastName}` : "-";
    },
  },
  {
    accessorKey: "lead.phone",
    header: "Telefone",
    cell: ({ row }) => {
      return row.original.lead?.phone || "-";
    },
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      const date = row.original.date;
      return date ? format(new Date(date), "dd/MM/yyyy", { locale: ptBR }) : "-";
    },
  },
  {
    accessorKey: "gridItem.dayOfWeek",
    header: "Dia da Semana",
    cell: ({ row }) => {
      const dayOfWeek = row.original.gridItem?.dayOfWeek;
      const dayLabels: Record<string, string> = {
        monday: "Segunda-feira",
        tuesday: "Terça-feira",
        wednesday: "Quarta-feira",
        thursday: "Quinta-feira",
        friday: "Sexta-feira",
        saturday: "Sábado",
        sunday: "Domingo",
      };
      return dayLabels[dayOfWeek || ""] || "-";
    },
  },
  {
    accessorKey: "gridItem.startTime",
    header: "Horário",
    cell: ({ row }) => {
      const startTime = row.original.gridItem?.startTime;
      const endTime = row.original.gridItem?.endTime;
      return startTime && endTime ? `${startTime} - ${endTime}` : "-";
    },
  },
  {
    accessorKey: "gridItem.class.modality.name",
    header: "Modalidade",
    cell: ({ row }) => {
      return row.original.gridItem?.class?.modality?.name || "-";
    },
  },
  {
    accessorKey: "gridItem.class.name",
    header: "Classe",
    cell: ({ row }) => {
      return row.original.gridItem?.class?.name || "-";
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <UpdateTrialStudentDialog trialStudent={row.original} />,
  },
];

