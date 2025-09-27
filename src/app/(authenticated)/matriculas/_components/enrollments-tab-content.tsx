import { EnrollmentWithDetails } from "@/interfaces/enrollment";
import { useEnrollmentTab } from "@/contexts/enrollment-tab-context";
import { EnrollmentTabEdit } from "./enrollment-tab-edit";
import { EnrollmentTabList } from "./enrollment-tab-list";
import { StudentDetails } from "@/interfaces/students";

export const EnrollmentsTabContent = ({
  enrollments = [],
  studentData,
}: {
  enrollments: EnrollmentWithDetails[];
  studentData: StudentDetails;
}) => {
  const { isEditingEnrollment } = useEnrollmentTab();

  if (isEditingEnrollment) {
    return (
      <section className="flex flex-col max-h-[500px] pb-8">
        <EnrollmentTabEdit />
      </section>
    );
  }

  return (
    <section className="flex flex-col h-[500px]">
      <EnrollmentTabList enrollments={enrollments} studentData={studentData} />
    </section>
  );
};
