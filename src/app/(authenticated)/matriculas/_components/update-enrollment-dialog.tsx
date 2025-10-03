import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DollarSign, MapPin, Settings, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book } from "lucide-react";
import {
  AddressSchema,
  addressSchema,
  EnrollmentSchema,
  enrollmentSchema,
  personalDataSchema,
  PersonalDataSchema,
} from "@/schemas/enrollment";
import { EnrollmentWithDetails } from "@/interfaces/enrollment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PersonalDataForm from "../_components/personal-data-form";
import AddressForm from "../_components/address-form";
import { StudentTable } from "@/interfaces/students";
import { useQuery } from "@tanstack/react-query";
import { getStudentById } from "@/api/student";
import { dateToString } from "@/utils/parse-date";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { EnrollmentFormSkeleton } from "@/components/ui/skeleton-form";
import { PaymentsTab } from "../_components/payments-tab";
import EnrollmentsTabEdit from "./enrollments-tab-edit";
import { StudentDetails } from "@/interfaces/students";

export function UpdateEnrollmentDialog({
  currentStudent,
}: {
  currentStudent: StudentTable;
}) {
  const [activeTab, setActiveTab] = useState("personal-data");
  const [isOpen, setIsOpen] = useState(false);

  const { data: student, isPending } = useQuery({
    queryKey: ["student", currentStudent.id],
    queryFn: () => getStudentById(currentStudent.id),
    enabled: isOpen,
  });

  const personalDataForm = useForm<PersonalDataSchema>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      cpf: "",
      rg: "",
      phone: "",
      instagram: "",
      email: "",
      obs: "",
    },
    values: {
      firstName: student?.personalData?.firstName || "",
      lastName: student?.personalData?.lastName || "",
      birthDate: dateToString(student?.personalData?.birthDate || ""),
      cpf: student?.personalData?.cpf || "",
      rg: student?.personalData?.rg || "",
      phone: student?.personalData?.phone || "",
      instagram: student?.personalData?.instagram || "",
      email: student?.personalData?.email || "",
      obs: student?.personalData?.obs || "",
    },
  });

  const addressForm = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      number: "",
      city: "",
      neighborhood: "",
      state: "",
      complement: "",
      cep: "",
    },
    values: {
      street: student?.addresses?.[0]?.street || "",
      number: student?.addresses?.[0]?.number || "",
      city: student?.addresses?.[0]?.city || "",
      neighborhood: student?.addresses?.[0]?.neighborhood || "",
      state: student?.addresses?.[0]?.state || "",
      complement: student?.addresses?.[0]?.complement || "",
      cep: student?.addresses?.[0]?.cep || "",
    },
  });

  const enrollmentForm = useForm<EnrollmentSchema>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      startDate: "",
      planId: "",
      paymentDay: "",
      classId: "",
      signature: "",
    },
  });

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
        personalDataForm.reset();
        addressForm.reset();
        enrollmentForm.reset();
        setActiveTab("personal-data");
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-blue-500 text-blue-500 bg-blue-50"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col sm:min-w-4xl max-h-[90vh] min-h-[80vh] ">
        <DialogHeader className="h-fit flex-row">
          <DialogTitle>{currentStudent.studentName}</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="personal-data"
          className="flex-1 md:flex-row flex-col gap-5 min-h-0"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="flex flex-row md:flex-col overflow-auto h-full justify-start md:w-fit w-full gap-2 p-2 flex-shrink-0">
            <TabsTrigger
              className="max-h-fit w-full justify-center md:justify-start"
              value="personal-data"
            >
              <User />
              Dados pessoais
            </TabsTrigger>
            <TabsTrigger
              className="max-h-fit w-full justify-center md:justify-start"
              value="address"
            >
              <MapPin />
              Endereço
            </TabsTrigger>

            <TabsTrigger
              className="max-h-fit w-full justify-center md:justify-start"
              value="payments"
            >
              <DollarSign />
              Pagamentos
            </TabsTrigger>

            <TabsTrigger
              className="max-h-fit w-full justify-center md:justify-start"
              value="enrollment"
            >
              <Book />
              Matrícula
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personal-data">
            <SkeletonWrapper
              isPending={isPending}
              SkeletonComponent={EnrollmentFormSkeleton}
            >
              <PersonalDataForm
                form={personalDataForm}
                onSubmit={() => setActiveTab("address")}
              />
            </SkeletonWrapper>
          </TabsContent>
          <TabsContent value="address">
            <SkeletonWrapper
              isPending={isPending}
              SkeletonComponent={EnrollmentFormSkeleton}
            >
              <AddressForm
                form={addressForm}
                cepLoading={false}
                onSubmit={() => setActiveTab("enrollment")}
              />
            </SkeletonWrapper>
          </TabsContent>
          <TabsContent value="payments">
            <SkeletonWrapper
              isPending={isPending}
              SkeletonComponent={EnrollmentFormSkeleton}
            >
              <PaymentsTab payments={student?.payments || []} />
            </SkeletonWrapper>
          </TabsContent>
          <TabsContent value="enrollment">
            <SkeletonWrapper
              isPending={isPending}
              SkeletonComponent={EnrollmentFormSkeleton}
            >
              <EnrollmentsTabEdit
                enrollments={
                  (student?.enrollments as EnrollmentWithDetails[]) || []
                }
                studentData={student as StudentDetails}
              />
            </SkeletonWrapper>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
