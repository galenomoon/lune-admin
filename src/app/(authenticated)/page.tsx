"use client";
import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive";
import { ChartPieModalities } from "@/components/ui/chart-pie-modalities";
import { SectionCards, SectionCardData } from "@/components/ui/section-cards";
import { DataTable } from "@/components/ui/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/api/dashboard";
import { useState } from "react";
import { paymentColumnsDashboard } from "./matriculas/constants/payments-columns";
import { PaymentTabProvider } from "@/contexts/payment-tab-context";

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ["dashboardStats", selectedMonth, selectedYear],
    queryFn: () => getDashboard(selectedMonth, selectedYear),
  });

  // Converter dados do dashboard para SectionCards
  const sectionCardsData: SectionCardData[] = dashboardStats?.cards
    ? [
        {
          id: "revenue",
          title: "Faturamento Total",
          description: "Faturamento Total",
          value: `R$ ${dashboardStats.cards.totalRevenue.value.toLocaleString(
            "pt-BR",
            { minimumFractionDigits: 2 }
          )}`,
          trend: dashboardStats.cards.totalRevenue.trend,
          footer: {
            primary: dashboardStats.cards.totalRevenue.trend.isPositive
              ? "Crescimento este mês"
              : "Queda este mês",
            secondary: `Comparado ao mês anterior`,
          },
        },
        {
          id: "toReceive",
          title: "A Receber",
          description: "A Receber",
          value: `R$ ${dashboardStats.cards.totalToReceive.value.toLocaleString(
            "pt-BR",
            { minimumFractionDigits: 2 }
          )}`,
          trend: dashboardStats.cards.totalToReceive.trend,
          footer: {
            primary: "Valores pendentes",
            secondary: "Pagamentos não realizados",
          },
        },
        {
          id: "enrollments",
          title: "Matrículas/Turmas",
          description: "Matrículas/Turmas",
          value: dashboardStats.cards.enrollmentsToClasses.value,
          trend: dashboardStats.cards.enrollmentsToClasses.trend,
          footer: {
            primary: "Média de alunos por turma",
            secondary: `Temos ${dashboardStats.cards.enrollmentsToClasses.enrollments} matrículas e ${dashboardStats.cards.enrollmentsToClasses.classes} turmas`,
          },
        },
        {
          id: "trialClasses",
          title: "Aulas Avulsas",
          description: "Aulas Avulsas",
          value: dashboardStats.cards.trialClasses.value.toString(),
          trend: dashboardStats.cards.trialClasses.trend,
          footer: {
            primary: "Aulas experimentais",
            secondary: `Este mês`,
          },
        },
      ]
    : [];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <SiteHeader
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards data={sectionCardsData} />
              <div className="grid gap-4 md:grid-cols-2">
                <ChartAreaInteractive chartData={dashboardStats?.chart} />
                <ChartPieModalities data={dashboardStats?.modalities || []} />
              </div>
              <PaymentTabProvider>
                <DataTable
                  columns={paymentColumnsDashboard}
                  data={dashboardStats?.payments || []}
                  isLoading={isLoading}
                />
              </PaymentTabProvider>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
