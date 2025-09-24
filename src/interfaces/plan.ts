export interface PlanTable {
  id: string;
  name: string;
  weeklyClasses: number;
  durationInDays: number;
  isSecondary: number;
  price: number;
  enrollmentsQuantity: number;
}

export interface PlanDetails extends PlanTable {
  // Adicione campos adicionais se necessário
}
