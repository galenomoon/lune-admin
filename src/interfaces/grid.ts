export interface GridItem {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classId: string;
  class?: Class;
  trialStudents?: TrialStudent[];
  maxStudents?: number;
  enrolledStudents?: number;
  enrolledStudentsList?: Enrollment[];
  trialStudentsList?: TrialStudent[];
  modality?: string;
  level?: string;
  description?: string;
  teacherName?: string;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  maxStudents: number;
  modalityId: string;
  classLevelId: string;
  teacherId?: string;
  modality?: Modality;
  classLevel?: ClassLevel;
  teacher?: Teacher;
  enrollments?: Enrollment[];
}

export interface Modality {
  id: string;
  name: string;
}

export interface ClassLevel {
  id: string;
  name: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  priceHour?: number;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  status: string;
  student?: Student;
}

export interface TrialStudent {
  id: string;
  leadId: string;
  gridItemId: string;
  date: string;
  status: string;
  lead?: Lead;
  gridItem?: GridItem;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  instagram?: string;
}

export interface GridSchedule {
  sunday: GridItem;
  monday: GridItem;
  tuesday: GridItem;
  wednesday: GridItem;
  thursday: GridItem;
  friday: GridItem;
  saturday: GridItem;
}

export interface GridDashboard {
  revenues: {
    weekly: number;
    monthly: number;
  };
  costs: {
    weekly: number;
    monthly: number;
  };
  profits: {
    weekly: number;
    monthly: number;
  };
  enrollments: {
    totalStudents: number;
  };
}

export interface GridResponse {
  dashboard: GridDashboard;
  data: GridSchedule[];
}

export interface GridFilters {
  name: string;
  ageRange: string;
  teacherId: string;
  modalityId: string;
  classLevelId: string;
}

export interface GridFormData {
  modalities: Modality[];
  teachers: Teacher[];
  classLevels: ClassLevel[];
  classes: Class[];
}

export interface GridItemSchema {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface GridFormSchema {
  class: {
    id?: string;
    maxStudents: number;
    modalityId: string;
    classLevelId: string;
    teacherId: string;
    description: string;
  };
  gridItems: GridItemSchema[];
}
