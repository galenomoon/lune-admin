"use client";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./constants/columns";
import { CreateMetricDialog } from "./_components/create-metric-dialog";

// Dados mock para demonstração
const mockMetrics = [
  {
    id: "1",
    format: "reels" as const,
    duration: 30,
    title: "Dicas de Marketing Digital",
    postDate: "2024-01-15T10:00:00Z",
    reach: 1500,
    saves: 45,
    shares: 23,
    likes: 120,
    comments: 18,
    reposts: 5,
    linkClicks: 12,
    engagement: 12.73, // (120+23+18+5+45)/1500 * 100
    ctr: 0.8, // 12/1500 * 100
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    format: "carousel" as const,
    quantity: 5,
    title: "Como aumentar suas vendas online",
    postDate: "2024-01-14T14:30:00Z",
    reach: 2300,
    saves: 67,
    shares: 34,
    likes: 180,
    comments: 25,
    reposts: 8,
    linkClicks: 28,
    engagement: 13.7, // (180+34+25+8+67)/2300 * 100
    ctr: 1.22, // 28/2300 * 100
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
  },
  {
    id: "3",
    format: "static-photo" as const,
    title: "Novo produto lançado!",
    postDate: "2024-01-13T16:45:00Z",
    reach: 800,
    saves: 22,
    shares: 12,
    likes: 65,
    comments: 8,
    reposts: 2,
    linkClicks: 15,
    engagement: 13.63, // (65+12+8+2+22)/800 * 100
    ctr: 1.88, // 15/800 * 100
    createdAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-13T16:45:00Z",
  },
  {
    id: "4",
    format: "live" as const,
    duration: 1800, // 30 minutos
    title: "Live: Dúvidas sobre empreendedorismo",
    postDate: "2024-01-12T19:00:00Z",
    reach: 3200,
    saves: 89,
    shares: 45,
    likes: 250,
    comments: 35,
    reposts: 12,
    linkClicks: 45,
    engagement: 13.47, // (250+45+35+12+89)/3200 * 100
    ctr: 1.41, // 45/3200 * 100
    createdAt: "2024-01-12T19:00:00Z",
    updatedAt: "2024-01-12T19:00:00Z",
  },
  {
    id: "5",
    format: "reels" as const,
    duration: 15,
    title: "Tendências de moda 2024",
    postDate: "2024-01-11T12:15:00Z",
    reach: 4500,
    saves: 125,
    shares: 67,
    likes: 320,
    comments: 42,
    reposts: 18,
    linkClicks: 68,
    engagement: 12.71, // (320+67+42+18+125)/4500 * 100
    ctr: 1.51, // 68/4500 * 100
    createdAt: "2024-01-11T12:15:00Z",
    updatedAt: "2024-01-11T12:15:00Z",
  },
  {
    id: "6",
    format: "carousel" as const,
    quantity: 3,
    title: "Receitas fitness para o verão",
    postDate: "2024-01-10T09:30:00Z",
    reach: 1800,
    saves: 52,
    shares: 28,
    likes: 145,
    comments: 22,
    reposts: 7,
    linkClicks: 32,
    engagement: 14.67, // (145+28+22+7+52)/1800 * 100
    ctr: 1.78, // 32/1800 * 100
    createdAt: "2024-01-10T09:30:00Z",
    updatedAt: "2024-01-10T09:30:00Z",
  },
  {
    id: "7",
    format: "static-photo" as const,
    title: "Promoção especial - 50% OFF",
    postDate: "2024-01-09T15:20:00Z",
    reach: 1200,
    saves: 38,
    shares: 19,
    likes: 98,
    comments: 15,
    reposts: 4,
    linkClicks: 42,
    engagement: 14.5, // (98+19+15+4+38)/1200 * 100
    ctr: 3.5, // 42/1200 * 100
    createdAt: "2024-01-09T15:20:00Z",
    updatedAt: "2024-01-09T15:20:00Z",
  },
  {
    id: "8",
    format: "live" as const,
    duration: 2400, // 40 minutos
    title: "Workshop: Como criar conteúdo viral",
    postDate: "2024-01-08T20:00:00Z",
    reach: 2800,
    saves: 78,
    shares: 41,
    likes: 210,
    comments: 31,
    reposts: 10,
    linkClicks: 55,
    engagement: 13.21, // (210+41+31+10+78)/2800 * 100
    ctr: 1.96, // 55/2800 * 100
    createdAt: "2024-01-08T20:00:00Z",
    updatedAt: "2024-01-08T20:00:00Z",
  },
];

export default function TabelaDeMetricas() {
  // Simular query - em produção seria uma chamada real à API
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockMetrics;
    },
  });

  return (
    <div className="grid grid-cols-1 max-w-full gap-4">
      <section className="flex w-full justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tabela de Métricas</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o desempenho do seu conteúdo nas redes sociais
          </p>
        </div>
        <CreateMetricDialog />
      </section>

      <div className="bg-card rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Total de Posts
            </h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {metrics?.length || 0}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-900 dark:text-green-200">
              Alcance Total
            </h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-300">
              {metrics
                ?.reduce((acc, metric) => acc + metric.reach, 0)
                .toLocaleString("pt-BR") || 0}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-900 dark:text-purple-200">
              Engajamento Médio
            </h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
              {metrics?.length
                ? (
                    metrics.reduce(
                      (acc, metric) => acc + metric.engagement,
                      0
                    ) / metrics.length
                  ).toFixed(2)
                : "0.00"}
              %
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-orange-900 dark:text-orange-200">
              CTR Médio
            </h3>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">
              {metrics?.length
                ? (
                    metrics.reduce((acc, metric) => acc + metric.ctr, 0) /
                    metrics.length
                  ).toFixed(2)
                : "0.00"}
              %
            </p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={metrics || []} isLoading={isLoading} />
    </div>
  );
}
