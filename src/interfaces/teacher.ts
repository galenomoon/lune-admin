export interface TeacherTable {
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
  priceHour: number;
  pixKey: string | null;
  createdAt: Date;
  updatedAt: Date;
}
