export interface Payment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: "PENDING" | "PAID" | "CANCELED" | "OVERDUE";
  enrollmentId: string;
  amount: number;
  dueDate: Date;
  modality: string;
  planName: string;
}
