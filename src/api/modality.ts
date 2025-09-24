
import { ModalitySchema } from "@/app/(authenticated)/modalidades/schemas/modality-schema";
import api from "@/config/api";
import { ModalityTable } from "@/interfaces/modality";  

export const getModalities = async () => {
  const { data } = await api.get<ModalityTable[]>("api/v1/modalities", {});
  return data;
};

export const createModality = async (modality: ModalitySchema) => {
  const { data } = await api.post<ModalityTable>(
    "api/v1/modalities",
    modality
  );
  return data;
};

export const updateModality = async (id: string, modality: ModalitySchema) => {
  const { data } = await api.patch<ModalityTable>(
    `api/v1/modalities/${id}`,
    modality
  );
  return data;
};

export const deleteModality = async (id: string) => {
  const { data } = await api.delete<ModalityTable>(`api/v1/modalities/${id}`);
  return data;
};
