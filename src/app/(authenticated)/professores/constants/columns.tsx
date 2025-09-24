import { ColumnDef } from "@tanstack/react-table";
import { TeacherTable } from "@/interfaces/teacher";
import { toast } from "sonner";
import { UpdateTeacherDialog } from "../_components/update-teacher-dialog";


export const columns: ColumnDef<TeacherTable>[] = [
  { accessorKey: "firstName", header: "Nome" },
  { accessorKey: "lastName", header: "Sobrenome" },
  {
    accessorKey: "birthDate",
    header: "Idade",
    cell: ({ row }) => {
      const birthDate = row.original.birthDate;
      if (!birthDate) return "";

      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return `${age} anos`;
    },
  },
  {
    accessorKey: "cpf", header: "CPF", cell: ({ row }) => {
      return `${row.original.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}`;
    }
  },
  {
    accessorKey: "rg", header: "RG", cell: ({ row }) => {
      return `${row.original.rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4")}`;
    }
  },
  {
    accessorKey: "pixKey",
    header: "PIX",
    cell: ({ row }) => {
      const pixKey = row.original.pixKey;
      return (
        <button
          className="underline text-purple-600 hover:text-purple-800 cursor-pointer"
          onClick={async () => {
            await navigator.clipboard.writeText(pixKey || "");
            toast.success("Chave PIX copiada!");
          }}
          type="button"
        >
          {pixKey}
        </button>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => {
      const phone = row.original.phone;
      if (!phone) return "";
      const cleanedPhone = phone.replace(/\D/g, "");
      const whatsappLink = `https://wa.me/55${cleanedPhone}`;
      const formattedPhone = cleanedPhone.length === 11
        ? `(${cleanedPhone.slice(0, 2)}) ${cleanedPhone.slice(2, 7)}-${cleanedPhone.slice(7)}`
        : phone;
      return (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-purple-600  hover:text-purple-800  cursor-pointer"
        >
          {formattedPhone}
        </a>
      );
    },
  },
  {
    accessorKey: "instagram", header: "Instagram", cell: ({ row }) => {
      const instagram = row.original.instagram;
      if (!instagram) return "";
      return (
        <a href={`https://www.instagram.com/${instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="underline text-purple-600 hover:text-purple-800 cursor-pointer">
          {instagram}
        </a>
      );
    }
  },
  {
    accessorKey: "priceHour", header: "Valor Hora", cell: ({ row }) => {
      return `${row.original.priceHour.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}/h`;
    }
  },
  {
      accessorKey: "actions",
      header: "Ações",
      cell: ({ row }) => <UpdateTeacherDialog teacher={row.original} />
    },
];
