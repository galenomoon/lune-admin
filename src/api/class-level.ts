import api from "@/config/api";

export interface ClassLevel {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const getClassLevels = async (): Promise<ClassLevel[]> => {
  const { data } = await api.get("/api/v1/class-levels");
  return data;
};

