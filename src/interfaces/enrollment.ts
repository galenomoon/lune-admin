export interface Enrollment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  status: string;
  studentId: string;
  planId: string;
  paymentDay: number;
  classId: string | null;
  signature: string | null;
  plan?: {
    id: string;
    name: string;
    weeklyClasses: number;
    description: string | null;
    durationInDays: number;
    isSecondary: boolean;
    price: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  };
  class?: {
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
    classLevel: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
    gridClasses: {
      id: string;
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      classId: string;
      createdAt: string;
      updatedAt: string;
    }[];
    teacher: {
      id: string;
      firstName: string;
      lastName: string;
      birthDate: string;
      cpf: string;
      rg: string;
      pixKey: string;
      imageUrl: string | null;
      phone: string;
      email: string;
      instagram: string;
      priceHour: number;
      createdAt: string;
      updatedAt: string;
      password: string;
    };
  };
}

export type EnrollmentWithDetails = Enrollment & {
  plan: NonNullable<Enrollment['plan']>;
};

export interface EnrollmentCreateData {
  startDate: Date;
  planId: string;
  paymentDay: string;
  classId: string;
  modalityId: string;
  signature: string;
}

export interface UpdateEnrollmentData {
  classId?: string;
  status?: 'active' | 'canceled' | 'pending' | 'archived';
  startDate?: Date;
  endDate?: Date;
  paymentDay?: number;
  planId?: string;
}

export interface CreateEnrollmentPayload {
  student: import('./students').StudentCreateData;
  address: import('../schemas/enrollment').AddressSchema;
  enrollment: EnrollmentCreateData;
}

// Interfaces para formulários de matrícula
export interface GridClass {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassFormData {
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
  classLevel: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  gridClasses: GridClass[];
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    cpf: string;
    rg: string;
    pixKey: string;
    imageUrl: string | null;
    phone: string;
    email: string;
    instagram: string;
    priceHour: number;
    createdAt: string;
    updatedAt: string;
    password: string;
  };
}

export interface ModalityFormData {
  id: string;
  name: string;
}

export interface PlanFormData {
  id: string;
  price: number;
  name: string;
  durationInDays?: number;
}
