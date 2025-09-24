export interface Enrollment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  status: string;
  studentId: string;
  planId: string;
  paymentDay: number;
  classId: string | null;
  signature: string | null;
}
