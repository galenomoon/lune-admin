import api from "@/config/api";
import { StudentDetails, StudentTable } from "@/interfaces/students";

export interface GetStudentsFilters {
  search?: string;
  planId?: string;
  modalityId?: string;
}

export const getStudents = async (filters?: GetStudentsFilters) => {
  const params = new URLSearchParams();
  
  if (filters?.search) {
    params.append("search", filters.search);
  }
  if (filters?.planId) {
    params.append("planId", filters.planId);
  }
  if (filters?.modalityId) {
    params.append("modalityId", filters.modalityId);
  }

  const queryString = params.toString();
  const url = `api/v1/students/${queryString ? `?${queryString}` : ""}`;
  
  const { data } = await api.get<StudentTable[]>(url);
  return data;
};

export const getStudentById = async (id: string) => {
  const { data } = await api.get<StudentDetails>("api/v2/students/" + id);
  return data;
};

export const getEnrollmentFormData = async () => {
  const { data } = await api.get("api/v1/students/enrollment-form-data");
  return data;
};
