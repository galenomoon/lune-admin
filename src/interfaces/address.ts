export interface Address {
  number: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  studentId: string;
  street: string;
  city: string;
  neighborhood: string;
  state: string;
  complement: string | null;
  cep: string;
}
