import { EnrollmentWithDetails } from "@/interfaces/enrollment";
import { useEnrollmentTab } from "@/contexts/enrollment-tab-context";
import { EnrollmentTabEdit } from "./enrollment-tab-edit";
import { EnrollmentTabList } from "./enrollment-tab-list";
import { StudentDetails } from "@/interfaces/students";
import { EnrollmentTabRenew } from "./enrollment-tab-renew";
import { EnrollmentTabExtra } from "./enrollment-tab-extra";

export const EnrollmentsTabContent = ({
  enrollments = [],
  studentData,
}: {
  enrollments: EnrollmentWithDetails[];
  studentData: StudentDetails;
}) => {
  const { isEditingEnrollment, isRenewingEnrollment, isAddingEnrollment } =
    useEnrollmentTab();

  if (isEditingEnrollment) {
    return (
      <section className="flex flex-col max-h-[500px] pb-8">
        <EnrollmentTabEdit />
      </section>
    );
  }

  if (isRenewingEnrollment) {
    return (
      <section className="flex flex-col max-h-[500px] pb-8">
        <EnrollmentTabRenew />
      </section>
    );
  }

  if (isAddingEnrollment) {
    return (
      <section className="flex flex-col max-h-[500px] pb-8">
        <EnrollmentTabExtra />
      </section>
    );
  }

  return (
    <section className="flex flex-col h-[500px]">
      <EnrollmentTabList enrollments={enrollments} studentData={studentData} />
    </section>
  );
};
