import api from "@/config/api";

export interface ContractEnrollmentData {
  class: {
    id: string;
    name: string;
    description: string;
    modalityId: string;
    createdAt: string;
    updatedAt: string;
    classLevelId: string;
    maxStudents: number;
    teacherId: string;
    modality: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  classId: string;
  createdAt: string;
  endDate: string;
  id: string;
  paymentDay: number;
  plan: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    createdAt: string;
    updatedAt: string;
  };
  planId: string;
  signature: string | null;
  startDate: string;
  status: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    cpf: string;
    rg: string;
    phone: string | null;
    instagram: string | null;
    email: string | null;
    obs: string | null;
    createdAt: string;
    updatedAt: string;
  };
  studentId: string;
  updatedAt: string;
}

export const getEnrollmentByToken = async (token: string): Promise<ContractEnrollmentData> => {
  const { data } = await api.get(`/api/v1/contracts/${token}`);
  return data;
};

export const sendSignature = async ({ token, signature }: { token: string; signature: string }) => {
  const { data } = await api.post(`/api/v1/contracts/sign/${token}`, { signature });
  return data;
};
