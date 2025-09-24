import api from "@/config/api";
import { StudentDetails, StudentTable } from "@/interfaces/students";

export const getStudents = async () => {
  const { data } = await api.get<StudentTable[]>("api/v1/students/");
  return data;
};

export const getStudentById = async (id: string) => {
  const { data } = await api.get<StudentDetails>("api/v2/students/" + id);
  return data;
};
