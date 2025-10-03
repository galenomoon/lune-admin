"use client";
import { cancelEnrollment, updateStudent } from "@/api/enrollment";
import { EnrollmentWithDetails } from "@/interfaces/enrollment";
import { StudentDetails } from "@/interfaces/students";
import { PersonalDataSchema } from "@/schemas/enrollment";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface EnrollmentTabContextType {
  isEditingEnrollment: boolean;
  openEditEnrollmentForm: (
    enrollment: EnrollmentWithDetails,
    studentData?: StudentDetails | null
  ) => void;
  openRenewEnrollmentForm: (
    enrollment: EnrollmentWithDetails,
    studentData?: StudentDetails | null
  ) => void;
  closeRenewEnrollmentForm: () => void;
  closeEditEnrollmentForm: () => void;
  isRenewingEnrollment: boolean;
  currentEnrollment: EnrollmentWithDetails | null;
  currentStudent: StudentDetails | null;
  cancelEnrollmentMutation: UseMutationResult<void, Error, string>;
  updateEnrollmentMutation: UseMutationResult<
    void,
    Error,
    { id: string; data: Partial<PersonalDataSchema> }
  >;
}

export const EnrollmentTabContext = createContext<EnrollmentTabContextType>({
  isEditingEnrollment: false,
  openEditEnrollmentForm: () => {},
  openRenewEnrollmentForm: () => {},
  closeEditEnrollmentForm: () => {},
  closeRenewEnrollmentForm: () => {},
  isRenewingEnrollment: false,
  currentEnrollment: null,
  currentStudent: null,
  cancelEnrollmentMutation: {} as UseMutationResult<void, Error, string>,
  updateEnrollmentMutation: {} as UseMutationResult<
    void,
    Error,
    { id: string; data: Partial<PersonalDataSchema> }
  >,
});

export const EnrollmentTabProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentEnrollment, setCurrentEnrollment] =
    useState<EnrollmentWithDetails | null>(null);
  const [currentStudent, setCurrentStudent] = useState<StudentDetails | null>(
    null
  );
  const [isEditingEnrollment, setIsEditingEnrollment] = useState(false);
  const [isRenewingEnrollment, setIsRenewingEnrollment] = useState(false);

  const queryClient = useQueryClient();

  const cancelEnrollmentMutation = useMutation({
    mutationKey: ["cancel-enrollment"],
    mutationFn: (enrollmentId: string) => cancelEnrollment(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast.success("Matrícula cancelada com sucesso");
    },
    onError: () => toast.error("Erro ao cancelar matrícula"),
  });

  const updateEnrollmentMutation = useMutation({
    mutationKey: ["update-student"],
    mutationFn: ({ id, data }: { id: string; data: Partial<PersonalDataSchema> }) =>
      updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast.success("Dados do aluno atualizados com sucesso");
      closeEditEnrollmentForm();
    },
    onError: () => toast.error("Erro ao atualizar dados do aluno"),
  });

  // ================== EDIT ENROLLMENT ==================

  const openEditEnrollmentForm = (
    enrollment: EnrollmentWithDetails,
    studentData?: StudentDetails | null
  ) => {
    setCurrentEnrollment(enrollment);
    setCurrentStudent(studentData || null);
    setIsEditingEnrollment(true);
  };

  const closeEditEnrollmentForm = () => {
    setIsEditingEnrollment(false);
    setCurrentEnrollment(null);
    setCurrentStudent(null);
  };

  // ================== RENEW ENROLLMENT ==================

  const openRenewEnrollmentForm = (
    enrollment: EnrollmentWithDetails,
    studentData?: StudentDetails | null
  ) => {
    setCurrentEnrollment(enrollment);
    setCurrentStudent(studentData || null);
    setIsRenewingEnrollment(true);
  };

  const closeRenewEnrollmentForm = () => {
    setIsRenewingEnrollment(false);
    setCurrentEnrollment(null);
    setCurrentStudent(null);
  };

  

  return (
    <EnrollmentTabContext.Provider
      value={{
        isEditingEnrollment,
        openEditEnrollmentForm,
        closeEditEnrollmentForm,
        openRenewEnrollmentForm,
        closeRenewEnrollmentForm,
        isRenewingEnrollment,
        currentEnrollment,
        currentStudent,
        cancelEnrollmentMutation,
        updateEnrollmentMutation,
      }}
    >
      {children}
    </EnrollmentTabContext.Provider>
  );
};

export const useEnrollmentTab = () => {
  return useContext(EnrollmentTabContext);
};
