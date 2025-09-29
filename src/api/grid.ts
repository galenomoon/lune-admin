import api from "@/config/api";
import { 
  GridResponse, 
  GridFormData, 
  GridFilters, 
  GridFormSchema, 
  GridItem 
} from "@/interfaces/grid";

export const getGridItems = async (filters: GridFilters): Promise<GridResponse> => {
  const params = new URLSearchParams();
  
  if (filters.name) {
    params.append("name", filters.name.replaceAll(" ", ""));
  }
  if (filters.ageRange) {
    params.append("ageRange", filters.ageRange);
  }
  if (filters.teacherId) {
    params.append("teacherId", filters.teacherId);
  }
  if (filters.modalityId) {
    params.append("modalityId", filters.modalityId);
  }
  if (filters.classLevelId) {
    params.append("classLevelId", filters.classLevelId);
  }

  const response = await api.get(`/api/v1/grid-items/?${params.toString()}`);
  return response.data;
};

export const getGridFormData = async (): Promise<GridFormData> => {
  const [modalitiesRes, teachersRes, classLevelsRes, classesRes] = await Promise.all([
    api.get("/api/v1/modalities/"),
    api.get("/api/v1/teachers/"),
    api.get("/api/v1/class-levels/"),
    api.get("/api/v1/classes/"),
  ]);

  return {
    modalities: modalitiesRes.data,
    teachers: teachersRes.data,
    classLevels: classLevelsRes.data,
    classes: classesRes.data,
  };
};

export const createGridItem = async (data: GridFormSchema): Promise<GridItem[]> => {
  const response = await api.post("/api/v1/grid-items", data);
  return response.data;
};

export const updateGridItem = async (id: string, data: GridFormSchema): Promise<GridItem[]> => {
  const response = await api.patch(`/api/v1/grid-items/${id}`, data);
  return response.data;
};

export const deleteGridItem = async (id: string): Promise<GridItem> => {
  const response = await api.delete(`/api/v1/grid-items/${id}`);
  return response.data;
};
