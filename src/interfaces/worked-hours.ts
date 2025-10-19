export interface WorkedHour {
  id: string;
  workedAt: string;
  startedAt: string;
  endedAt: string;
  duration: number;
  teacherId: string;
  teacherName: string;
  modalityName: string;
  classLevel?: string;
  classDescription?: string;
  enrolledStudentsCount: number;
  trialStudentsCount: number;
  totalStudentsCount: number;
  newEnrollmentsCount: number;
  priceSnapshot: number;
  status: "PENDING" | "DONE" | "CANCELED";
  students?: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
}

export interface WorkedHoursCards {
  totalToPay: {
    value: number;
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
  newEnrollments: {
    value: number;
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
  bestTeacher: {
    name: string;
    totalCost: number;
    totalClasses: number;
    totalStudents: number;
  };
}

export interface WorkedHoursResponse {
  cards: WorkedHoursCards;
  workedHours: WorkedHour[];
}

