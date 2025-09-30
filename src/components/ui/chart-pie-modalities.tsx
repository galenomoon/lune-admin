"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
} from "@/components/ui/chart";

const COLORS = [
  "#8884d8", // Azul
  "#82ca9d", // Verde
  "#ffc658", // Amarelo
  "#ff7300", // Laranja
  "#00ff88", // Verde claro
  "#0088fe", // Azul claro
  "#ff0080", // Rosa
  "#00d4aa", // Turquesa
];

interface ModalityData {
  id: string;
  name: string;
  classes: number;
  enrollments: number;
  trialClasses: number;
  totalStudents: number;
  avgStudentsPerClass: string;
  value: number;
}

interface ChartPieModalitiesProps {
  data: ModalityData[];
}

export function ChartPieModalities({ data }: ChartPieModalitiesProps) {
  // Transformar dados para o formato do recharts
  const chartData = data.map((modality, index) => ({
    name: modality.name,
    value: modality.value, // Usar a média de alunos por turma
    classes: modality.classes,
    enrollments: modality.enrollments,
    trialClasses: modality.trialClasses,
    totalStudents: modality.totalStudents,
    avgStudentsPerClass: modality.avgStudentsPerClass,
    fill: COLORS[index % COLORS.length],
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; classes: number; enrollments: number; trialClasses: number; totalStudents: number; avgStudentsPerClass: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
          <div className="grid gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Modalidade
              </span>
              <span className="font-bold text-muted-foreground">
                {data.name}
              </span>
            </div>
            <div className="grid gap-2">
              <div className="flex flex-col">
                <span className="text-[0.70rem] uppercase text-muted-foreground">
                  Média Alunos/Turma
                </span>
                <span className="font-bold">{data.avgStudentsPerClass}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[0.70rem] uppercase text-muted-foreground">
                  Total de Alunos: <span className="font-bold text-black">{data.totalStudents}</span>
                </span>
                <span className="font-bold">{data.enrollments} matriculados</span>
                <span className="font-bold">{data.trialClasses} aulas avulsas</span>
              </div>
             
              <div className="flex flex-col">
                <span className="text-[0.70rem] uppercase text-muted-foreground">
                  Turmas Ativas
                </span>
                <span className="font-bold">{data.classes} turmas</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eficiência por Modalidade</CardTitle>
        <CardDescription>Distribuição baseada na média de alunos por turma</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            modality: {
              label: "Modalidade",
            },
            value: {
              label: "Média Alunos/Turma",
            },
          }}
          className="mx-auto max-h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
