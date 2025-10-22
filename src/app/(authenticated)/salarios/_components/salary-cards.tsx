"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkedHoursCards } from "@/interfaces/worked-hours";
import { ArrowDown, ArrowUp, DollarSign, UserPlus, Award } from "lucide-react";

interface SalaryCardsProps {
  cards: WorkedHoursCards;
}

export default function SalaryCards({ cards }: SalaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total a Pagar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {cards.totalToPay.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Horas: R$ {cards.totalToPay.fromHours.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            <br />
            Comissões: R$ {cards.totalToPay.fromEnrollments.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>

      {/* Novas Matrículas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Novas Matrículas
          </CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cards.newEnrollments.value}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            {cards.newEnrollments.trend.isPositive ? (
              <span className="flex items-center text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                {cards.newEnrollments.trend.value.toFixed(1)}%
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <ArrowDown className="h-3 w-3 mr-1" />
                {cards.newEnrollments.trend.value.toFixed(1)}%
              </span>
            )}
            <span>em relação ao mês anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Melhor Professor */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Melhor Custo-Benefício
          </CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cards.bestTeacher.name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {cards.bestTeacher.totalStudents} alunos • {cards.bestTeacher.totalClasses} aulas
            <br />
            R$ {cards.bestTeacher.totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} total
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


