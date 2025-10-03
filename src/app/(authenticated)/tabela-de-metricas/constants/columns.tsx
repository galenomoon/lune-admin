import { ColumnDef } from "@tanstack/react-table";
import { MetricTable } from "@/interfaces/metrics";
import { UpdateMetricDialog } from "../_components/update-metric-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Repeat2, 
  MousePointer, 
  Eye
} from "lucide-react";

export const columns: ColumnDef<MetricTable>[] = [
  {
    accessorKey: "format",
    header: "Formato",
    cell: ({ row }) => {
      const format = row.original.format;
      const formatLabels = {
        "reels": "Reels",
        "carousel": "Carrossel",
        "static-photo": "Foto Estática",
        "live": "Live"
      };
      return formatLabels[format] || format;
    }
  },
  {
    accessorKey: "title",
    header: "Título/Descrição",
    cell: ({ row }) => {
      const title = row.original.title;
      return title?.length > 30 ? `${title.substring(0, 30)}...` : title;
    }
  },
  {
    accessorKey: "postDate",
    header: "Data de Postagem",
    cell: ({ row }) => {
      return format(new Date(row.original.postDate), "dd/MM/yyyy", { locale: ptBR });
    }
  },
  {
    accessorKey: "reach",
    header: "Alcance",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-blue-500" />
          <span>{row.original.reach.toLocaleString("pt-BR")}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "likes",
    header: "Likes",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-500" />
          <span>{row.original.likes.toLocaleString("pt-BR")}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "comments",
    header: "Comentários",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-green-500" />
          <span>{row.original.comments.toLocaleString("pt-BR")}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "shares",
    header: "Compartilhamentos",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-purple-500" />
          <span>{row.original.shares.toLocaleString("pt-BR")}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "saves",
    header: "Salvamentos",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-yellow-500" />
          <span>{row.original.saves.toLocaleString("pt-BR")}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "reposts",
    header: "Reposts",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Repeat2 className="h-4 w-4 text-orange-500" />
          <span>{row.original.reposts.toLocaleString("pt-BR")}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "linkClicks",
    header: "Cliques no Link",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <MousePointer className="h-4 w-4 text-indigo-500" />
          <span>{row.original.linkClicks.toLocaleString("pt-BR")}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "engagement",
    header: "Engajamento (%)",
    cell: ({ row }) => {
      const engagement = row.original.engagement;
      const colorClass = engagement >= 5 ? "text-green-600 font-semibold" : 
                        engagement >= 3 ? "text-yellow-600 font-medium" : 
                        "text-red-600";
      return (
        <span className={colorClass}>
          {engagement.toFixed(2)}%
        </span>
      );
    }
  },
  {
    accessorKey: "ctr",
    header: "CTR (%)",
    cell: ({ row }) => {
      const ctr = row.original.ctr;
      const colorClass = ctr >= 2 ? "text-green-600 font-semibold" : 
                        ctr >= 1 ? "text-yellow-600 font-medium" : 
                        "text-red-600";
      return (
        <span className={colorClass}>
          {ctr.toFixed(2)}%
        </span>
      );
    }
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <UpdateMetricDialog metric={row.original} />
  },
];
