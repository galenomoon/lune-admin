import React from "react";
import { EnrollmentWithDetails } from "@/interfaces/enrollment";
import { EnrollmentTabProvider } from "@/contexts/enrollment-tab-context";
import { EnrollmentsTabContent } from "./enrollments-tab-content";
import { StudentDetails } from "@/interfaces/students";

interface EnrollmentsTabEditProps {
  enrollments: EnrollmentWithDetails[];
  studentData: StudentDetails;
}

export default function EnrollmentsTabEdit({
  enrollments,
  studentData,
}: EnrollmentsTabEditProps) {
  return (
    <EnrollmentTabProvider>
      <EnrollmentsTabContent enrollments={enrollments} studentData={studentData} />
    </EnrollmentTabProvider>
  );
}
