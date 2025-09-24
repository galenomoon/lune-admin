export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  cpf?: string;
  status?: string;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Modality {
  id: string;
  name: string;
  description?: string;
}

export interface ClassLevel {
  id: string;
  name: string;
  description?: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  modalityId: string;
  teacherId: string;
  classLevelId: string;
  maxStudents: number;
  modality?: Modality;
  teacher?: Teacher;
  classLevel?: ClassLevel;
}

export interface GridItem {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classId: string;
  class?: Class;
}

export interface TrialStudent {
  id: string;
  date: string;
  leadId: string;
  gridItemId: string;
  lead?: Lead;
  gridItem?: GridItem;
  createdAt: string;
  updatedAt: string;
}


