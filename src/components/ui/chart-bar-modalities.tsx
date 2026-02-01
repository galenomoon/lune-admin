"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Gráfico de barras empilhadas por modalidade";

interface ModalityData {
  id: string;
  name: string;
  enrollments: number;
  trialClasses: number;
}

interface ChartBarModalitiesProps {
  data?: ModalityData[];
}

const chartConfig = {
  enrollments: {
    label: "Matrículas",
    color: "#BD14DF",
  },
  trialClasses: {
    label: "Aulas Avulsas",
    color: "#FFD400",
  },
} satisfies ChartConfig;

export function ChartBarModalities({ data = [] }: ChartBarModalitiesProps) {
  // Transformar dados para o formato do gráfico
  const chartData = data.map((modality) => ({
    name: modality.name,
    enrollments: modality.enrollments,
    trialClasses: modality.trialClasses,
  }));

  // Calcular totais para o footer
  const totalEnrollments = data.reduce((sum, m) => sum + m.enrollments, 0);
  const totalTrialClasses = data.reduce((sum, m) => sum + m.trialClasses, 0);
  const total = totalEnrollments + totalTrialClasses;

  // Calcular porcentagem de crescimento (exemplo baseado em matrículas vs aulas avulsas)
  const enrollmentPercentage =
    total > 0 ? ((totalEnrollments / total) * 100).toFixed(1) : "0";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matrículas vs Aulas Avulsas por Modalidade</CardTitle>
        <CardDescription>
          Comparação de alunos regulares e experimentais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
              tickFormatter={(value) =>
                value.length > 5 ? value.slice(0, 5) : value
              }
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="enrollments"
              stackId="a"
              fill={chartConfig.enrollments.color}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="trialClasses"
              stackId="a"
              fill={chartConfig.trialClasses.color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {enrollmentPercentage}% são matrículas regulares{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Total de {total} alunos no período ({totalEnrollments} matrículas,{" "}
          {totalTrialClasses} aulas avulsas)
        </div>
      </CardFooter>
    </Card>
  );
}
