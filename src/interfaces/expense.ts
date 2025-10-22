export interface Expense {
  id: string;
  name: string;
  description?: string;
  amount: number;
  dueDay: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  createdAt: Date;
  updatedAt: Date;
}

