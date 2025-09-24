import { ColumnDef } from "@tanstack/react-table";
import { ModalityTable } from "@/interfaces/modality";
import { UpdateModalityDialog } from "../_components/update-modality-dialog";


export const columns: ColumnDef<ModalityTable>[] = [
  { accessorKey: "name", header: "Nome" },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <UpdateModalityDialog modality={row.original} />
  },
];
