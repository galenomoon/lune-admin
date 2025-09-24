import { Address } from "./address";
import { Enrollment } from "./enrollment";
import { Payment } from "./payment";

export interface StudentTable {
  id: string;
  studentName: string;
  daysToExpire: string;
  phone: string;
  status: "PENDING" | "PAID" | "CANCELED";
  student: Student;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  cpf: string;
  rg: string;
  phone: string | null;
  instagram: string | null;
  email: string | null;
  obs: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentDetails {
  personalData: Student;
  addresses: Address[];
  payments: Payment[];
  enrollments: Enrollment[];
}
