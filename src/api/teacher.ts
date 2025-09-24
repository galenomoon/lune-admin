import { TeacherSchema } from "@/app/(authenticated)/professores/schemas/teacher-schema";
import api from "@/config/api";
import { TeacherTable } from "@/interfaces/teacher";
import { dateStringToDate } from "@/utils/parse-date";
import { currencyToFloat } from "@/utils/parse-currency";
import { normalizePhoneNumber } from "@/utils/parse-phone";

export const getTeachers = async () => {
  const { data } = await api.get<TeacherTable[]>("api/v1/teachers", {});
  return data;
};

export const createTeacher = async (teacher: TeacherSchema) => {

  const parsedTeacher = {
    ...teacher,
    birthDate: dateStringToDate(teacher.birthDate),
    priceHour: currencyToFloat(teacher.priceHour),
    phone: normalizePhoneNumber(teacher.phone),
  };

  const { data } = await api.post<TeacherTable>("api/v1/teachers", parsedTeacher);
  return data;
};

export const updateTeacher = async (id: string, teacher: TeacherSchema) => {
  const parsedTeacher = {
    ...teacher,
    birthDate: dateStringToDate(teacher.birthDate),
    priceHour: currencyToFloat(teacher.priceHour),
    phone: normalizePhoneNumber(teacher.phone),
  };
  const { data } = await api.patch<TeacherTable>(`api/v1/teachers/${id}`, parsedTeacher);
  return data;
};

export const deleteTeacher = async (id: string) => {
  const { data } = await api.delete<TeacherTable>(`api/v1/teachers/${id}`);
  return data;
};